import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationPreferences extends Document {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  recipeUpdates: boolean;
  systemAnnouncements: boolean;
  deviceTokens: string[];
  email: string;
  updatedAt: Date;
}

const NotificationPreferencesSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  pushEnabled: { type: Boolean, default: true },
  emailEnabled: { type: Boolean, default: true },
  recipeUpdates: { type: Boolean, default: true },
  systemAnnouncements: { type: Boolean, default: true },
  deviceTokens: [{ type: String }],
  email: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<INotificationPreferences>('NotificationPreferences', NotificationPreferencesSchema);