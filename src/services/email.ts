import nodemailer from 'nodemailer';

// Reusable transporter — created once, shared across the app.
// Uses Gmail SMTP by default. Change 'service' or use 'host'/'port' for other providers.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use an App Password, not your account password
  },
});

interface ReminderEmailOptions {
  to: string;
  name: string;
  currentStreak: number;
}

/**
 * Sends a daily reminder email encouraging the user to keep their streak alive.
 */
export async function sendReminderEmail({ to, name, currentStreak }: ReminderEmailOptions) {
  const appUrl = process.env.APP_URL ?? 'http://localhost:3000';

  await transporter.sendMail({
    from: `"Pro Companion" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Don't break your streak — solve one problem today",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Hey ${name} 👋</h2>
        <p>You're on a <strong>${currentStreak}-day streak</strong>. Don't let it reset!</p>
        <p>Solve one problem today to keep it going.</p>
        <a href="${appUrl}" style="
          display: inline-block;
          margin-top: 16px;
          padding: 12px 24px;
          background: #6366f1;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        ">Open Pro Companion</a>
        <p style="margin-top: 24px; color: #888; font-size: 12px;">
          You're receiving this because you set a daily reminder.
          Update your reminder time in settings.
        </p>
      </div>
    `,
  });
}
