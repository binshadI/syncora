const nodmailer = require("nodemailer");
require('dotenv').config();


const transporter = nodmailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure : false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})

transporter.verify((err,success)=>{
    if(err){
        console.log(err);
    }else{
        console.log("SMTP ready")
    }
})

const sendOtp = async(email,otp)=>{
    const mailoption = {
        from : process.env.SMTP_SENDER,
        to : email,
        subject : 'OTP',
        text : `your otp is  it valid only for 10 minutes`,
        html : `<h2>${otp}</h2>`
    };
    await transporter.sendMail(mailoption);

    
};


module.exports = {
    sendOtp
}