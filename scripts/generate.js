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
  const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
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
- Google Fonts: Noto Sans JP (400,500,600,700)
- 背景: bg-stone-100, テキスト: text-slate-800
- ヘッダー: bg-slate-900 text-white、最大幅 max-w-4xl mx-auto
- メインコンテンツ: max-w-4xl mx-auto px-4 py-10 space-y-10
- カード: bg-stone-50 rounded-xl shadow-sm border border-slate-200
- tailwind.config でフォントとline-heightを設定すること

### 構成（3セクション必須）

**SECTION 1 — 今日のニュース**
- 記事を最大5件カード表示
- 各カードはアコーディオン（クリックで展開）
- ヘッダー行: カテゴリバッジ・サイト名・タイトル冒頭・▶アイコン
- 展開後: フルタイトル・要旨・箇条書きポイント3つ・「この動きの意味」・考察トグル
- スコアバッジ（例: 「9点」）を右端に表示
- aria-expanded / aria-controls を正しく設定

**SECTION 2 — 構造図解**
- 記事全体から読み取れる「自動レポートツールのベストプラクティス」を構造化
- 横スクロール可能なフロー図（overflow-x-auto）で「課題 → アーキテクチャ → 効果」を表現
- bg-slate-800 text-white の「今日の示唆」calloutを末尾に配置

**SECTION 3 — 学習クイズ**
- 記事内容から3問のクイズ（4択ラジオボタン）
- 正解はBとは限らない（記事内容に基づいた正確な正解を設定）
- 回答後: 正解緑・不正解赤でハイライト + 解説表示
- 進捗バー（answered/total）を表示
- 全問回答後に「まとめ」パネルを表示

### JavaScript要件
- 全てインラインscriptタグ内に記述
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

### HTMLのみを出力してください
\`\`\`html から始まるコードブロックは不要です。
<!DOCTYPE html> から </html> まで完全なHTMLのみを返してください。
余計な説明文やコメントは一切不要です。
`.trim();

  console.log('🤖 Gemini APIでHTML生成中...');
  const result = await model.generateContent(prompt);
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
