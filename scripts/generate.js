/**
 * generate.js
 * スコアリング済み記事リストをGemini APIに渡し、
 * 以下テンプレートと同一の構造・デザインのHTMLを生成する。
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getDateStrings() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const day = days[now.getDay()];
  return {
    iso: `${yyyy}-${mm}-${dd}`,
    ja: `${yyyy}年${now.getMonth() + 1}月${now.getDate()}日（${day}）`,
    dir: `${yyyy}-${mm}-${dd}`,
  };
}

export async function generateHtml(articles) {
  const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  const dates = getDateStrings();

  const articleSummaries = articles
    .map((a, i) => `[記事${i + 1}] スコア:${a.score}/10\nタイトル: ${a.title}\nURL: ${a.url}\n要旨: ${a.description}\n評価理由: ${a.reason}`)
    .join('\n\n');

  const prompt = `
あなたは優秀なフロントエンドエンジニアです。
以下の【記事データ】をもとに、【HTMLテンプレート】の「★」で始まるプレースホルダーを実際の内容に置き換えた完全なHTMLを生成してください。

## 制約
- テンプレートのHTML構造・クラス・色・JavaScript は一切変更しないこと
- 記事数に応じてカード・図解パネル・クイズ問題を増減すること（最大5件）
- 記事タイトル・要旨が英語の場合は必ず日本語に翻訳すること
- 正解の CORRECT_ANSWERS オブジェクトは記事内容に基づき正確に設定すること
- コードブロック記法（\`\`\`html）は不要。<!DOCTYPE html>から</html>まで完全なHTMLのみを返すこと

## 記事データ
${articleSummaries}

## HTMLテンプレート
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>自動レポートツール ベストプラクティス調査 | ${dates.iso}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"M PLUS Rounded 1c"', '"Hiragino Maru Gothic ProN"', 'sans-serif'],
          },
          fontSize: {
            base: ['16px', { lineHeight: '1.9' }],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#f6f3ee] text-[#2c3648] font-sans min-h-screen overflow-x-hidden">

  <header class="bg-[#2d4a3e] text-white px-6 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center gap-3 mb-3">
        <span class="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded">毎朝配信</span>
        <time datetime="${dates.iso}" class="text-[#d1e0dc] text-sm">${dates.ja}</time>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mb-2">自動レポートツール ベストプラクティス調査</h1>
      <p class="text-[#d1e0dc] text-sm sm:text-base">テーマ：<span class="text-white font-medium">auto-report-tool × 自動化設計</span></p>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-10 space-y-10">

    <!-- SECTION 1 -->
    <section aria-labelledby="section1-heading">
      <div class="flex items-baseline justify-between mb-5">
        <h2 id="section1-heading" class="text-xs font-bold tracking-widest text-[#6b7583] uppercase">SECTION 1 ── 今日のニュース</h2>
        <span class="text-xs text-[#6b7583]">全★件数★件</span>
      </div>
      <div class="flex flex-col gap-4">

        <!-- ★記事の数だけ以下のarticleブロックを繰り返す★ -->
        <article class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] overflow-hidden">
          <button type="button"
            onclick="toggleNews('news1')"
            aria-expanded="false"
            aria-controls="news1-body"
            class="w-full flex items-start justify-between px-5 py-4 hover:bg-[#f0ebe4] transition-colors text-left min-h-[56px]">
            <div class="flex flex-wrap items-center gap-2 min-w-0 pr-3">
              <span class="text-xs font-bold text-[#3d5a50] bg-[#dceee9] px-2.5 py-1 rounded-full shrink-0">★カテゴリ名★</span>
              <span class="text-[#6b7583] text-xs font-medium shrink-0">★サイト名★</span>
              <span class="text-sm text-[#2c3648]">★日本語タイトル（最大2行）★</span>
            </div>
            <span id="news1-icon" class="text-[#6b7583] text-xs shrink-0 mt-1" aria-hidden="true">▶</span>
          </button>
          <div id="news1-body" class="hidden px-6 pb-6 border-t border-[#dfd6c9]">
            <p class="text-base font-bold leading-snug text-slate-900 mt-4 mb-3">
              <a href="★元記事URL★" target="_blank" rel="noopener" class="hover:text-[#2d4a3e] underline underline-offset-2">
                ★日本語フルタイトル★
              </a>
            </p>
            <p class="text-sm text-slate-600 leading-relaxed mb-4">★日本語要旨★</p>
            <ul class="space-y-1.5 mb-4">
              <li class="flex gap-2 text-sm text-slate-600"><span class="text-slate-400 shrink-0" aria-hidden="true">▸</span>★ポイント1★</li>
              <li class="flex gap-2 text-sm text-slate-600"><span class="text-slate-400 shrink-0" aria-hidden="true">▸</span>★ポイント2★</li>
              <li class="flex gap-2 text-sm text-slate-600"><span class="text-slate-400 shrink-0" aria-hidden="true">▸</span>★ポイント3★</li>
            </ul>
            <div class="pt-3 border-t border-[#dfd6c9] mb-4">
              <p class="text-xs text-slate-500 italic">この動きの意味：★この記事が示す業界・技術的意味★</p>
            </div>
            <div>
              <button type="button"
                onclick="toggleInsight('insight1')"
                aria-expanded="false"
                aria-controls="insight1"
                class="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors py-1">
                <span id="insight1-icon" aria-hidden="true">▶</span>
                <span>考察を開く</span>
              </button>
              <div id="insight1" class="hidden mt-3 p-4 bg-[#edf5f2] rounded-lg border border-[#c0d9d0]">
                <p class="text-sm text-slate-700 leading-relaxed">★auto-report-toolへの示唆・考察★</p>
              </div>
            </div>
          </div>
        </article>
        <!-- ★繰り返しここまで。news2, news3... と連番を変えること★ -->

      </div>
    </section>

    <!-- SECTION 2 -->
    <section aria-labelledby="section2-heading">
      <div class="flex items-baseline justify-between mb-5">
        <h2 id="section2-heading" class="text-xs font-bold tracking-widest text-[#6b7583] uppercase">SECTION 2 ── 構造図解</h2>
        <span class="text-xs text-[#6b7583]">記事ごと</span>
      </div>
      <div class="flex flex-col gap-6">

        <!-- ★記事の数だけ以下のdivブロックを繰り返す★ -->
        <div class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] p-5">
          <p class="text-sm font-bold text-slate-700 mb-4">① ★記事1の日本語タイトル（短縮版）★</p>
          <div class="flex flex-col md:flex-row md:items-start gap-3">
            <div class="flex-1 bg-[#3d5a50] text-white rounded-lg p-4 min-h-[80px]">
              <span class="text-xs font-bold text-slate-300 block mb-2">課題</span>
              <p class="text-sm leading-relaxed">★課題の内容★</p>
            </div>
            <div class="text-slate-400 font-bold text-center md:mt-8 md:text-lg text-2xl">
              <span class="md:hidden block">↓</span>
              <span class="hidden md:block">→</span>
            </div>
            <div class="flex-1 bg-[#3d5a50] text-white rounded-lg p-4 min-h-[80px]">
              <span class="text-xs font-bold text-slate-300 block mb-2">解決アプローチ</span>
              <p class="text-sm leading-relaxed">★解決アプローチの内容★</p>
            </div>
            <div class="text-slate-400 font-bold text-center md:mt-8 md:text-lg text-2xl">
              <span class="md:hidden block">↓</span>
              <span class="hidden md:block">→</span>
            </div>
            <div class="flex-1 bg-[#3d5a50] text-white rounded-lg p-4 min-h-[80px]">
              <span class="text-xs font-bold text-slate-300 block mb-2">得られる効果</span>
              <p class="text-sm leading-relaxed">★得られる効果の内容★</p>
            </div>
          </div>
          <div class="mt-4 bg-[#2d4a3e] text-[#d1e0dc] rounded-lg p-4 text-sm leading-relaxed">
            💡 示唆：★記事から得られる示唆・教訓★
          </div>
        </div>
        <!-- ★繰り返しここまで。②③...と連番を変えること★ -->

      </div>
    </section>

    <!-- SECTION 3 -->
    <section aria-labelledby="section3-heading">
      <div class="flex items-baseline justify-between mb-2">
        <h2 id="section3-heading" class="text-xs font-bold tracking-widest text-[#6b7583] uppercase">SECTION 3 ── 抽象化・概念化トレーニング</h2>
        <span class="text-xs text-[#6b7583]">全6問</span>
      </div>
      <p class="text-xs text-[#6b7583] mb-5">抽象化 ×2　概念化 ×2　アナロジー ×2</p>

      <div class="bg-white rounded-xl border border-[#dfd6c9] p-4 mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-[#6b7583]">回答済み</span>
          <span id="progress-text" class="text-xs font-bold text-[#2c3648]">0 / 6</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="6" aria-label="回答進捗">
          <div id="progress-bar" class="bg-[#4a7c6f] h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
      </div>

      <div class="flex flex-col gap-4">

        <!-- Q1: 抽象化 -->
        <div class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] border-l-4 border-l-[#b07070] overflow-hidden">
          <button type="button" onclick="toggleQuestion('q1')" aria-expanded="false" aria-controls="q1-question-body"
            class="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0ebe4] transition-colors text-left min-h-[56px]">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-bold text-[#b07070] bg-[#f5eaea] px-2 py-0.5 rounded shrink-0">抽象化</span>
              <span class="text-xs text-[#6b7583] shrink-0">Q1 / 6</span>
              <span class="text-sm text-[#2c3648]">★Q1の問題文（短縮）★</span>
            </div>
            <span id="q1-question-icon" class="text-[#6b7583] text-xs shrink-0 ml-3" aria-hidden="true">▶</span>
          </button>
          <div id="q1-question-body" class="hidden px-5 pb-5 border-t border-[#dfd6c9]">
            <p class="text-sm font-medium text-slate-800 mt-4 mb-4">★Q1の問題文（完全版）★</p>
            <div class="space-y-2 mb-4">
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors">
                <input type="radio" name="q1" value="A" class="mt-0.5 accent-[#4a7c6f] shrink-0">
                <span class="text-sm text-slate-700">A. ★選択肢A★</span>
              </label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors">
                <input type="radio" name="q1" value="B" class="mt-0.5 accent-[#4a7c6f] shrink-0">
                <span class="text-sm text-slate-700">B. ★選択肢B★</span>
              </label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors">
                <input type="radio" name="q1" value="C" class="mt-0.5 accent-[#4a7c6f] shrink-0">
                <span class="text-sm text-slate-700">C. ★選択肢C★</span>
              </label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors">
                <input type="radio" name="q1" value="D" class="mt-0.5 accent-[#4a7c6f] shrink-0">
                <span class="text-sm text-slate-700">D. ★選択肢D★</span>
              </label>
            </div>
            <p id="q1-error" class="hidden text-xs text-[#c53030] mb-2">選択肢を選んでから回答してください</p>
            <button type="button" data-qid="q1" onclick="answer(this)"
              class="text-xs font-bold bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#3d5a50] transition-colors">回答する</button>
            <div id="q1-result" class="hidden mt-4 p-4 bg-stone-100 rounded-lg border border-slate-200">
              <p id="q1-result-title" class="text-xs font-bold text-[#15803d] mb-2">✅ 正解！</p>
              <button type="button" onclick="toggleResult('q1')" aria-expanded="false" aria-controls="q1-result-body"
                class="text-xs text-[#4a7c6f] font-medium mb-2">
                <span id="q1-result-toggle">▶ 解説を開く</span>
              </button>
              <div id="q1-result-body" class="hidden text-sm text-slate-600 leading-relaxed">★Q1の解説★</div>
            </div>
          </div>
        </div>

        <!-- Q2: 抽象化 -->
        <div class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] border-l-4 border-l-[#b07070] overflow-hidden">
          <button type="button" onclick="toggleQuestion('q2')" aria-expanded="false" aria-controls="q2-question-body"
            class="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0ebe4] transition-colors text-left min-h-[56px]">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-bold text-[#b07070] bg-[#f5eaea] px-2 py-0.5 rounded shrink-0">抽象化</span>
              <span class="text-xs text-[#6b7583] shrink-0">Q2 / 6</span>
              <span class="text-sm text-[#2c3648]">★Q2の問題文（短縮）★</span>
            </div>
            <span id="q2-question-icon" class="text-[#6b7583] text-xs shrink-0 ml-3" aria-hidden="true">▶</span>
          </button>
          <div id="q2-question-body" class="hidden px-5 pb-5 border-t border-[#dfd6c9]">
            <p class="text-sm font-medium text-slate-800 mt-4 mb-4">★Q2の問題文（完全版）★</p>
            <div class="space-y-2 mb-4">
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q2" value="A" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">A. ★選択肢A★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q2" value="B" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">B. ★選択肢B★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q2" value="C" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">C. ★選択肢C★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q2" value="D" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">D. ★選択肢D★</span></label>
            </div>
            <p id="q2-error" class="hidden text-xs text-[#c53030] mb-2">選択肢を選んでから回答してください</p>
            <button type="button" data-qid="q2" onclick="answer(this)" class="text-xs font-bold bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#3d5a50] transition-colors">回答する</button>
            <div id="q2-result" class="hidden mt-4 p-4 bg-stone-100 rounded-lg border border-slate-200">
              <p id="q2-result-title" class="text-xs font-bold text-[#15803d] mb-2">✅ 正解！</p>
              <button type="button" onclick="toggleResult('q2')" aria-expanded="false" aria-controls="q2-result-body" class="text-xs text-[#4a7c6f] font-medium mb-2"><span id="q2-result-toggle">▶ 解説を開く</span></button>
              <div id="q2-result-body" class="hidden text-sm text-slate-600 leading-relaxed">★Q2の解説★</div>
            </div>
          </div>
        </div>

        <!-- Q3: 概念化 -->
        <div class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] border-l-4 border-l-[#6b8cad] overflow-hidden">
          <button type="button" onclick="toggleQuestion('q3')" aria-expanded="false" aria-controls="q3-question-body"
            class="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0ebe4] transition-colors text-left min-h-[56px]">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-bold text-[#6b8cad] bg-[#eaf0f7] px-2 py-0.5 rounded shrink-0">概念化</span>
              <span class="text-xs text-[#6b7583] shrink-0">Q3 / 6</span>
              <span class="text-sm text-[#2c3648]">★Q3の問題文（短縮）★</span>
            </div>
            <span id="q3-question-icon" class="text-[#6b7583] text-xs shrink-0 ml-3" aria-hidden="true">▶</span>
          </button>
          <div id="q3-question-body" class="hidden px-5 pb-5 border-t border-[#dfd6c9]">
            <p class="text-sm font-medium text-slate-800 mt-4 mb-4">★Q3の問題文（完全版）★</p>
            <div class="space-y-2 mb-4">
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q3" value="A" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">A. ★選択肢A★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q3" value="B" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">B. ★選択肢B★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q3" value="C" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">C. ★選択肢C★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q3" value="D" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">D. ★選択肢D★</span></label>
            </div>
            <p id="q3-error" class="hidden text-xs text-[#c53030] mb-2">選択肢を選んでから回答してください</p>
            <button type="button" data-qid="q3" onclick="answer(this)" class="text-xs font-bold bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#3d5a50] transition-colors">回答する</button>
            <div id="q3-result" class="hidden mt-4 p-4 bg-stone-100 rounded-lg border border-slate-200">
              <p id="q3-result-title" class="text-xs font-bold text-[#15803d] mb-2">✅ 正解！</p>
              <button type="button" onclick="toggleResult('q3')" aria-expanded="false" aria-controls="q3-result-body" class="text-xs text-[#4a7c6f] font-medium mb-2"><span id="q3-result-toggle">▶ 解説を開く</span></button>
              <div id="q3-result-body" class="hidden text-sm text-slate-600 leading-relaxed">★Q3の解説★</div>
            </div>
          </div>
        </div>

        <!-- Q4: 概念化 -->
        <div class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] border-l-4 border-l-[#6b8cad] overflow-hidden">
          <button type="button" onclick="toggleQuestion('q4')" aria-expanded="false" aria-controls="q4-question-body"
            class="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0ebe4] transition-colors text-left min-h-[56px]">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-bold text-[#6b8cad] bg-[#eaf0f7] px-2 py-0.5 rounded shrink-0">概念化</span>
              <span class="text-xs text-[#6b7583] shrink-0">Q4 / 6</span>
              <span class="text-sm text-[#2c3648]">★Q4の問題文（短縮）★</span>
            </div>
            <span id="q4-question-icon" class="text-[#6b7583] text-xs shrink-0 ml-3" aria-hidden="true">▶</span>
          </button>
          <div id="q4-question-body" class="hidden px-5 pb-5 border-t border-[#dfd6c9]">
            <p class="text-sm font-medium text-slate-800 mt-4 mb-4">★Q4の問題文（完全版）★</p>
            <div class="space-y-2 mb-4">
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q4" value="A" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">A. ★選択肢A★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q4" value="B" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">B. ★選択肢B★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q4" value="C" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">C. ★選択肢C★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q4" value="D" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">D. ★選択肢D★</span></label>
            </div>
            <p id="q4-error" class="hidden text-xs text-[#c53030] mb-2">選択肢を選んでから回答してください</p>
            <button type="button" data-qid="q4" onclick="answer(this)" class="text-xs font-bold bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#3d5a50] transition-colors">回答する</button>
            <div id="q4-result" class="hidden mt-4 p-4 bg-stone-100 rounded-lg border border-slate-200">
              <p id="q4-result-title" class="text-xs font-bold text-[#15803d] mb-2">✅ 正解！</p>
              <button type="button" onclick="toggleResult('q4')" aria-expanded="false" aria-controls="q4-result-body" class="text-xs text-[#4a7c6f] font-medium mb-2"><span id="q4-result-toggle">▶ 解説を開く</span></button>
              <div id="q4-result-body" class="hidden text-sm text-slate-600 leading-relaxed">★Q4の解説★</div>
            </div>
          </div>
        </div>

        <!-- Q5: アナロジー -->
        <div class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] border-l-4 border-l-[#5a9678] overflow-hidden">
          <button type="button" onclick="toggleQuestion('q5')" aria-expanded="false" aria-controls="q5-question-body"
            class="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0ebe4] transition-colors text-left min-h-[56px]">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-bold text-[#5a9678] bg-[#eaf3ee] px-2 py-0.5 rounded shrink-0">アナロジー</span>
              <span class="text-xs text-[#6b7583] shrink-0">Q5 / 6</span>
              <span class="text-sm text-[#2c3648]">★Q5の問題文（短縮）★</span>
            </div>
            <span id="q5-question-icon" class="text-[#6b7583] text-xs shrink-0 ml-3" aria-hidden="true">▶</span>
          </button>
          <div id="q5-question-body" class="hidden px-5 pb-5 border-t border-[#dfd6c9]">
            <p class="text-sm font-medium text-slate-800 mt-4 mb-4">★Q5の問題文（完全版）★</p>
            <div class="space-y-2 mb-4">
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q5" value="A" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">A. ★選択肢A★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q5" value="B" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">B. ★選択肢B★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q5" value="C" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">C. ★選択肢C★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q5" value="D" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">D. ★選択肢D★</span></label>
            </div>
            <p id="q5-error" class="hidden text-xs text-[#c53030] mb-2">選択肢を選んでから回答してください</p>
            <button type="button" data-qid="q5" onclick="answer(this)" class="text-xs font-bold bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#3d5a50] transition-colors">回答する</button>
            <div id="q5-result" class="hidden mt-4 p-4 bg-stone-100 rounded-lg border border-slate-200">
              <p id="q5-result-title" class="text-xs font-bold text-[#15803d] mb-2">✅ 正解！</p>
              <button type="button" onclick="toggleResult('q5')" aria-expanded="false" aria-controls="q5-result-body" class="text-xs text-[#4a7c6f] font-medium mb-2"><span id="q5-result-toggle">▶ 解説を開く</span></button>
              <div id="q5-result-body" class="hidden text-sm text-slate-600 leading-relaxed">★Q5の解説★</div>
            </div>
          </div>
        </div>

        <!-- Q6: アナロジー -->
        <div class="bg-white rounded-xl shadow-sm border border-[#dfd6c9] border-l-4 border-l-[#5a9678] overflow-hidden">
          <button type="button" onclick="toggleQuestion('q6')" aria-expanded="false" aria-controls="q6-question-body"
            class="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0ebe4] transition-colors text-left min-h-[56px]">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-xs font-bold text-[#5a9678] bg-[#eaf3ee] px-2 py-0.5 rounded shrink-0">アナロジー</span>
              <span class="text-xs text-[#6b7583] shrink-0">Q6 / 6</span>
              <span class="text-sm text-[#2c3648]">★Q6の問題文（短縮）★</span>
            </div>
            <span id="q6-question-icon" class="text-[#6b7583] text-xs shrink-0 ml-3" aria-hidden="true">▶</span>
          </button>
          <div id="q6-question-body" class="hidden px-5 pb-5 border-t border-[#dfd6c9]">
            <p class="text-sm font-medium text-slate-800 mt-4 mb-4">★Q6の問題文（完全版）★</p>
            <div class="space-y-2 mb-4">
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q6" value="A" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">A. ★選択肢A★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q6" value="B" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">B. ★選択肢B★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q6" value="C" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">C. ★選択肢C★</span></label>
              <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#f0ebe4] transition-colors"><input type="radio" name="q6" value="D" class="mt-0.5 accent-[#4a7c6f] shrink-0"><span class="text-sm text-slate-700">D. ★選択肢D★</span></label>
            </div>
            <p id="q6-error" class="hidden text-xs text-[#c53030] mb-2">選択肢を選んでから回答してください</p>
            <button type="button" data-qid="q6" onclick="answer(this)" class="text-xs font-bold bg-[#2d4a3e] text-white px-4 py-2 rounded-lg hover:bg-[#3d5a50] transition-colors">回答する</button>
            <div id="q6-result" class="hidden mt-4 p-4 bg-stone-100 rounded-lg border border-slate-200">
              <p id="q6-result-title" class="text-xs font-bold text-[#15803d] mb-2">✅ 正解！</p>
              <button type="button" onclick="toggleResult('q6')" aria-expanded="false" aria-controls="q6-result-body" class="text-xs text-[#4a7c6f] font-medium mb-2"><span id="q6-result-toggle">▶ 解説を開く</span></button>
              <div id="q6-result-body" class="hidden text-sm text-slate-600 leading-relaxed">★Q6の解説★</div>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-8 text-center">
        <button id="summary-btn" type="button" onclick="toggleSummary()"
          aria-expanded="false" aria-controls="brief-summary"
          class="bg-[#2d4a3e] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#3d5a50] transition-colors text-sm">
          ▶ 今日のまとめを見る
        </button>
      </div>

      <div id="brief-summary" class="hidden mt-6 bg-white rounded-xl border border-[#dfd6c9] p-6" tabindex="-1">
        <p class="text-xs font-bold tracking-widest text-[#6b7583] uppercase mb-4">TODAY'S SUMMARY</p>
        <p class="text-sm text-slate-700 mb-2">スコア：<span id="score-display" class="font-bold text-slate-900">0</span> / <span id="total-display" class="font-bold text-slate-900">6</span> 問正解</p>
        <div class="space-y-3 mt-4 text-sm text-slate-600 leading-relaxed">
          <p>📌 ★まとめポイント1★</p>
          <p>📌 ★まとめポイント2★</p>
          <p>📌 ★まとめポイント3★</p>
        </div>
      </div>

    </section>

  </main>

  <footer class="text-center text-xs text-[#6b7583] py-8 border-t border-[#dfd6c9] mt-4">
    自動生成レポート — auto-report-tool by taiga5fi
  </footer>

  <script>
    const TOTAL_QUESTIONS = 6;
    const CORRECT_ANSWERS = { q1: '★正解★', q2: '★正解★', q3: '★正解★', q4: '★正解★', q5: '★正解★', q6: '★正解★' };
    const answered = new Set();
    let correctCount = 0;

    function togglePanel(panelId, iconId, openIcon = '▼', closedIcon = '▶') {
      const panel = document.getElementById(panelId);
      const isHidden = panel.classList.contains('hidden');
      panel.classList.toggle('hidden', !isHidden);
      if (iconId) {
        const icon = document.getElementById(iconId);
        if (icon) icon.textContent = isHidden ? openIcon : closedIcon;
      }
      const btn = document.querySelector('[aria-controls="' + panelId + '"]');
      if (btn) btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    }

    function toggleQuestion(id) { togglePanel(id + '-question-body', id + '-question-icon'); }
    function toggleInsight(id) { togglePanel(id, id + '-icon'); }
    function toggleResult(id) { togglePanel(id + '-result-body', id + '-result-toggle', '▼ 解説を閉じる', '▶ 解説を開く'); }

    function toggleNews(id) {
      const body = document.getElementById(id + '-body');
      const isCurrentlyOpen = !body.classList.contains('hidden');
      togglePanel(id + '-body', id + '-icon');
      if (isCurrentlyOpen) {
        const num = id.replace('news', '');
        const insightBody = document.getElementById('insight' + num);
        const insightIcon = document.getElementById('insight' + num + '-icon');
        const insightBtn = document.querySelector('[aria-controls="insight' + num + '"]');
        if (insightBody && !insightBody.classList.contains('hidden')) {
          insightBody.classList.add('hidden');
          if (insightIcon) insightIcon.textContent = '▶';
          if (insightBtn) insightBtn.setAttribute('aria-expanded', 'false');
        }
      }
    }

    function answer(btn) {
      const questionId = btn.dataset.qid;
      if (answered.has(questionId)) return;
      const selected = document.querySelector('input[name="' + questionId + '"]:checked');
      const errorEl = document.getElementById(questionId + '-error');
      if (!selected) { errorEl.classList.remove('hidden'); return; }
      errorEl.classList.add('hidden');
      answered.add(questionId);
      const correctAnswer = CORRECT_ANSWERS[questionId];
      const isCorrect = selected.value === correctAnswer;
      if (isCorrect) correctCount++;
      document.querySelectorAll('input[name="' + questionId + '"]').forEach(input => {
        const label = input.parentElement;
        if (input.value === correctAnswer) label.classList.add('bg-green-50', 'border-green-300');
        else if (input.value === selected.value && !isCorrect) label.classList.add('bg-red-50', 'border-red-300');
        input.disabled = true;
        label.classList.remove('cursor-pointer', 'hover:bg-[#f0ebe4]');
      });
      const result = document.getElementById(questionId + '-result');
      const resultTitle = document.getElementById(questionId + '-result-title');
      if (!isCorrect) {
        resultTitle.textContent = '❌ 不正解（正解：' + correctAnswer + '）';
        resultTitle.classList.replace('text-[#15803d]', 'text-[#c53030]');
      }
      result.classList.remove('hidden');
      // 解説を自動で開く
      const resultBody = document.getElementById(questionId + '-result-body');
      const resultToggle = document.getElementById(questionId + '-result-toggle');
      if (resultBody) resultBody.classList.remove('hidden');
      if (resultToggle) resultToggle.textContent = '▼ 解説を閉じる';
      const answerBtn = document.querySelector('button[data-qid="' + questionId + '"]');
      answerBtn.disabled = true;
      answerBtn.classList.add('opacity-40', 'cursor-not-allowed');
      updateProgress();
    }

    function updateProgress() {
      const count = answered.size;
      document.getElementById('progress-text').textContent = count + ' / ' + TOTAL_QUESTIONS;
      const pct = (count / TOTAL_QUESTIONS) * 100;
      const bar = document.getElementById('progress-bar');
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', count);
    }

    function toggleSummary() {
      const summary = document.getElementById('brief-summary');
      const btn = document.getElementById('summary-btn');
      const isHidden = summary.classList.contains('hidden');
      if (isHidden) {
        document.getElementById('score-display').textContent = correctCount;
        document.getElementById('total-display').textContent = TOTAL_QUESTIONS;
        summary.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.innerHTML = '▼ 今日のまとめを見る';
        summary.focus();
      } else {
        summary.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '▶ 今日のまとめを見る';
      }
    }
  </script>

</body>
</html>
`.trim();

  async function withRetry(fn, retries = 3, delayMs = 15000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        const isRetryable =
          err.message?.includes('503') ||
          err.message?.includes('429') ||
          err.message?.includes('overloaded');
        if (isRetryable && i < retries - 1) {
          console.log(`  ⏳ APIが混雑中、${delayMs / 1000}秒後にリトライ (${i + 1}/${retries - 1})...`);
          await new Promise(r => setTimeout(r, delayMs));
        } else {
          throw err;
        }
      }
    }
  }

  console.log('🤖 Gemini APIでHTML生成中...');
  const result = await withRetry(() => model.generateContent(prompt));
  let html = result.response.text().trim();

  html = html.replace(/^```html\s*/i, '').replace(/\s*```$/, '');

  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
    throw new Error('GeminiがHTMLを正しく返しませんでした');
  }

  const outDir = join('output', dates.dir);
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, 'index.html');
  await writeFile(outPath, html, 'utf8');
  console.log(`✅ HTML生成完了: ${outPath}`);

  return { outDir, outPath, dates };
}
