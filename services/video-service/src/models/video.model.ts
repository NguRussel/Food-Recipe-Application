import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  recipeId: string;
  userId: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  quality: string;
  size: number;
  views: number;
  status: 'processing' | 'ready' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  recipeId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  quality: { type: String, required: true },
  size: { type: Number, required: true },
  views: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
  }
}, { timestamps: true });

export default mongoose.model<IVideo>('Video', VideoSchema);