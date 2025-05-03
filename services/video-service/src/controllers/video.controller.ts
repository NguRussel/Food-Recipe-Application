import { Request, Response } from 'express';
import { VideoService } from '../services/video.service';

export class VideoController {
  private videoService: VideoService;

  constructor() {
    this.videoService = new VideoService();
  }

  public async uploadVideo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No video file provided' });
        return;
      }

      const file = req.file as Express.MulterS3.File;
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
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload video' });
    }
  }

  public async getVideo(req: Request, res: Response): Promise<void> {
    try {
      const video = await this.videoService.getVideo(req.params.videoId);
      if (!video) {
        res.status(404).json({ error: 'Video not found' });
        return;
      }
      await this.videoService.incrementViews(req.params.videoId);
      res.status(200).json(video);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get video' });
    }
  }

  public async getVideosByRecipe(req: Request, res: Response): Promise<void> {
    try {
      const videos = await this.videoService.getVideosByRecipe(req.params.recipeId);
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get videos' });
    }
  }

  public async getVideosByUser(req: Request, res: Response): Promise<void> {
    try {
      const videos = await this.videoService.getVideosByUser(req.params.userId);
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get videos' });
    }
  }

  public async updateVideo(req: Request, res: Response): Promise<void> {
    try {
      const video = await this.videoService.updateVideo(req.params.videoId, req.body);
      if (!video) {
        res.status(404).json({ error: 'Video not found' });
        return;
      }
      res.status(200).json(video);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update video' });
    }
  }

  public async deleteVideo(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await this.videoService.deleteVideo(req.params.videoId);
      if (!deleted) {
        res.status(404).json({ error: 'Video not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete video' });
    }
  }
}