import mongoose, { Document, Schema } from 'mongoose';

export interface AllergyProfile extends Document {
  userId: string;
  allergies: string[]; // e.g., ["peanuts", "milk"]
}

const allergySchema = new Schema<AllergyProfile>({
  userId: { type: String, required: true },
  allergies: [{ type: String, required: true }]
}, { timestamps: true });

export default mongoose.model<AllergyProfile>('AllergyProfile', allergySchema);
