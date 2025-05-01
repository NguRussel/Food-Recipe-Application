import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

interface RegisterBody {
  email: string;
  password: string;
}

interface LoginBody extends RegisterBody {
  token?: string;
}

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }

      // Create new user
      const user = await User.create({
        email,
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
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response) {
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
      const user = await User.findOne({ email }).select('+password');
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
          email: user.email
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
}