# 模範解答パターン

## 成功する図解の構造

```
1. ヘッダー（グラデーション背景）
   └─ タイトル + 「お金・情報・データの流れを構造で理解する」

2. ひとことサマリー
   └─ このビジネスモデルを一言で言うと？（読む前に全体像をつかむ）

3. 登場人物（ステークホルダーマップ）
   └─ 誰が関わっているか・それぞれの役割

4. フロー全体図
   └─ ステークホルダーを並べ、色分けした矢印でフローを表示

5. フロー詳細（3種）
   └─ お金の流れ / 情報の流れ / データの流れ を個別に列挙

6. 「なぜ成立するか」
   └─ このビジネスモデルが機能する核心の理由

7. 一言まとめ
   └─ 30秒で人に説明できる1〜2文
```

---

## ひとことサマリーの書き方

```html
<div class="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-xl mb-8">
  <div class="flex items-center gap-2 mb-2">
    <i data-lucide="zap" class="w-5 h-5 text-indigo-500"></i>
    <span class="font-bold text-indigo-800">ひとことで言うと</span>
  </div>
  <p class="text-gray-700 text-lg">
    「〇〇は、<strong>消費者に△△を低価格で提供</strong>しながら、
    <strong>□□から広告収入を得る</strong>プラットフォームビジネス。」
  </p>
</div>
```

---

## フロー表現の成功パターン

### お金の流れ（収益構造が見えるとき）

```html
<div class="space-y-3">
  <!-- 主な収益源は強調色で -->
  <div class="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-400">
    <div class="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">主</div>
    <div>
      <div class="font-bold text-gray-800">広告主 → 企業：広告費</div>
      <div class="text-sm text-gray-600 mt-1">
        売上の約70%がここ。消費者の行動データを使って「効果が出やすい広告」を提供できるから、広告主は払う価値がある。
      </div>
    </div>
  </div>

  <!-- サブの収益源はライトカラーで -->
  <div class="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
    <div class="w-8 h-8 bg-yellow-200 text-yellow-800 rounded-full flex items-center justify-center font-bold flex-shrink-0">副</div>
    <div>
      <div class="font-bold text-gray-800">消費者 → 企業：月額料金</div>
      <div class="text-sm text-gray-600 mt-1">広告を消したいユーザーが払うプレミアムプラン。全体の30%程度。</div>
    </div>
  </div>
</div>
```

### データの流れ（循環構造のとき）

```html
<div class="bg-green-50 border border-green-200 rounded-xl p-6">
  <p class="text-gray-700 mb-4">
    データはただ集めるだけでなく、<strong>サービス改善に使い、またデータが集まる</strong>という好循環を生む。
  </p>
  <!-- 循環を矢印で表現 -->
  <div class="flex flex-col items-center gap-2">
    <div class="bg-white border-2 border-green-400 rounded-xl px-6 py-3 font-bold text-center">消費者の行動データ</div>
    <i data-lucide="arrow-down" class="w-6 h-6 text-green-500"></i>
    <div class="bg-white border-2 border-green-400 rounded-xl px-6 py-3 font-bold text-center">レコメンド精度が上がる</div>
    <i data-lucide="arrow-down" class="w-6 h-6 text-green-500"></i>
    <div class="bg-white border-2 border-green-400 rounded-xl px-6 py-3 font-bold text-center">もっと使ってもらえる</div>
    <i data-lucide="arrow-down" class="w-6 h-6 text-green-500"></i>
    <div class="bg-green-100 border-2 border-green-500 rounded-xl px-6 py-3 font-bold text-center">さらにデータが集まる（→ 最初に戻る）</div>
  </div>
</div>
```

---

## 「なぜ安い」を説明するパターン

```html
<div class="grid gap-4">
  <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
    <i data-lucide="check-circle" class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"></i>
    <div>
      <div class="font-bold text-gray-800">理由① コストの徹底標準化</div>
      <p class="text-gray-600 text-sm mt-1">〇〇のプロセスを徹底的に機械化・標準化しており、人件費を最小化している。</p>
    </div>
  </div>
  <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
    <i data-lucide="check-circle" class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"></i>
    <div>
      <div class="font-bold text-gray-800">理由② 別の収益源がある</div>
      <p class="text-gray-600 text-sm mt-1">消費者から取らなくても△△から収益を得られるため、消費者向けを安くできる。</p>
    </div>
  </div>
</div>
```

---

## 品質チェックリスト

作成後、以下を確認：

- [ ] ひとことサマリーで「このモデルを一言で言うと」が書かれている
- [ ] 登場人物（ステークホルダー）が全員カードで表示されている
- [ ] お金・情報・データの流れが色分けされている
- [ ] 各フローに「なぜその流れが発生するか」の説明がある
- [ ] 「なぜ成立するか」セクションがある
- [ ] 読み終えて「30秒で人に説明できる一文」がある
- [ ] Lucide icon のみ使用（絵文字禁止）
- [ ] スマホでも読みやすいレスポンシブ対応
- [ ] 矢印の向きが正しい（A→Bの方向が直感的にわかる）
