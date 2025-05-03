import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import ffmpeg from 'fluent-ffmpeg';
import multer from 'multer';
import multerS3 from 'multer-s3';
import Video, { IVideo } from '../models/video.model';

export class VideoService {
  private s3: S3Client;
  private upload: multer.Multer;

  constructor() {
    // Validate AWS configuration
    if (!process.env.AWS_BUCKET_NAME) {
      throw new Error('AWS_BUCKET_NAME environment variable is required');
    }
    if (!process.env.AWS_REGION) {
      throw new Error('AWS_REGION environment variable is required');
    }
    if (!process.env.AWS_ACCESS_KEY_ID) {
      throw new Error('AWS_ACCESS_KEY_ID environment variable is required');
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS_SECRET_ACCESS_KEY environment variable is required');
    }

    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    this.upload = multer({
      storage: multerS3({
        s3: this.s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        }
      }),
      limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('video/')) {
          cb(new Error('Only video files are allowed'));
          return;
        }
        cb(null, true);
      }
    });
  }

  public getUploadMiddleware() {
    return this.upload.single('video');
  }

  public async createVideo(videoData: Partial<IVideo>): Promise<IVideo> {
    const video = new Video(videoData);
    return video.save();
  }

  public async getVideo(videoId: string): Promise<IVideo | null> {
    return Video.findById(videoId);
  }

  public async getVideosByRecipe(recipeId: string): Promise<IVideo[]> {
    return Video.find({ recipeId, status: 'ready' });
  }

  public async getVideosByUser(userId: string): Promise<IVideo[]> {
    return Video.find({ userId });
  }

  public async updateVideo(videoId: string, updateData: Partial<IVideo>): Promise<IVideo | null> {
    return Video.findByIdAndUpdate(videoId, updateData, { new: true });
  }

  public async deleteVideo(videoId: string): Promise<boolean> {
    const video = await Video.findById(videoId);
    if (!video) return false;

    // Delete from S3
    const key = video.url.split('/').pop();
    if (key) {
      await this.s3.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      }));
    }

    // Delete from database
    await video.deleteOne();
    return true;
  }

  public async incrementViews(videoId: string): Promise<void> {
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  }
}