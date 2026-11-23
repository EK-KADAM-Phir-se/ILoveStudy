const { Resend } = require('resend');

// Initialize Resend with environment variable
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || 'ILoveStudy <no-reply@ilovestudy.in>';

/**
 * Base email layout wrapper with ILoveStudy branding
 */
function createEmailTemplate({ title, subtitle, otp, expiryMinutes = 5, footerNote }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <div style="display: inline-block;">
                <span style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                  <span style="color: #1a2744;">ILove</span><span style="color: #2563EB;">Study</span>
                </span>
                <div style="font-size: 8px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; margin-top: 2px;">
                  LEARN &bull; PRACTICE &bull; SUCCEED
                </div>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #0f172a; text-align: center;">
                ${title}
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #475569; text-align: center;">
                ${subtitle}
              </p>

              <!-- OTP Code Display Box -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border: 1px solid #c7d2fe; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: #4338ca; text-transform: uppercase; margin-bottom: 8px;">
                  Verification Code
                </div>
                <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #1e1b4b; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; margin-left: 10px;">
                  ${otp}
                </div>
                <div style="font-size: 12px; font-weight: 500; color: #6366f1; margin-top: 8px;">
                  Expires in ${expiryMinutes} minutes
                </div>
              </div>

              <p style="margin: 20px 0 0 0; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                ${footerNote || 'If you did not request this verification code, please ignore this email. Your account remains completely secure.'}
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; line-height: 16px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} ILoveStudy. All rights reserved.<br>
                For security reasons, never share this one-time code with anyone.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send an OTP email using Resend
 * @param {Object} params
 * @param {string} params.to - Recipient email address
 * @param {string} params.otp - The 6-digit OTP
 * @param {string} params.purpose - 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET'
 */
async function sendOtpEmail({ to, otp, purpose }) {
  if (!resend) {
    throw new Error('Resend is not initialized. RESEND_API_KEY environment variable is missing.');
  }

  let title = 'Your Verification Code';
  let subtitle = 'Use the code below to complete your action on ILoveStudy.';
  let subject = 'Your Verification Code - ILoveStudy';
  let footerNote = 'If you did not request this code, no action is needed.';

  switch (purpose) {
    case 'REGISTRATION':
      title = 'Verify Your Email to Register';
      subtitle = 'Welcome to ILoveStudy! Use this verification code to complete your registration and activate your student account.';
      subject = `${otp} is your ILoveStudy registration code`;
      footerNote = 'If you did not attempt to register at ILoveStudy, please ignore this email.';
      break;

    case 'LOGIN':
      title = 'Your Login Verification Code';
      subtitle = 'Use this code to log into your ILoveStudy account without a password.';
      subject = `${otp} is your ILoveStudy login code`;
      footerNote = 'If you did not request a login code, please review your account security.';
      break;

    case 'PASSWORD_RESET':
      title = 'Reset Your ILoveStudy Password';
      subtitle = 'We received a request to reset your password. Use the verification code below to set a new password.';
      subject = `${otp} is your password reset code - ILoveStudy`;
      footerNote = 'If you did not ask to reset your password, please ignore this message. Your password will not change.';
      break;

    default:
      break;
  }

  const html = createEmailTemplate({
    title,
    subtitle,
    otp,
    expiryMinutes: 5,
    footerNote,
  });

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error('Failed to send email via Resend:', error.message || error);
    throw new Error(`Email delivery failed: ${error.message || 'Unknown Resend error'}`);
  }

  return data;
}

module.exports = {
  sendOtpEmail,
};
