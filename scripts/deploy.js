/**
 * deploy.js
 * surge CLIを使ってoutput/YYYY-MM-DDディレクトリをsurge.shにデプロイする。
 * 日付入りURLで過去レポートを保存する。
 */
import { execSync } from 'child_process';

const SURGE_TOKEN = process.env.SURGE_TOKEN;

/** 今日の日付文字列を取得（JST基準） */
function getDateSlug() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  // 1日3回実行するため時刻も含めて区別
  const hh = String(now.getHours()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}`;
}

export async function deploy(outDir) {
  const slug = getDateSlug();
  const domain = `taiga-report-${slug}.surge.sh`;
  console.log(`🚀 surge.shにデプロイ中: ${domain}`);

  try {
    execSync(
      `npx surge ${outDir} ${domain} --token ${SURGE_TOKEN}`,
      { stdio: 'inherit' }
    );
  } catch (err) {
    throw new Error(`surgeデプロイ失敗: ${err.message}`);
  }

  const url = `https://${domain}`;
  console.log(`✅ デプロイ完了: ${url}`);
  return url;
}
