import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import Notification, { INotification } from '../models/notification.model';
import NotificationPreferences, { INotificationPreferences } from '../models/notification-preferences.model';

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });

    // Initialize Nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendNotification(notification: Partial<INotification>): Promise<INotification> {
    try {
      const preferences = await NotificationPreferences.findOne({ userId: notification.userId });
      if (!preferences) throw new Error('User preferences not found');

      const newNotification = new Notification(notification);
      await newNotification.save();

      // Send push notification if enabled
      if (preferences.pushEnabled && preferences.deviceTokens.length > 0) {
        await this.sendPushNotification(
          preferences.deviceTokens,
          notification.title!,
          notification.message!,
          notification.data
        );
      }

      // Send email if enabled
      if (preferences.emailEnabled) {
        await this.sendEmail(
          preferences.email,
          notification.title!,
          notification.message!
        );
      }

      return newNotification;
    } catch (error) {
      throw new Error(`Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserNotifications(userId: string): Promise<INotification[]> {
    return Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<INotificationPreferences>
  ): Promise<INotificationPreferences> {
    const updated = await NotificationPreferences.findOneAndUpdate(
      { userId },
      preferences,
      { new: true, upsert: true }
    );

    if (!updated) throw new Error('Failed to update preferences');
    return updated;
  }

  private async sendPushNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      await admin.messaging().sendMulticast({
        tokens,
        notification: { title, body },
        data: data || {}
      });
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text
      });
    } catch (error) {
      console.error('Email error:', error);
    }
  }
}