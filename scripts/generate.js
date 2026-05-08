/**
 * generate.js
 * スコアリング済み記事リストをGemini APIに渡し、
 * competitor-morning-briefと同じ構成・デザインのHTMLを生成する。
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * 日付文字列を生成 (YYYY-MM-DD / YYYY年M月D日（曜日）)
 */
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

/**
 * Gemini APIでHTMLを生成する
 */
export async function generateHtml(articles) {
  const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  const dates = getDateStrings();

  const articleSummaries = articles
    .map((a, i) => `[記事${i + 1}] スコア:${a.score}/10\nタイトル: ${a.title}\nURL: ${a.url}\n要旨: ${a.description}\n評価理由: ${a.reason}`)
    .join('\n\n');

  const prompt = `
あなたは優秀なフロントエンドエンジニアです。
以下のスコアリング済み記事をもとに、日本語の自動レポートHTMLを生成してください。

## 対象記事
${articleSummaries}

## 生成するHTMLの仕様

### デザイン・技術要件
- Tailwind CSS CDN（https://cdn.tailwindcss.com）を使用
- Google Fonts: **M PLUS Rounded 1c** (400,500,700) を使用
  - `<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap" rel="stylesheet">`
  - tailwind.config: `sans: ['"M PLUS Rounded 1c"', '"Hiragino Maru Gothic ProN"', 'sans-serif']`
- **配色（必ず以下のカスタムカラーを使用・Tailwindのデフォルト色は使わない）**:
  - body背景: `bg-[#f6f3ee]` テキスト: `text-[#2c3648]`
  - ヘッダー: `bg-[#2d4a3e] text-white`
  - ヘッダー内の日付・サブテキスト: `text-[#d1e0dc]`（暗背景上でのコントラスト確保）
  - カード背景: `bg-white` ボーダー: `border-[#dfd6c9]`
  - カードホバー: `hover:bg-[#f0ebe4]`
  - フロー図ボックス: `bg-[#3d5a50] text-white`
  - 示唆ボックス: `bg-[#2d4a3e] text-[#d1e0dc]`
  - 考察エリア: `bg-[#edf5f2] border-[#c0d9d0]`
  - 進捗バー: `bg-[#4a7c6f]`
  - カテゴリバッジ: `bg-[#dceee9] text-[#3d5a50]`
  - ボタン: `bg-[#2d4a3e] hover:bg-[#3d5a50] text-white`
  - セクション区切り: `border-[#dfd6c9]`
  - セクション見出し・補助テキスト（薄い文字）: `text-[#6b7583]`（白背景でのAA基準を満たすグレー）
  - エラー文: `text-[#c53030]`、正解文: `text-[#15803d]`

### 言語ルール
- 記事タイトル・要旨・ポイントが英語の場合は**必ず日本語に翻訳**して表示する
- 英語のまま表示することは禁止

### SECTION 1 — 今日のニュース
- 記事を最大5件カード表示
- 各カードはアコーディオン（クリックで展開）
- カードヘッダー行: カテゴリバッジ（bg-[#dceee9] text-[#3d5a50]）・サイト名（text-[#6b7583] text-xs）・タイトル冒頭（日本語・text-sm text-[#2c3648]）・▶アイコン（text-[#6b7583]）
- タイトルは truncate を使わず、最大2行で折り返す（line-clamp-2）
- **タイトルは元記事URLへのリンク（<a href="URL" target="_blank" rel="noopener">）にする**
- 展開後: 日本語フルタイトル（リンク付き）・日本語要旨（text-sm leading-relaxed）・日本語箇条書きポイント3つ・「この動きの意味」・考察トグル
- aria-expanded / aria-controls を正しく設定

### SECTION 2 — 構造図解（記事ごと）
- 記事1件ごとに独立したフロー図パネルを作成（記事数分）
- 各パネルのタイトルは記事の日本語タイトル（短縮版）
- フロー図: 「課題」→「解決アプローチ」→「得られる効果」の3ステップ
- **レスポンシブ**: スマホは縦並び（flex-col gap-4）、PCは横並び（md:flex-row md:items-start）
- 各ステップのボックス:
  - bg-slate-700 text-white rounded-lg p-4 flex-1（原色禁止）
  - ラベル（「課題」等）: text-xs font-bold text-slate-300 mb-2 block
  - 本文: text-sm leading-relaxed（テキストは絶対に切らない・折り返す）
  - min-h-[80px] を設定してボックスが潰れないようにする
- ステップ間の矢印: スマホは「↓」をtext-center、PCは「→」をmt-8（md:block hidden切替）
- パネル末尾に bg-slate-800 text-slate-200 rounded-lg p-4 text-sm leading-relaxed の「示唆」テキストを配置

### SECTION 3 — 抽象化・概念化トレーニング
- セクションタイトル: 「抽象化・概念化トレーニング」
- サブタイトル: 「抽象化 ×2　概念化 ×2　アナロジー ×2」
- 記事内容から6問（抽象化2問・概念化2問・アナロジー2問）
- 各問はアコーディオン形式（クリックで展開）
- 問題タイプのバッジと左ボーダー色:
  - 抽象化: border-l-4 border-l-[#b07070]、バッジ text-[#b07070] bg-[#f5eaea]
  - 概念化: border-l-4 border-l-[#6b8cad]、バッジ text-[#6b8cad] bg-[#eaf0f7]
  - アナロジー: border-l-4 border-l-[#5a9678]、バッジ text-[#5a9678] bg-[#eaf3ee]
- 各問展開後: 4択ラジオボタン（正解はA〜Dのいずれか、記事内容に基づいた正確な正解）＋「回答する」ボタン＋解説
- 回答後: 正解（bg-green-50 border-[#15803d] text-[#15803d]）・不正解（bg-red-50 border-[#c53030] text-[#c53030]）
- 進捗バー（answered/total）表示
- 全問回答後に「まとめ」パネルを表示

### JavaScript要件
- 全てインラインscriptタグ内に記述
- const TOTAL_QUESTIONS = 6; を定義
- togglePanel(panelId, iconId, openIcon, closedIcon) を基底関数として使用
- toggleNews(id)・toggleInsight(id)・toggleQuestion(id)・toggleResult(id) のラッパーを実装
- answer(btn) 関数でdata-qid属性からクイズ処理
- updateProgress() で進捗バー更新
- toggleSummary() でまとめパネル制御

### ヘッダー情報
- タイトル: 「自動レポートツール ベストプラクティス調査」
- 日付: ${dates.ja}
- datetime属性: ${dates.iso}
- テーマ: 「auto-report-tool × 自動化設計」

### 出力ルール
\`\`\`html から始まるコードブロックは不要です。
<!DOCTYPE html> から </html> まで完全なHTMLのみを返してください。
余計な説明文・コメントは一切不要です。
`.trim();

  /**
   * リトライラッパー（503/429対応）
   */
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

  // コードブロック記法が含まれていた場合は除去
  html = html.replace(/^```html\s*/i, '').replace(/\s*```$/, '');

  if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
    throw new Error('GeminiがHTMLを正しく返しませんでした');
  }

  // output/YYYY-MM-DD/index.html に保存
  const outDir = join('output', dates.dir);
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, 'index.html');
  await writeFile(outPath, html, 'utf8');
  console.log(`✅ HTML生成完了: ${outPath}`);

  return { outDir, outPath, dates };
}
