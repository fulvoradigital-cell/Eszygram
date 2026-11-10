import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDailyPageView extends Document {
  _id: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyPageViewSchema = new Schema<IDailyPageView>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "CreatorProfile",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    views: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee one document per profile per day
DailyPageViewSchema.index({ profileId: 1, date: 1 }, { unique: true });

const DailyPageView: Model<IDailyPageView> =
  mongoose.models.DailyPageView ||
  mongoose.model<IDailyPageView>("DailyPageView", DailyPageViewSchema);

export default DailyPageView;

