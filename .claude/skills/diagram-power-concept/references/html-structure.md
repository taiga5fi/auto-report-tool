# HTML構造ガイド

## 目次

- 基本テンプレート
- セクション構成
- アナロジーボックス
- 仕組み説明カード（因果フロー）
- 数式の解読ボックス
- よくある誤解セクション
- 人への説明まとめ
- Lucide Icon 使い方

---

## 基本テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>【概念名】とは - 電力系統概念図解</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; }

    /* ヘッダー（電力系統カラー） */
    .header-gradient {
      background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
    }

    /* セクションカード */
    .section-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }

    /* アナロジーボックス（暖色系・親しみやすい） */
    .analogy-box {
      background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      border-left: 4px solid #f97316;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin: 1rem 0;
    }

    /* 仕組み説明（青系・論理的） */
    .mechanism-box {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-left: 4px solid #3b82f6;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin: 1rem 0;
    }

    /* 数式解読ボックス（ダーク・技術的） */
    .formula-explain {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin: 1rem 0;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.8;
    }
    .formula-explain .formula-line { color: #fde047; font-size: 1.1rem; margin: 0.5rem 0; }
    .formula-explain .var-explain  { color: #94a3b8; font-size: 0.8rem; }
    .formula-explain .meaning      { color: #4ade80; }

    /* よくある誤解（赤→緑の訂正スタイル） */
    .misconception-wrong {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-left: 4px solid #ef4444;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      margin: 0.5rem 0;
    }
    .misconception-correct {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-left: 4px solid #22c55e;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      margin: 0.5rem 0;
    }

    /* 人への説明まとめ（強調スタイル） */
    .summary-box {
      background: linear-gradient(135deg, #1e3a5f 0%, #1d6fa5 100%);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 1rem;
      margin: 1rem 0;
    }

    /* 概念関係図 */
    .concept-node {
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 0.75rem;
      padding: 0.75rem 1.25rem;
      text-align: center;
      font-weight: 600;
    }
    .concept-node.cause  { border-color: #f97316; background: #fff7ed; }
    .concept-node.effect { border-color: #22c55e; background: #f0fdf4; }
    .concept-node.center { border-color: #8b5cf6; background: #f5f3ff; border-width: 3px; }
  </style>
</head>
<body class="bg-slate-50">

  <!-- ヘッダー -->
  <header class="header-gradient text-white py-10">
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <span class="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">電力系統概念図解</span>
        <span class="bg-blue-500/70 text-white text-sm font-medium px-3 py-1 rounded-full">自己学習用</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold">【概念名】とは</h1>
      <p class="mt-2 text-lg opacity-90">【一行で概念の本質を書く】</p>
      <p class="mt-1 text-sm opacity-70">直感 → 仕組み → 理論 → よくある誤解 の順で理解を積み上げる</p>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    <!-- セクションをここに配置 -->
  </main>

  <script>lucide.createIcons();</script>
</body>
</html>
```

---

## セクション構成

推奨する順序:

```
1. まず直感でつかむ（アナロジー）
2. 仕組みを理解する（因果フロー）
3. 理論・数式を読む（ある場合）
4. よくある誤解
5. 人への説明まとめ（30秒バージョン）
```

---

## 1. アナロジーセクション

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
      <i data-lucide="lightbulb" class="w-6 h-6 text-orange-500"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">まず直感でつかむ</h2>
      <p class="text-gray-500">知っているものに例えて理解する</p>
    </div>
  </div>

  <!-- アナロジー1 -->
  <div class="analogy-box">
    <div class="flex items-center gap-2 mb-3">
      <i data-lucide="home" class="w-5 h-5 text-orange-600"></i>
      <span class="font-bold text-orange-800">例え話：〇〇（日常生活の例）</span>
    </div>
    <p class="text-gray-700 mb-3">〜〜〜のようなものです。</p>
    <ul class="space-y-2 text-gray-600 text-sm">
      <li class="flex items-start gap-2">
        <i data-lucide="arrow-right" class="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5"></i>
        <span><strong>〇〇</strong> ↔ 【概念の構成要素A】</span>
      </li>
      <li class="flex items-start gap-2">
        <i data-lucide="arrow-right" class="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5"></i>
        <span><strong>△△</strong> ↔ 【概念の構成要素B】</span>
      </li>
    </ul>
  </div>

  <!-- アナロジー2（ITの例） -->
  <div class="analogy-box" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-color: #0ea5e9;">
    <div class="flex items-center gap-2 mb-3">
      <i data-lucide="server" class="w-5 h-5 text-sky-600"></i>
      <span class="font-bold text-sky-800">ITで例えると：〇〇</span>
    </div>
    <p class="text-gray-700">〜〜〜に相当します。</p>
  </div>
</div>
```

---

## 2. 仕組み説明（因果フロー）

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
      <i data-lucide="git-branch" class="w-6 h-6 text-blue-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">仕組みを理解する</h2>
      <p class="text-gray-500">何が何をしているか（因果関係）</p>
    </div>
  </div>

  <!-- 概念の関係図 -->
  <div class="flex flex-col md:flex-row items-center justify-center gap-3 my-6">
    <div class="concept-node cause">【原因・入力】</div>
    <i data-lucide="arrow-right" class="w-6 h-6 text-gray-400 hidden md:block"></i>
    <i data-lucide="arrow-down" class="w-6 h-6 text-gray-400 md:hidden"></i>
    <div class="concept-node center">【この概念】</div>
    <i data-lucide="arrow-right" class="w-6 h-6 text-gray-400 hidden md:block"></i>
    <i data-lucide="arrow-down" class="w-6 h-6 text-gray-400 md:hidden"></i>
    <div class="concept-node effect">【結果・効果】</div>
  </div>

  <!-- ステップ解説 -->
  <div class="space-y-4">
    <div class="mechanism-box">
      <div class="font-bold text-blue-800 mb-2 flex items-center gap-2">
        <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
        ステップ1の見出し
      </div>
      <p class="text-gray-700">説明文</p>
    </div>
    <div class="mechanism-box">
      <div class="font-bold text-blue-800 mb-2 flex items-center gap-2">
        <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
        ステップ2の見出し
      </div>
      <p class="text-gray-700">説明文</p>
    </div>
  </div>
</div>
```

---

## 3. 数式の解読ボックス

コードで例えると「コメント付きのコード解説」のように、数式の各記号を言葉で説明する。

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
      <i data-lucide="function-square" class="w-6 h-6 text-purple-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">数式を読む</h2>
      <p class="text-gray-500">記号の意味から順に読み解く</p>
    </div>
  </div>

  <p class="text-gray-600 mb-4">数式はコードのコメントと同じ。記号の「意味」さえわかれば読める。</p>

  <div class="formula-explain">
    <div class="var-explain">// まず各記号の意味を確認する</div>
    <div class="var-explain">// 〇〇（記号名） = 【意味】</div>
    <div class="var-explain">// △△（記号名） = 【意味】</div>
    <br>
    <div class="var-explain">// 数式全体</div>
    <div class="formula-line">数式をここに書く</div>
    <br>
    <div class="var-explain">// これを日本語で言うと</div>
    <div class="meaning">「〇〇が△△に等しいとき、□□は〜〜になる」</div>
  </div>
</div>
```

---

## 4. よくある誤解セクション

このセクションが最も重要。「なぜその誤解が生まれるか」まで書く。

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
      <i data-lucide="alert-triangle" class="w-6 h-6 text-red-500"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">よくある誤解</h2>
      <p class="text-gray-500">間違えやすいポイントと正しい理解</p>
    </div>
  </div>

  <!-- 誤解パターン（複数可） -->
  <div class="mb-6">
    <div class="text-sm font-medium text-gray-500 mb-2">誤解が生まれる理由: 〇〇という言葉が「〜〜」に聞こえるから</div>

    <div class="misconception-wrong">
      <div class="flex items-center gap-2 mb-1">
        <i data-lucide="x" class="w-4 h-4 text-red-600"></i>
        <span class="font-bold text-red-700">よくある誤解</span>
      </div>
      <p class="text-gray-700">「〇〇は△△を行う」と思いがち</p>
    </div>

    <div class="flex justify-center my-2">
      <i data-lucide="arrow-down" class="w-5 h-5 text-gray-400"></i>
    </div>

    <div class="misconception-correct">
      <div class="flex items-center gap-2 mb-1">
        <i data-lucide="check" class="w-4 h-4 text-green-600"></i>
        <span class="font-bold text-green-700">正しい理解</span>
      </div>
      <p class="text-gray-700">実際には「〇〇は△△を行わない。〇〇の役割は〜〜」</p>
      <p class="text-gray-500 text-sm mt-2">理由: 〜〜だから</p>
    </div>
  </div>
</div>
```

---

## 5. 人への説明まとめ

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
      <i data-lucide="message-square" class="w-6 h-6 text-indigo-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">人への説明まとめ</h2>
      <p class="text-gray-500">30秒で説明するなら</p>
    </div>
  </div>

  <div class="summary-box">
    <div class="text-sm opacity-75 mb-2">30秒バージョン（そのまま使える）</div>
    <p class="text-lg font-medium leading-relaxed">
      「〇〇とは、△△のことです。<br>
      具体的には〜〜という仕組みで、〜〜の役割を担っています。<br>
      よく『〜〜』と混同されますが、実際は〜〜です。」
    </p>
  </div>

  <!-- 理解度チェック -->
  <div class="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
    <div class="font-bold text-slate-700 mb-3 flex items-center gap-2">
      <i data-lucide="help-circle" class="w-4 h-4 text-slate-500"></i>
      理解度チェック（自問自答）
    </div>
    <ul class="space-y-2 text-sm text-gray-600">
      <li class="flex items-start gap-2">
        <i data-lucide="square" class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"></i>
        <span>〇〇の役割を1文で言えるか？</span>
      </li>
      <li class="flex items-start gap-2">
        <i data-lucide="square" class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"></i>
        <span>よくある誤解とその理由を説明できるか？</span>
      </li>
      <li class="flex items-start gap-2">
        <i data-lucide="square" class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"></i>
        <span>アナロジー（例え話）を使って説明できるか？</span>
      </li>
    </ul>
  </div>
</div>
```

---

## Lucide Icon 使い方

```html
<i data-lucide="icon-name" class="w-6 h-6"></i>
```

| 用途 | アイコン名 |
|------|-----------|
| 直感・アナロジー | `lightbulb`, `zap` |
| 仕組み・フロー | `git-branch`, `arrow-right`, `arrow-down` |
| 数式 | `function-square`, `sigma` |
| 誤解・警告 | `alert-triangle`, `x-circle` |
| 正しい理解 | `check-circle`, `check` |
| 説明まとめ | `message-square`, `presentation` |
| 理解度チェック | `help-circle`, `square` |
| 日常例 | `home`, `building-2` |
| IT例 | `server`, `code-2`, `network` |
| 電力系統 | `zap`, `activity`, `gauge` |
