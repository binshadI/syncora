

const generateOtp =()=>{
    let digits = '1234567890';
    let OTP = ' ';
    let len = digits.length
    for(let i =0; i<=6; i++){
        OTP +=digits[Math.floor(Math.random()*len)];
    }
    return OTP;
}


const requestOtp = async (email) =>{
    try{

    }catch(e){

    }
}

const verifyOtp = async(email,userOtp)=>{
    try{

    }catch(e){
        console.log(e);
    }
}


module.exports = {
    generateOtp,
    requestOtp,
    verifyOtp
}
