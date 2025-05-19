import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../email.service';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

interface RegisterBody {
  email: string;
  username: string;
  password: string;
}

interface LoginBody {
  login: string; // Can be email or username
  password: string;
  token?: string;
}

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      // Check if required fields are provided
      if (!email || !username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email, username and password are required'
        });
      }

      // Check if user already exists with this email
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }

      // Check if user already exists with this username
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this username already exists'
        });
      }

      // Create new user
      const user = await User.create({
        email,
        username,
        password,
        twoFactorEnabled: false,
        twoFactorSecret: ''
      });
      
      // Generate 2FA secret
      const secret = speakeasy.generateSecret({
        name: `${process.env.TWO_FACTOR_APP_NAME}:${email}`
      });
      
      // Update user with 2FA secret
      user.twoFactorSecret = secret.base32;
      await user.save();

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      // Inside your registration method, after creating the user:
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      user.emailVerificationOTP = otp;
      user.emailVerificationExpires = otpExpires;
      await user.save();
      
      await sendEmail(user.email, 'Your OTP Code', `Your OTP is: ${otp}`);
      const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '10m' });
      // Send this token to the frontend in the response
      return res.status(201).json({
        message: 'Registration successful. Please verify your email with the OTP sent.',
        token // <-- frontend should store this and use it for OTP verification
      });
      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Please verify your email with the OTP sent.',
        data: {
          user: {
            email: user.email,
            username: user.username,
            isEmailVerified: user.isEmailVerified
          }
        }
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { login, password, token } = req.body;

      // Validate required fields
      if (!login || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Login (email or username) and password are required'
        });
      }

      // Find user by email or username
      const isEmail = login.includes('@');
      const query = isEmail ? { email: login } : { username: login };
      
      // Find user and verify credentials
      const user = await User.findOne(query).select('+password');
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
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

        const verified = speakeasy.totp.verify({
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
      const jwtToken = jwt.sign(
        { 
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET as jwt.Secret,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
          algorithm: 'HS256' as const,
          audience: 'food-recipe-api',
          issuer: 'auth-service',
          jwtid: require('crypto').randomBytes(16).toString('hex')
        } as jwt.SignOptions
      );

      res.status(200).json({
        status: 'success',
        data: {
          token: jwtToken,
          user: {
            email: user.email,
            username: user.username,
            twoFactorEnabled: user.twoFactorEnabled
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Login failed'
      });
    }
  }

  async enable2FA(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const userId = (req as any).user.id; // Assuming you have authentication middleware

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      // Verify the token before enabling 2FA
      const verified = speakeasy.totp.verify({
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
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to enable 2FA'
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // Clear the token cookie if you're using cookies
      res.status(200).json({
        status: 'success',
        message: 'Successfully logged out'
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Logout failed'
      });
    }
  }
}

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    // Get JWT from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    let email;
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      email = decoded.email;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (
      user.emailVerificationOTP !== otp ||
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
};
