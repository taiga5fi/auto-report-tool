# HTML構造ガイド

## 基本テンプレート

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>【ビジネスモデル名】図解</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; }

    /* フローカラー */
    .flow-money   { background: #fef3c7; border-color: #f59e0b; color: #92400e; }
    .flow-info    { background: #dbeafe; border-color: #3b82f6; color: #1e3a8a; }
    .flow-data    { background: #d1fae5; border-color: #10b981; color: #064e3b; }

    /* ステークホルダーカード */
    .stakeholder-card {
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 1.5rem;
      text-align: center;
    }

    /* フロー矢印ライン */
    .flow-line {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      border: 2px solid;
    }

    /* セクションカード */
    .section-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 2rem;
      margin-bottom: 2rem;
    }
  </style>
</head>
<body class="bg-gray-50">
  <!-- ヘッダー -->
  <header class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl md:text-4xl font-bold">【タイトル】のビジネスモデル</h1>
      <p class="mt-2 text-lg opacity-90">お金・情報・データの流れを構造で理解する</p>
    </div>
  </header>

  <!-- メインコンテンツ -->
  <main class="max-w-4xl mx-auto px-4 py-8">
    <!-- 各セクションをここに追加 -->
  </main>

  <script>lucide.createIcons();</script>
</body>
</html>
```

---

## セクション構成（推奨順）

```
1. ひとことサマリー
   └─ 「このビジネスモデルを一言で言うと？」カード

2. 登場人物（ステークホルダーマップ）
   └─ 人物カードを横並びで配置

3. フロー全体図
   └─ お金・情報・データを色分けした矢印図

4. フロー詳細（種別ごと）
   └─ お金の流れ・情報の流れ・データの流れを個別に解説

5. 「なぜ成立するか」
   └─ このモデルが機能する理由・核心の価値交換

6. 一言まとめ
   └─ 30秒で説明するなら何と言うか
```

---

## ステークホルダーマップ

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
      <i data-lucide="users" class="w-6 h-6 text-indigo-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">登場人物</h2>
      <p class="text-gray-500">このビジネスに関わるプレイヤー</p>
    </div>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <!-- ステークホルダーカード例 -->
    <div class="stakeholder-card bg-indigo-50 border-2 border-indigo-200">
      <i data-lucide="user" class="w-10 h-10 text-indigo-500 mx-auto mb-2"></i>
      <div class="font-bold text-gray-800">消費者</div>
      <div class="text-sm text-gray-500 mt-1">サービスを使う人</div>
    </div>
    <div class="stakeholder-card bg-blue-50 border-2 border-blue-200">
      <i data-lucide="building-2" class="w-10 h-10 text-blue-500 mx-auto mb-2"></i>
      <div class="font-bold text-gray-800">企業</div>
      <div class="text-sm text-gray-500 mt-1">サービスを提供する会社</div>
    </div>
    <div class="stakeholder-card bg-green-50 border-2 border-green-200">
      <i data-lucide="handshake" class="w-10 h-10 text-green-500 mx-auto mb-2"></i>
      <div class="font-bold text-gray-800">パートナー</div>
      <div class="text-sm text-gray-500 mt-1">協力会社・仕入先</div>
    </div>
    <div class="stakeholder-card bg-orange-50 border-2 border-orange-200">
      <i data-lucide="megaphone" class="w-10 h-10 text-orange-500 mx-auto mb-2"></i>
      <div class="font-bold text-gray-800">広告主</div>
      <div class="text-sm text-gray-500 mt-1">広告費を払う企業</div>
    </div>
  </div>
</div>
```

---

## フロー全体図（色分け矢印）

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
      <i data-lucide="arrow-left-right" class="w-6 h-6 text-yellow-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">フロー全体図</h2>
      <p class="text-gray-500">お金・情報・データの流れ</p>
    </div>
  </div>

  <!-- 凡例 -->
  <div class="flex flex-wrap gap-3 mb-6">
    <span class="flow-line flow-money">
      <i data-lucide="banknote" class="w-4 h-4"></i> お金の流れ
    </span>
    <span class="flow-line flow-info">
      <i data-lucide="message-circle" class="w-4 h-4"></i> 情報の流れ
    </span>
    <span class="flow-line flow-data">
      <i data-lucide="database" class="w-4 h-4"></i> データの流れ
    </span>
  </div>

  <!-- フロー図（ステークホルダー + 矢印） -->
  <div class="flex flex-col md:flex-row items-center justify-center gap-4 my-6">
    <!-- ステークホルダーA -->
    <div class="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-4 text-center w-32">
      <i data-lucide="user" class="w-8 h-8 text-indigo-500 mx-auto mb-1"></i>
      <div class="font-bold text-sm">消費者</div>
    </div>

    <!-- 双方向の矢印ブロック -->
    <div class="flex flex-col gap-2">
      <!-- お金: 消費者 → 企業 -->
      <div class="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-400 text-xs font-semibold text-yellow-800">
        <i data-lucide="arrow-right" class="w-3 h-3"></i>
        <i data-lucide="banknote" class="w-3 h-3"></i> 月額料金
      </div>
      <!-- サービス: 企業 → 消費者 -->
      <div class="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-400 text-xs font-semibold text-blue-800">
        <i data-lucide="arrow-left" class="w-3 h-3"></i>
        <i data-lucide="message-circle" class="w-3 h-3"></i> サービス提供
      </div>
    </div>

    <!-- ステークホルダーB -->
    <div class="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center w-32">
      <i data-lucide="building-2" class="w-8 h-8 text-blue-500 mx-auto mb-1"></i>
      <div class="font-bold text-sm">企業</div>
    </div>
  </div>
</div>
```

---

## フロー詳細カード（種別ごと）

```html
<!-- お金の流れ -->
<div class="section-card">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
      <i data-lucide="banknote" class="w-6 h-6 text-yellow-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">お金の流れ</h2>
      <p class="text-gray-500">誰が誰にいくら払うか</p>
    </div>
  </div>

  <div class="space-y-3">
    <div class="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
      <div class="w-8 h-8 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
      <div>
        <div class="font-bold text-gray-800">消費者 → 企業：月額サービス料</div>
        <div class="text-sm text-gray-600 mt-1">毎月〇〇円を支払う。このお金が主な収益源。</div>
      </div>
    </div>
    <!-- 追加の行を繰り返す -->
  </div>
</div>

<!-- 情報の流れ -->
<div class="section-card">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
      <i data-lucide="message-circle" class="w-6 h-6 text-blue-600"></i>
    </div>
    <h2 class="text-2xl font-bold text-gray-800">情報の流れ</h2>
  </div>
  <!-- 同様の構造 -->
</div>

<!-- データの流れ -->
<div class="section-card">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
      <i data-lucide="database" class="w-6 h-6 text-green-600"></i>
    </div>
    <h2 class="text-2xl font-bold text-gray-800">データの流れ</h2>
  </div>
  <!-- 同様の構造 -->
</div>
```

---

## 「なぜ成立するか」ボックス

```html
<div class="section-card">
  <div class="flex items-center gap-3 mb-4">
    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
      <i data-lucide="lightbulb" class="w-6 h-6 text-purple-600"></i>
    </div>
    <div>
      <h2 class="text-2xl font-bold text-gray-800">なぜこのモデルが成立するか</h2>
      <p class="text-gray-500">核心の価値交換</p>
    </div>
  </div>

  <div class="grid gap-4">
    <div class="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
      <div class="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">核</div>
      <div>
        <div class="font-bold text-lg text-gray-800">〇〇が△△を提供するから</div>
        <p class="text-gray-600 mt-1">説明文...</p>
      </div>
    </div>
  </div>
</div>
```

---

## 一言まとめカード

```html
<div class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-8 mb-8 text-center">
  <i data-lucide="quote" class="w-10 h-10 mx-auto mb-4 opacity-60"></i>
  <p class="text-xl font-bold leading-relaxed">
    「〇〇は、△△に□□を提供することで、◇◇から収益を得るビジネスモデル。<br>
    データ・情報の非対称性を活かして低コストを実現している。」
  </p>
  <p class="mt-4 text-sm opacity-75">← 30秒で説明するならこの一文</p>
</div>
```

---

## Lucide Icon よく使うアイコン（ビジネスモデル用）

| 用途 | アイコン名 |
|------|----------|
| お金 | `banknote`, `coins`, `credit-card` |
| データ | `database`, `bar-chart-2`, `activity` |
| 情報 | `message-circle`, `file-text`, `info` |
| 消費者 | `user`, `users` |
| 企業 | `building-2`, `briefcase` |
| パートナー | `handshake` |
| 広告 | `megaphone`, `tv` |
| 矢印 | `arrow-right`, `arrow-left`, `arrow-left-right` |
| 核心 | `lightbulb`, `star`, `zap` |
| まとめ | `quote`, `check-circle` |
