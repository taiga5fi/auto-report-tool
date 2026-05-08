/**
 * search.js
 * Brave Search APIで多言語検索し、Gemini APIで各結果を1〜10点スコアリングする。
 * 10点が出た時点で検索を停止し、top5件を返す。
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BRAVE_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';
const TOPIC = 'auto-report-tool ベストプラクティス';

// 多言語・多角度のクエリリスト
const QUERIES = [
  'auto report tool best practices 2026',
  '自動レポートツール ベストプラクティス 2026',
  'automated reporting workflow GitHub Actions best practices',
  'レポート自動化 設計パターン',
  'report automation AI HTML generation workflow',
];

/**
 * Brave Search APIを呼び出して検索結果を取得する
 */
async function braveSearch(query, lang = 'en') {
  const params = new URLSearchParams({
    q: query,
    count: '10',
    freshness: 'py',  // 過去1年
    search_lang: lang,
    extra_snippets: 'true',
  });
  const res = await fetch(`${BRAVE_ENDPOINT}?${params}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': BRAVE_API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`Brave Search APIエラー: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data.web?.results ?? []).map(r => ({
    title: r.title,
    url: r.url,
    description: r.description ?? '',
    extra_snippets: r.extra_snippets ?? [],
  }));
}

/**
 * Gemini APIで記事を1〜10点でスコアリングする
 */
async function scoreResult(genai, result) {
  const model = genai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = `
あなたはレポート自動化の専門家です。以下の記事を「${TOPIC}」という調査テーマへの有用性で1〜10点評価してください。

【タイトル】${result.title}
【URL】${result.url}
【説明】${result.description}
${result.extra_snippets.length > 0 ? `【追加抜粋】${result.extra_snippets.slice(0, 2).join(' / ')}` : ''}

評価基準:
- 10点: テーマに完全一致する決定的な情報
- 7〜9点: テーマに強く関連する有益な情報
- 4〜6点: 部分的に関連する情報
- 1〜3点: ほぼ関係ない情報

必ずJSON形式のみで返してください（他のテキスト不要）:
{"score": 数値, "reason": "理由を1文で"}
`.trim();

  const response = await model.generateContent(prompt);
  const text = response.response.text().trim();

  // JSON部分だけ抽出
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) return { score: 1, reason: 'パース失敗' };

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      score: Math.min(10, Math.max(1, Number(parsed.score) || 1)),
      reason: parsed.reason ?? '',
    };
  } catch {
    return { score: 1, reason: 'パース失敗' };
  }
}

/**
 * メイン: 多言語検索 → スコアリング → top5を返す
 * 10点が出た時点で即停止
 */
export async function searchAndScore() {
  const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
  const scored = [];
  const seenUrls = new Set();

  for (const query of QUERIES) {
    const lang = /[ぁ-ん]/.test(query) ? 'ja' : 'en';
    console.log(`🔍 検索中: "${query}"`);

    let results;
    try {
      results = await braveSearch(query, lang);
    } catch (err) {
      console.warn(`検索スキップ (${query}):`, err.message);
      continue;
    }

    for (const result of results) {
      if (seenUrls.has(result.url)) continue;
      seenUrls.add(result.url);

      const { score, reason } = await scoreResult(genai, result);
      console.log(`  [${score}/10] ${result.title.slice(0, 60)}`);

      scored.push({ ...result, score, reason });

      if (score === 10) {
        console.log('✅ 10点の記事を発見！検索を停止します。');
        return sortAndLimit(scored);
      }
    }
  }

  return sortAndLimit(scored);
}

function sortAndLimit(scored) {
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
