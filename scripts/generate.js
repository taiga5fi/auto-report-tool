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
- Google Fonts: Noto Sans JP (400,500,600,700)
- 背景: bg-stone-100, テキスト: text-slate-800
- ヘッダー: bg-slate-900 text-white、最大幅 max-w-4xl mx-auto
- メインコンテンツ: max-w-4xl mx-auto px-4 py-10 space-y-10
- カード: bg-stone-50 rounded-xl shadow-sm border border-slate-200
- tailwind.config でフォントとline-heightを設定すること
- カラーパレットは必ずslate/stone系のみ使用（原色・vivid色は絶対禁止）
- カテゴリバッジは bg-slate-100 text-slate-600 のみ（カラフルにしない）
- **スマホ（iPhone）とPC両対応のレスポンシブデザイン必須**
  - フロー図はスマホで縦並び（flex-col）、PCで横並び（md:flex-row）
  - テキストは最小14px以上、ボタンはタップしやすいサイズ（min-height 44px）
  - 横スクロールが発生しないよう overflow-x-hidden をbodyに設定

### 言語ルール
- 記事タイトル・要旨・ポイントが英語の場合は**必ず日本語に翻訳**して表示する
- 英語のまま表示することは禁止

### SECTION 1 — 今日のニュース
- 記事を最大5件カード表示
- 各カードはアコーディオン（クリックで展開）
- カードヘッダー行: カテゴリバッジ（bg-slate-100 text-slate-600）・サイト名（text-slate-400）・タイトル冒頭（日本語）・▶アイコン
- **タイトルは元記事URLへのリンク（<a href="URL" target="_blank" rel="noopener">）にする**
- 展開後: 日本語フルタイトル（リンク付き）・日本語要旨・日本語箇条書きポイント3つ・「この動きの意味」・考察トグル
- aria-expanded / aria-controls を正しく設定

### SECTION 2 — 構造図解（記事ごと）
- 記事1件ごとに独立したフロー図パネルを作成（記事数分）
- 各パネルのタイトルは記事の日本語タイトル（短縮版）
- フロー図: 「課題」→「解決アプローチ」→「得られる効果」の3ステップ
- **レスポンシブ**: スマホは縦並び（flex-col gap-3）、PCは横並び（md:flex-row）
- 各ステップのボックス: bg-slate-700 text-white rounded-lg p-3（原色禁止）
- ステップ間の矢印: スマホは↓、PCは→（md:inline hidden切替）
- パネル末尾に bg-slate-800 text-slate-200 rounded-lg p-3 の「示唆」1行テキストを配置

### SECTION 3 — 抽象化・概念化トレーニング
- セクションタイトル: 「抽象化・概念化トレーニング」
- サブタイトル: 「抽象化 ×2　概念化 ×2　アナロジー ×2」
- 記事内容から6問（抽象化2問・概念化2問・アナロジー2問）
- 各問はアコーディオン形式（クリックで展開）
- 問題タイプのバッジと左ボーダー色:
  - 抽象化: border-l-4 border-l-rose-400、バッジ text-rose-500 bg-rose-50
  - 概念化: border-l-4 border-l-blue-400、バッジ text-blue-500 bg-blue-50
  - アナロジー: border-l-4 border-l-emerald-400、バッジ text-emerald-500 bg-emerald-50
- 各問展開後: 4択ラジオボタン（正解はA〜Dのいずれか、記事内容に基づいた正確な正解）＋「回答する」ボタン＋解説
- 回答後: 正解緑（bg-green-50 border-green-300）・不正解赤（bg-red-50 border-red-300）
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
