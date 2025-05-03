import { Router } from 'express';
import { VideoController } from '../controllers/video.controller';
import { authenticate } from '../middleware/auth';
import { validateVideo } from '../middleware/video.validation';

const router = Router();
const videoController = new VideoController();

router.post('/', authenticate, videoController.uploadVideo.bind(videoController));
router.get('/:videoId', videoController.getVideo.bind(videoController));
router.get('/recipe/:recipeId', videoController.getVideosByRecipe.bind(videoController));
router.get('/user/:userId', videoController.getVideosByUser.bind(videoController));
router.put('/:videoId', authenticate, validateVideo, videoController.updateVideo.bind(videoController));
router.delete('/:videoId', authenticate, videoController.deleteVideo.bind(videoController));

export default router;