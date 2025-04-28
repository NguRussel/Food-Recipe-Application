import bcrypt from 'bcryptjs';
import User from '../models/user';


export const register = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.find
            ({ $or: [{ username }, { email }] });
        if (existingUser) {     
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password        
        const hashedPassword = await bcrypt.hash(password, 10);             

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            isMfaActivated: false, // Default value

        });
        console.log('New user:', newUser);
        // Save user to database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
// };
export const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ message: 'Login successful', user });
        });
    })(req, res, next);
}
export const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
}
export const setupMFA = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        // Generate a new secret for MFA
        const secret = speakeasy.generateSecret({ length: 20 });
        user.twoFactorSecret = secret.base32; // Store the secret in the database
        await user.save();
        // Generate a QR code URL for the user to scan with their MFA app
        const otpauth = `otpauth://totp/${user.username}?secret=${secret.base32}&issuer=YourAppName`;
        const qrCodeUrl = await QRCode.toDataURL(otpauth);
        res.status(200).json({ message: 'MFA setup successful', qrCodeUrl });
    }
    catch (error) {
        console.error('Error setting up MFA:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
export const verifyMFA = async (req, res) => {
    const { userId, token } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        // Verify the token using the user's secret
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        }); 
        if (verified) {
            user.isMfaActivated = true; // Set MFA as activated
            await user.save();
            res.status(200).json({ message: 'MFA verification successful' });
        } else {
            res.status(401).json({ message: 'Invalid MFA token' });
        }
    }
    catch (error) {
        console.error('Error verifying MFA:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
export const resendMFA = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate a new secret for MFA
        const secret = speakeasy.generateSecret({ length: 20 });    
        user.twoFactorSecret = secret.base32; // Store the new secret in the database
        await user.save();
        // Generate a QR code URL for the user to scan with their MFA app
        const otpauth = `otpauth://totp/${user.username}?secret=${secret.base32}&issuer=YourAppName`;
        const qrCodeUrl = await QRCode.toDataURL(otpauth);

        res.status(200).json({ message: 'MFA code resent', qrCodeUrl });
    }       
    catch (error) {
        console.error('Error resending MFA:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
export const resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate a password reset token (you can use JWT or any other method)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Send the token to the user's email (you can use nodemailer or any other service)
        // For demonstration, we'll just log it to the console  
        console.log(`Password reset token for ${email}: ${token}`);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }       
}
export const authStatus = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
}
export const exampleRoute = (req, res) => {
    res.send('Auth route is working!');
}
// import User from '../models/user.js';
// import bcrypt from 'bcrypt';
// import passport from 'passport'; 
// import speakeasy from 'speakeasy';
// import QRCode from 'qrcode';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv'; 
// dotenv.config();

