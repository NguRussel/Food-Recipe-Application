import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/enable-2fa', protect, authController.enable2FA);
router.post('/logout', protect, authController.logout);

// Example: Only admin can access
router.post('/admin-action', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Admin action performed.' });
});

// Example: Both user and admin can access
router.post('/user-or-admin-action', protect, authorizeRoles('user', 'admin'), (req, res) => {
  res.json({ message: 'User or admin action performed.' });
});
export default router;