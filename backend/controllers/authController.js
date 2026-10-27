import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import { transporter } from "../config/nodemailer.js";



//--- Registretion API --- //

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing details' });
    }

    try {
        // cheking is user already exists..

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });

        }

        // validating email format & strong password..
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // Chack strong password...
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password with 8 digit" })
        }

        // hasing user password...
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // creat new user..
        const user = new userModel({ name, email, password: hashedPassword });

        // save user in the DB..   
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        //--- sending welcome email --- //

        const mailoption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to our Website  ',
            text: `Welcome to Tomato! . Your account has been created with email id: ${email}`
        }
        transporter.sendMail(mailoption)

        return res.json({ success: true, message: "Register successfully", info: "A welcome email has been sent to your email.." });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//--- Login API --- //

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.json({ success: false, message: 'Email and password are required' });
    }
    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: ' User Not Found! Please Register First' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Wrong password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "Logged in successfully" });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}

//--- Logout API --- //

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logged Out successfully' })

    } catch (error) {
        return res.json({ success: true, message: error.message });
    }
}

//--- send verification OTP to the user's email ---//

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await userModel.findById(userId);

        if (user.isaccountVerified) {
            res.json({ success: false, message: "Account already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailoption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Accout veryfication OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        }
        await transporter.sendMail(mailoption);

        return res.json({
            success: true,
            message: "Verification OTP sent on Email"
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });

    }
}

//--- Verifiy the email using OTP ---//

export const verifyemail = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user?.userId;


    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }
        if (user.verifyOtp === "" || user.verifyOtp !== otp.toString()) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" })
        }
        user.isaccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: "Email verifyed Successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//--- Check if user is authenticated ---//

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//--- send Passward reset OTP --- //

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "email is required" })
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User Not Found!' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailoption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}. Reset your password using this OTP.`
        }
        await transporter.sendMail(mailoption);

        return res.json({
            success: true,
            message: " OTP sent on Email"
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//--- Reset user password --- //

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!newPassword) {
        return res.json({ success: false, message: "New Password are required" });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User Not Found!!" });
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP!!" });
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired!" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: "Password has been reset successfully" });


    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}