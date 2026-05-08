/**
 * run.js
 * 全ステップを順番に実行するメインオーケストレーター。
 * GitHub Actionsから呼ばれる: node scripts/run.js
 */
import { searchAndScore } from './search.js';
import { generateHtml } from './generate.js';
import { deploy } from './deploy.js';
import { sendNotification } from './notify.js';

// 必須環境変数のチェック
const REQUIRED_ENV = [
  'BRAVE_API_KEY',
  'GEMINI_API_KEY',
  'SURGE_TOKEN',
  'GMAIL_USER',
  'GMAIL_APP_PASSWORD',
  'NOTIFY_TO',
];

function checkEnv() {
  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`環境変数が不足しています: ${missing.join(', ')}`);
  }
}

async function main() {
  console.log('=== 自動レポートツール 開始 ===');

  checkEnv();

  // Step 1: 検索・スコアリング
  console.log('\n--- Step 1: 検索・スコアリング ---');
  const articles = await searchAndScore();
  console.log(`\n収集記事数: ${articles.length}件`);
  articles.forEach((a, i) => {
    console.log(`  ${i + 1}. [${a.score}/10] ${a.title}`);
  });

  if (articles.length === 0) {
    throw new Error('有効な記事が見つかりませんでした');
  }

  // Step 2: HTML生成
  console.log('\n--- Step 2: HTML生成 ---');
  const { outDir, dates } = await generateHtml(articles);

  // Step 3: surge.shにデプロイ
  console.log('\n--- Step 3: surge.shデプロイ ---');
  const url = await deploy(outDir);

  // Step 4: メール通知
  console.log('\n--- Step 4: メール通知 ---');
  await sendNotification(url, dates.ja, articles);

  console.log('\n=== 完了 ===');
  console.log(`URL: ${url}`);
}

main().catch(err => {
  console.error('エラーが発生しました:', err);
  process.exit(1);
});
