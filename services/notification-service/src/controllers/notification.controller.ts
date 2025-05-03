import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public async sendNotification(req: Request, res: Response): Promise<void> {
    try {
      const notification = await this.notificationService.sendNotification({
        ...req.body,
        userId: req.body.userId || req.user?.sub
      });
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  }

  public async getUserNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications = await this.notificationService.getUserNotifications(userId);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get notifications' });
    }
  }

  public async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const notification = await this.notificationService.markAsRead(req.params.id);
      if (!notification) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }

  public async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const preferences = await this.notificationService.updatePreferences(userId, req.body);
      res.status(200).json(preferences);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  }
}