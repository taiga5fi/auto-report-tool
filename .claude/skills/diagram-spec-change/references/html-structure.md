# HTML構造ガイド

## 目次

- 基本テンプレート
- セクション構成
- 変更前後比較カード
- 仕様参照ボックス
- 影響分析テーブル
- 判断サポートセクション
- Lucide Icon 使い方

---

## 基本テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>【変更名】仕様変更図解</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; }

    /* ヘッダー */
    .header-gradient {
      background: linear-gradient(135deg, #1e3a5f 0%, #1d6fa5 100%);
    }

    /* セクションカード */
    .section-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }

    /* 変更前カード */
    .before-card {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border: 2px solid #ef4444;
      border-radius: 0.75rem;
      padding: 1.5rem;
    }

    /* 変更後カード */
    .after-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 2px solid #22c55e;
      border-radius: 0.75rem;
      padding: 1.5rem;
    }

    /* 仕様参照ボックス */
    .spec-box {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-left: 4px solid #3b82f6;
      padding: 1.25rem 1.5rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    /* 業務用語解説 */
    .term-explain {
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      border-left: 4px solid #8b5cf6;
      padding: 1.25rem 1.5rem;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    /* 影響レベルバッジ */
    .badge-high {
      background: #dc2626; color: white;
      padding: 0.2rem 0.75rem; border-radius: 9999px;
      font-size: 0.8rem; font-weight: 600;
    }
    .badge-medium {
      background: #d97706; color: white;
      padding: 0.2rem 0.75rem; border-radius: 9999px;
      font-size: 0.8rem; font-weight: 600;
    }
    .badge-low {
      background: #059669; color: white;
      padding: 0.2rem 0.75rem; border-radius: 9999px;
      font-size: 0.8rem; font-weight: 600;
    }

    /* 判断サポート */
    .decision-ok {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 2px solid #10b981;
      border-radius: 1rem;
      padding: 1.5rem;
    }
    .decision-ng {
      background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
      border: 2px solid #f97316;
      border-radius: 1rem;
      padding: 1.5rem;
    }
    .decision-caution {
      background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
      border: 2px solid #eab308;
      border-radius: 1rem;
      padding: 1.5rem;
    }
  </style>
</head>
<body class="bg-slate-50">

  <!-- ヘッダー -->
  <header class="header-gradient text-white py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex items-center gap-3 mb-2">
        <span class="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
          仕様変更図解
        </span>
        <span class="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
          要確認
        </span>
        <!-- または <span class="bg-green-500 ...">変更OK</span> -->
      </div>
      <h1 class="text-3xl md:text-4xl font-bold">【変更対象の機能名】</h1>
      <p class="mt-2 text-lg opacity-90">【変更内容の一行説明】</p>
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
1. この処理は何か（業務背景・目的）
2. 仕様参照（どの仕様項目に該当するか）
3. 変更前後の比較
4. 影響分析
5. 判断サポート（変更してOKか・注意点）
```

---

## 1. 「この処理は何か」セクション

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
      <i data-lucide="book-open" class="w-6 h-6 text-blue-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">この処理は何か</h2>
      <p class="text-gray-500">業務的な目的と処理概要</p>
    </div>
  </div>

  <!-- 業務用語の解説ボックス（必要に応じて） -->
  <div class="term-explain">
    <div class="flex items-start gap-3">
      <i data-lucide="lightbulb" class="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5"></i>
      <div>
        <div class="font-bold text-purple-700">「〇〇（業務用語）」とは？</div>
        <p class="text-gray-700 mt-1">
          エンジニアに例えると〜。この処理では「△△」として扱います。
        </p>
      </div>
    </div>
  </div>

  <!-- 処理の目的 -->
  <div class="mt-4 space-y-3 text-gray-700">
    <p>この処理は<strong>〇〇という業務ルール</strong>を実現するためのものです。</p>
    <p>具体的には、〜という条件のときに、〜を行います。</p>
  </div>
</div>
```

---

## 2. 仕様参照ボックス

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
      <i data-lucide="file-text" class="w-6 h-6 text-indigo-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">仕様書の該当箇所</h2>
      <p class="text-gray-500">どの仕様に基づく実装か</p>
    </div>
  </div>

  <div class="spec-box">
    <div class="text-sm font-medium text-blue-600 mb-1">
      仕様書 第〇章 〇〇節
    </div>
    <p class="text-gray-800 font-medium">「（仕様の文章を引用）」</p>
  </div>

  <!-- 仕様とコードの対応 -->
  <div class="mt-4">
    <h3 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
      <i data-lucide="arrow-right" class="w-4 h-4 text-blue-500"></i>
      この仕様をコードでどう実現しているか
    </h3>
    <p class="text-gray-600">〇〇クラスの△△メソッドが〜を行うことで、この仕様を実現しています。</p>
  </div>
</div>
```

---

## 3. 変更前後の比較カード

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
      <i data-lucide="git-compare" class="w-6 h-6 text-slate-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">変更前後の比較</h2>
      <p class="text-gray-500">何がどう変わるか</p>
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-4">
    <!-- 変更前 -->
    <div class="before-card">
      <div class="flex items-center gap-2 mb-3">
        <i data-lucide="x-circle" class="w-5 h-5 text-red-600"></i>
        <span class="font-bold text-red-700">変更前（現状）</span>
      </div>
      <ul class="space-y-2 text-gray-700">
        <li class="flex items-start gap-2">
          <i data-lucide="chevron-right" class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"></i>
          <span>〇〇のとき、△△を行う</span>
        </li>
        <li class="flex items-start gap-2">
          <i data-lucide="chevron-right" class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"></i>
          <span>〜</span>
        </li>
      </ul>
    </div>

    <!-- 変更後 -->
    <div class="after-card">
      <div class="flex items-center gap-2 mb-3">
        <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
        <span class="font-bold text-green-700">変更後（提案）</span>
      </div>
      <ul class="space-y-2 text-gray-700">
        <li class="flex items-start gap-2">
          <i data-lucide="chevron-right" class="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5"></i>
          <span>〇〇の処理を削除（または修正）</span>
        </li>
        <li class="flex items-start gap-2">
          <i data-lucide="chevron-right" class="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5"></i>
          <span>〜</span>
        </li>
      </ul>
    </div>
  </div>

  <!-- 変化のポイント（重要な差分を強調） -->
  <div class="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
    <div class="flex items-center gap-2 mb-2">
      <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-600"></i>
      <span class="font-bold text-yellow-800">変化のポイント</span>
    </div>
    <p class="text-gray-700">〇〇という条件のときに、△△が行われなくなります。</p>
  </div>
</div>
```

---

## 4. 影響分析テーブル

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
      <i data-lucide="radar" class="w-6 h-6 text-orange-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">影響分析</h2>
      <p class="text-gray-500">変更した場合に何が起きるか</p>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-slate-100">
          <th class="text-left p-3 rounded-tl-lg font-bold text-gray-700">影響先</th>
          <th class="text-left p-3 font-bold text-gray-700">影響内容</th>
          <th class="text-left p-3 font-bold text-gray-700">発生条件</th>
          <th class="text-left p-3 rounded-tr-lg font-bold text-gray-700">レベル</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr class="hover:bg-gray-50">
          <td class="p-3 font-medium text-gray-800">〇〇処理</td>
          <td class="p-3 text-gray-600">△△が行われなくなる</td>
          <td class="p-3 text-gray-500">〜のとき</td>
          <td class="p-3"><span class="badge-high">高</span></td>
        </tr>
        <tr class="hover:bg-gray-50">
          <td class="p-3 font-medium text-gray-800">〇〇機能</td>
          <td class="p-3 text-gray-600">〜</td>
          <td class="p-3 text-gray-500">常時</td>
          <td class="p-3"><span class="badge-low">低（影響なし）</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

## 5. 判断サポートセクション

### 変更OKの場合

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
      <i data-lucide="check-square" class="w-6 h-6 text-green-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">判断サポート</h2>
      <p class="text-gray-500">この変更をしていいか？</p>
    </div>
  </div>

  <div class="decision-ok mb-4">
    <div class="flex items-center gap-2 mb-3">
      <i data-lucide="check-circle-2" class="w-6 h-6 text-emerald-600"></i>
      <span class="font-bold text-emerald-800 text-lg">削除・変更可能と判断できる根拠</span>
    </div>
    <ul class="space-y-2 text-gray-700">
      <li class="flex items-start gap-2">
        <i data-lucide="check" class="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"></i>
        <span>〇〇という理由で、業務ルール上は問題ない</span>
      </li>
    </ul>
  </div>

  <div class="decision-caution">
    <div class="flex items-center gap-2 mb-3">
      <i data-lucide="alert-circle" class="w-5 h-5 text-yellow-600"></i>
      <span class="font-bold text-yellow-800">ただし確認が必要な点</span>
    </div>
    <ul class="space-y-2 text-gray-700">
      <li class="flex items-start gap-2">
        <i data-lucide="help-circle" class="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5"></i>
        <span>〇〇のケースについて仕様担当者に確認が必要</span>
      </li>
    </ul>
  </div>
</div>
```

### 変更NGの場合

```html
<div class="decision-ng mb-4">
  <div class="flex items-center gap-2 mb-3">
    <i data-lucide="x-circle" class="w-6 h-6 text-orange-600"></i>
    <span class="font-bold text-orange-800 text-lg">削除・変更が難しい理由</span>
  </div>
  <ul class="space-y-2 text-gray-700">
    <li class="flex items-start gap-2">
      <i data-lucide="alert-triangle" class="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"></i>
      <span>〇〇という業務ルールがあるため、この処理を削除すると△△が発生する</span>
    </li>
  </ul>
</div>
```

---

## Lucide Icon 使い方

```html
<i data-lucide="icon-name" class="w-6 h-6"></i>
```

| 用途 | アイコン名 |
|------|-----------|
| 処理・機能 | `cpu`, `code-2`, `function-square` |
| 変更前 | `x-circle`, `circle-slash` |
| 変更後 | `check-circle`, `check-circle-2` |
| 仕様書 | `file-text`, `book-open` |
| 警告・注意 | `alert-triangle`, `alert-circle` |
| 影響分析 | `radar`, `scan-eye` |
| 確認 | `help-circle`, `question-mark` |
| 変更比較 | `git-compare`, `git-diff` |
| 業務用語 | `lightbulb`, `info` |
| OKの根拠 | `check-square`, `shield-check` |
| NGの根拠 | `shield-x`, `ban` |
| 矢印 | `arrow-right`, `chevron-right` |
