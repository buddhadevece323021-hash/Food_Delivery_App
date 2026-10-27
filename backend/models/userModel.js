import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    cartData:{type:Object,default:{}},
    verifyOtp: { type: String, default:'' },
    verifyOtpExpireAt: { type: Number, default:0 },
    isaccountVerified: { type: Boolean, default:false },
    resetOtp: { type: String, default:'' },
    resetOtpExpireAt: { type: Number, default:0 },

});
export const userModel = mongoose.models.user||mongoose.model('user',userSchema);

