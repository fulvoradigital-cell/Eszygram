import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourseProgress extends Document {
  _id: mongoose.Types.ObjectId;
  buyerEmail: string;
  productId: mongoose.Types.ObjectId;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    buyerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    completedLessonIds: {
      type: [String],
      default: [],
    },
    lastAccessedLessonId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique progress per buyer per course
CourseProgressSchema.index({ buyerEmail: 1, productId: 1 }, { unique: true });

export const CourseProgress: Model<ICourseProgress> =
  mongoose.models.CourseProgress ||
  mongoose.model<ICourseProgress>("CourseProgress", CourseProgressSchema);
