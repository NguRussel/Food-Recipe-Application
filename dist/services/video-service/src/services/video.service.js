"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const video_model_1 = __importDefault(require("../models/video.model"));
class VideoService {
    constructor() {
        this.s3 = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        this.upload = (0, multer_1.default)({
            storage: (0, multer_s3_1.default)({
                s3: this.s3,
                bucket: process.env.AWS_BUCKET_NAME,
                contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
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
    getUploadMiddleware() {
        return this.upload.single('video');
    }
    async createVideo(videoData) {
        const video = new video_model_1.default(videoData);
        return video.save();
    }
    async getVideo(videoId) {
        return video_model_1.default.findById(videoId);
    }
    async getVideosByRecipe(recipeId) {
        return video_model_1.default.find({ recipeId, status: 'ready' });
    }
    async getVideosByUser(userId) {
        return video_model_1.default.find({ userId });
    }
    async updateVideo(videoId, updateData) {
        return video_model_1.default.findByIdAndUpdate(videoId, updateData, { new: true });
    }
    async deleteVideo(videoId) {
        const video = await video_model_1.default.findById(videoId);
        if (!video)
            return false;
        // Delete from S3
        const key = video.url.split('/').pop();
        if (key) {
            await this.s3.send(new client_s3_1.DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key
            }));
        }
        // Delete from database
        await video.deleteOne();
        return true;
    }
    async incrementViews(videoId) {
        await video_model_1.default.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    }
}
exports.VideoService = VideoService;
//# sourceMappingURL=video.service.js.map