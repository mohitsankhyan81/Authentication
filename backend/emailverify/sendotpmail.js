import nodemailer from "nodemailer"
export const sendotpMail=async(email,otp)=>{
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    })

    const optconfigration={
        from:process.env.MAIL_USER,
        to:email,
        subject:"Password reset otp",
        html:`Otp for password reset is ${otp}`
    }
   await transporter.sendMail(optconfigration)
}