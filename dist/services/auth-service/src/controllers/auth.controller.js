"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            // Check if user already exists
            const existingUser = await user_model_1.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User with this email already exists'
                });
            }
            // Create new user
            const user = await user_model_1.User.create({
                email,
                password,
                twoFactorEnabled: false,
                twoFactorSecret: ''
            });
            // Generate 2FA secret
            const secret = speakeasy_1.default.generateSecret({
                name: `${process.env.TWO_FACTOR_APP_NAME}:${email}`
            });
            // Update user with 2FA secret
            user.twoFactorSecret = secret.base32;
            await user.save();
            // Generate QR code
            const qrCodeUrl = await qrcode_1.default.toDataURL(secret.otpauth_url);
            res.status(201).json({
                status: 'success',
                data: {
                    user: {
                        email: user.email,
                        twoFactorEnabled: user.twoFactorEnabled
                    },
                    qrCodeUrl
                }
            });
        }
        catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message || 'Registration failed'
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password, token } = req.body;
            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email and password are required'
                });
            }
            // Find user and verify credentials
            const user = await user_model_1.User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid email format'
                });
            }
            // Validate password strength
            if (password.length < 8) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Password must be at least 8 characters long'
                });
            }
            // Compare password
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid credentials'
                });
            }
            // Verify 2FA if enabled
            if (user.twoFactorEnabled) {
                if (!token) {
                    return res.status(400).json({
                        status: 'error',
                        message: '2FA token is required'
                    });
                }
                const verified = speakeasy_1.default.totp.verify({
                    secret: user.twoFactorSecret || '',
                    encoding: 'base32',
                    token: token.toString(),
                    window: process.env.TOTP_WINDOW ? parseInt(process.env.TOTP_WINDOW) : 1 // Configurable window
                });
                if (!verified) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Invalid 2FA token'
                    });
                }
            }
            // Validate environment variables
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not configured');
            }
            // Generate JWT token with enhanced security options
            const jwtToken = jsonwebtoken_1.default.sign({
                id: user._id,
                email: user.email
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d',
                algorithm: 'HS256',
                audience: 'food-recipe-api',
                issuer: 'auth-service',
                jwtid: require('crypto').randomBytes(16).toString('hex')
            });
            res.status(200).json({
                status: 'success',
                data: {
                    token: jwtToken,
                    user: {
                        email: user.email,
                        twoFactorEnabled: user.twoFactorEnabled
                    }
                }
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message || 'Login failed'
            });
        }
    }
    async enable2FA(req, res) {
        try {
            const { token } = req.body;
            const userId = req.user.id; // Assuming you have authentication middleware
            const user = await user_model_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }
            // Verify the token before enabling 2FA
            const verified = speakeasy_1.default.totp.verify({
                secret: user.twoFactorSecret || '',
                encoding: 'base32',
                token: token.toString()
            });
            if (!verified) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid verification code'
                });
            }
            user.twoFactorEnabled = true;
            await user.save();
            res.status(200).json({
                status: 'success',
                message: '2FA has been enabled'
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to enable 2FA'
            });
        }
    }
    async logout(req, res) {
        try {
            // Clear the token cookie if you're using cookies
            res.status(200).json({
                status: 'success',
                message: 'Successfully logged out'
            });
        }
        catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message || 'Logout failed'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map