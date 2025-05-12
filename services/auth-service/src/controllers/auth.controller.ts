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

      res.status(201).json({
        status: 'success',
        data: {
          user: { 
            email: user.email,
            username: user.username,
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
          username: user.username
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