/**
 * deploy.js
 * surge CLIを使ってoutput/YYYY-MM-DDディレクトリをsurge.shにデプロイする。
 */
import { execSync } from 'child_process';

const SURGE_TOKEN = process.env.SURGE_TOKEN;
const SURGE_DOMAIN = 'taiga-auto-report.surge.sh';

/**
 * surge CLIでデプロイし、公開URLを返す
 */
export async function deploy(outDir) {
  console.log(`🚀 surge.shにデプロイ中: ${SURGE_DOMAIN}`);

  try {
    execSync(
      `npx surge ${outDir} ${SURGE_DOMAIN} --token ${SURGE_TOKEN}`,
      { stdio: 'inherit' }
    );
  } catch (err) {
    throw new Error(`surgeデプロイ失敗: ${err.message}`);
  }

  const url = `https://${SURGE_DOMAIN}`;
  console.log(`✅ デプロイ完了: ${url}`);
  return url;
}
