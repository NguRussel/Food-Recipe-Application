import { Router } from 'express';
import scanController from '../controllers/scan.controller';
import upload from '../middleware/upload';
import { authenticate } from '../middleware/auth';

const router = Router();

// Route for scanning image uploaded as a file
router.post('/image/upload', authenticate, upload.single('image'), scanController.scanImageFile);

// Route for scanning image provided as base64 data
router.post('/image/base64', authenticate, scanController.scanImageBase64);

// Route for getting scan history
router.get('/history', authenticate, scanController.getScanHistory);

export default router;