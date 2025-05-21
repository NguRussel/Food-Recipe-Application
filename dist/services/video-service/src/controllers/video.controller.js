"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const video_service_1 = require("../services/video.service");
class VideoController {
    constructor() {
        this.videoService = new video_service_1.VideoService();
    }
    async uploadVideo(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No video file provided' });
                return;
            }
            const file = req.file;
            const videoData = {
                title: req.body.title,
                description: req.body.description,
                recipeId: req.body.recipeId,
                userId: req.user?.sub,
                url: file.location,
                thumbnailUrl: req.body.thumbnailUrl,
                duration: parseInt(req.body.duration),
                quality: req.body.quality,
                size: file.size
            };
            const video = await this.videoService.createVideo(videoData);
            res.status(201).json(video);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to upload video' });
        }
    }
    async getVideo(req, res) {
        try {
            const video = await this.videoService.getVideo(req.params.videoId);
            if (!video) {
                res.status(404).json({ error: 'Video not found' });
                return;
            }
            await this.videoService.incrementViews(req.params.videoId);
            res.status(200).json(video);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get video' });
        }
    }
    async getVideosByRecipe(req, res) {
        try {
            const videos = await this.videoService.getVideosByRecipe(req.params.recipeId);
            res.status(200).json(videos);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get videos' });
        }
    }
    async getVideosByUser(req, res) {
        try {
            const videos = await this.videoService.getVideosByUser(req.params.userId);
            res.status(200).json(videos);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get videos' });
        }
    }
    async updateVideo(req, res) {
        try {
            const video = await this.videoService.updateVideo(req.params.videoId, req.body);
            if (!video) {
                res.status(404).json({ error: 'Video not found' });
                return;
            }
            res.status(200).json(video);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update video' });
        }
    }
    async deleteVideo(req, res) {
        try {
            const deleted = await this.videoService.deleteVideo(req.params.videoId);
            if (!deleted) {
                res.status(404).json({ error: 'Video not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete video' });
        }
    }
}
exports.VideoController = VideoController;
//# sourceMappingURL=video.controller.js.map