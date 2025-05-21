"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_controller_1 = require("../controllers/video.controller");
const auth_1 = require("../middleware/auth");
const video_validation_1 = require("../middleware/video.validation");
const router = (0, express_1.Router)();
const videoController = new video_controller_1.VideoController();
router.post('/', auth_1.authenticate, videoController.uploadVideo.bind(videoController));
router.get('/:videoId', videoController.getVideo.bind(videoController));
router.get('/recipe/:recipeId', videoController.getVideosByRecipe.bind(videoController));
router.get('/user/:userId', videoController.getVideosByUser.bind(videoController));
router.put('/:videoId', auth_1.authenticate, video_validation_1.validateVideo, videoController.updateVideo.bind(videoController));
router.delete('/:videoId', auth_1.authenticate, videoController.deleteVideo.bind(videoController));
exports.default = router;
//# sourceMappingURL=video.routes.js.map