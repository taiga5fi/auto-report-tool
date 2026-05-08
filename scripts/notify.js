/**
 * notify.js
 * nodemailerでGmail SMTPを使いレポート完成を通知するメールを送る。
 */
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const NOTIFY_TO = process.env.NOTIFY_TO;

/**
 * レポート完成メールを送信する
 * @param {string} url - 公開されたsurge.shのURL
 * @param {string} dateJa - 日付文字列（例: 2026年5月9日（土））
 * @param {Array} articles - top記事リスト
 */
export async function sendNotification(url, dateJa, articles) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const topArticles = articles.slice(0, 3);
  const articleListText = topArticles
    .map((a, i) => `${i + 1}. [${a.score}/10] ${a.title}\n   ${a.url}`)
    .join('\n');
  const articleListHtml = topArticles
    .map(
      (a, i) =>
        `<li style="margin-bottom:8px;">
          <strong>[${a.score}/10]</strong>
          <a href="${a.url}" style="color:#2563eb;">${a.title}</a>
          <br><span style="color:#64748b;font-size:13px;">${a.reason}</span>
        </li>`
    )
    .join('');

  const subject = `[自動レポート] ${dateJa}のベストプラクティス調査`;

  const textBody = `
${dateJa}の自動レポートが完成しました。

📄 レポートURL: ${url}

━━ TOP記事 ━━
${articleListText}

このメールはGitHub Actionsにより自動送信されています。
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Hiragino Kaku Gothic ProN',Meiryo,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#0f172a;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">
    <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">毎朝配信</p>
    <h1 style="margin:0;font-size:20px;">自動レポートツール ベストプラクティス調査</h1>
    <p style="margin:6px 0 0;font-size:13px;color:#94a3b8;">${dateJa}</p>
  </div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    <p>本日のレポートが完成しました。</p>
    <a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;margin-bottom:24px;">
      📄 レポートを開く
    </a>
    <h2 style="font-size:14px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #e2e8f0;padding-bottom:8px;">TOP記事</h2>
    <ul style="padding-left:0;list-style:none;margin:0;">
      ${articleListHtml}
    </ul>
    <p style="margin-top:24px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px;">
      このメールはGitHub Actionsにより自動送信されています。
    </p>
  </div>
</body>
</html>
`.trim();

  await transporter.sendMail({
    from: `"Auto Report Tool" <${GMAIL_USER}>`,
    to: NOTIFY_TO,
    subject,
    text: textBody,
    html: htmlBody,
  });

  console.log(`✅ メール送信完了 → ${NOTIFY_TO}`);
}
