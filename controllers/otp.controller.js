const otpservice = require('../services/otp.services')

const verifyOtpcontroller = async(req,res)=>{
    try{
        const {email,otp} = req.body;
        if(!email || !otp){
            res.status(400).json({
                msg : "email and otp required"
            })
        }
        await otpservice.verifyOtp(email,otp);

        return res.status(200).json({
            msg : "otp verified"
        })
    }catch(e){
        console.log(e);
    }
}



module.exports={
    verifyOtpcontroller,
}