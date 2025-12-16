import { Resend } from "resend";
import OTP from "../models/otpModel.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendotpService(email) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Upsert OTP (replace if it already exists)
  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

 const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color:#f5f6fa; padding:40px 0;">
    <div style="max-width:480px; margin:0 auto; background:white; border-radius:12px; padding:30px; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="text-align:center; margin-bottom:25px;">
        <h2 style="margin:0; font-size:24px; color:#333; font-weight:700;">
          Email Verification
        </h2>
        <p style="font-size:14px; margin-top:6px; color:#666;">
          Use the OTP below to verify your identity
        </p>
      </div>

      <!-- OTP Box -->
      <div style="text-align:center; margin:30px 0;">
        <div style="
          display:inline-block;
          padding:15px 30px;
          background:#eef3ff;
          border-radius:8px;
          border:1px solid #d6e2ff;
        ">
          <span style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#2b4eff;">
            ${otp}
          </span>
        </div>
      </div>

      <!-- Info -->
      <p style="font-size:15px; color:#444; line-height:1.6; text-align:center;">
        This OTP is valid for <strong>1 minutes</strong>.<br />
        Do not share this code with anyone for security reasons.
      </p>

      <!-- Footer -->
      <div style="margin-top:35px; text-align:center; font-size:12px; color:#999;">
        <p style="margin:4px 0;">If you did not request this, please ignore this email.</p>
        <p style="margin:4px 0;">&copy; ${new Date().getFullYear()} Storage App. All rights reserved.</p>
      </div>

    </div>
  </div>
`;


  await resend.emails.send({
    from: "Storage App <otp@kunwarsaurab.com.np>",
    to: email,
    subject:`Your Storage App OTP: ${otp}`,
    html,
  });

  return { success: true, message: `OTP sent successfully on ${email}` };
}
