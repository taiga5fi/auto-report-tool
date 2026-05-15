/**
 * search.js
 * Brave Search APIで多言語検索し、Gemini APIで各結果を1〜10点スコアリングする。
 * 10点が出た時点で検索を停止し、top5件を返す。
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BRAVE_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';

/**
 * 曜日ごとのテーマ設定（JST基準）
 * 各テーマには検索クエリを2〜3件設定
 */
const WEEKLY_THEMES = {
  0: { // 日曜
    name: '週間AIツール・自動化トレンド',
    topic: 'AIツール・自動化の週間トレンド',
    queries: ['AI automation tools weekly trends 2026'],
  },
  1: { // 月曜
    name: '自動レポート × 業務自動化',
    topic: 'auto-report-tool ベストプラクティス',
    queries: ['auto report tool best practices 2026'],
  },
  2: { // 火曜
    name: '電力・エネルギー業界最新動向',
    topic: '電力・エネルギー業界の最新動向',
    queries: ['electricity energy industry news Japan 2026'],
  },
  3: { // 水曜
    name: 'データ分析・BIツール活用',
    topic: 'データ分析・BIツールのベストプラクティス',
    queries: ['data analytics BI tools best practices 2026'],
  },
  4: { // 木曜
    name: 'ビジネスDX・業務改善事例',
    topic: 'DX・デジタル業務改善の最新事例',
    queries: ['digital transformation business automation case study 2026'],
  },
  5: { // 金曜
    name: '最新AIモデル・テクノロジー動向',
    topic: '最新AIモデル・テクノロジーの動向',
    queries: ['latest AI model release technology news 2026'],
  },
  6: { // 土曜
    name: '再生可能エネルギー・電力市場',
    topic: '再生可能エネルギーと電力市場の動向',
    queries: ['renewable energy market trends Japan 2026'],
  },
};

/** 今日のテーマを取得（JST基準） */
function getTodayTheme() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const day = now.getDay();
  return WEEKLY_THEMES[day];
}

export const todayTheme = getTodayTheme();

/**
 * Gemini API呼び出しを最大3回リトライするラッパー
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

/**
 * Brave Search APIを呼び出して検索結果を取得する
 */
async function braveSearch(query, lang = 'en') {
  const params = new URLSearchParams({
    q: query,
    count: '3',
    freshness: 'py',
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
  const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const { topic } = getTodayTheme();
  const prompt = `
あなたはレポート自動化の専門家です。以下の記事を「${topic}」という調査テーマへの有用性で1〜10点評価してください。

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

  const response = await withRetry(() => model.generateContent(prompt));
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
  const theme = getTodayTheme();
  console.log(`📅 今日のテーマ: ${theme.name}`);

  const scored = [];
  const seenUrls = new Set();

  for (const query of theme.queries) {
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

      // Gemini無料枠レート制限対策: 7秒待機
      await new Promise(r => setTimeout(r, 7000));

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

