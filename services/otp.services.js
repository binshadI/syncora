const otpStore = require("../store/otpStore");
const User = require("../models/userModel");


const saveOtp = (email, otp) => {
    otpStore.set(email, otp.toString());

    setTimeout(() => {
        otpStore.delete(email);
    }, 10 * 60 * 1000);
}

const verifyOtp = async(email, enteredOtp) => {
    const storedOtp = otpStore.get(email);

    console.log("📩 VERIFY REQUEST");
    // console.log("Email:", email);
    // console.log("Stored OTP:", storedOtp);
    // console.log("Entered OTP:", enteredOtp);

    if (!storedOtp || storedOtp !== enteredOtp) {
        throw new Error("Invalid or expired OTP");
    }

    await User.updateOne(
        { email },
        {$set : {verified : true}}
    )

    otpStore.delete(email);
    return true;
};

module.exports = { verifyOtp, saveOtp };
