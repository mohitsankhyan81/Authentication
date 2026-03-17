import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();
export const verifyEmail = async (token, email) => {
   //use user and password is not accepted when using nodemailer stackoverflow
   const transporter = nodemailer.createTransport({
      service: email,
      auth: {
         user: process.env.MAIL_USER,
         pass: process.env.MAIL_PASS
      }
   })
   const mailConfigration = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
         <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
  
    <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px; text-align:center;">
      
      <h2 style="color:#333;">Email Verification</h2>
      
      <p style="color:#555;">
        Thank you for registering. Please verify your email address to activate your account.
      </p>
      
      <a href="http://localhost:5173/verify/${token}" 
         style="display:inline-block; margin-top:20px; padding:12px 25px; 
         background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
         Verify Email
      </a>

      <p style="margin-top:20px; color:#888; font-size:14px;">
        If you did not create an account, please ignore this email.
      </p>

    </div>

  </div>
  `
   };

transporter.sendMail(mailConfigration)

}