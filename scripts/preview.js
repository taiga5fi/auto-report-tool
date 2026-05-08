/**
 * preview.js
 * ローカルでHTML生成のみ実行するプレビュー用スクリプト。
 * デプロイ・メール送信はスキップする。
 * 使い方: node scripts/preview.js
 */
import { searchAndScore } from './search.js';
import { generateHtml } from './generate.js';
import { exec } from 'child_process';
import { resolve } from 'path';

const REQUIRED_ENV = ['BRAVE_API_KEY', 'GEMINI_API_KEY'];

function checkEnv() {
  const missing = REQUIRED_ENV.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`環境変数が不足しています: ${missing.join(', ')}`);
  }
}

async function main() {
  console.log('=== プレビュー生成 開始 ===');
  checkEnv();

  console.log('\n--- Step 1: 検索・スコアリング ---');
  const articles = await searchAndScore();
  console.log(`\n収集記事数: ${articles.length}件`);

  console.log('\n--- Step 2: HTML生成 ---');
  const { outPath } = await generateHtml(articles);

  const absPath = resolve(outPath);
  console.log(`\n✅ プレビューファイル: ${absPath}`);
  console.log('\nブラウザで開いています...');

  // Windowsでブラウザを開く
  exec(`start "" "${absPath}"`);
}

main().catch(err => {
  console.error('エラー:', err.message);
  process.exit(1);
});
