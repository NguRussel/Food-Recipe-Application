import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';
import { validateNotification, validatePreferences } from '../middleware/validation';

const router = Router();
const notificationController = new NotificationController();

router.post('/send', authenticate, validateNotification, notificationController.sendNotification.bind(notificationController));
router.get('/:userId', authenticate, notificationController.getUserNotifications.bind(notificationController));
router.patch('/:id/read', authenticate, notificationController.markAsRead.bind(notificationController));
router.put('/preferences', authenticate, validatePreferences, notificationController.updatePreferences.bind(notificationController));

export default router;