import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  status: "aktif" | "nonaktif";
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["aktif", "nonaktif"],
      default: "aktif",
    },
  },
  {
    timestamps: true,
  }
);

const Subject: Model<ISubject> =
  mongoose.models.Subject ||
  mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;