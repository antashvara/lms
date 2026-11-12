import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  nis: string;
  classId: mongoose.Types.ObjectId;
  major: string;
  enrollmentYear: number;
  status: "aktif" | "nonaktif";
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    nis: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    major: {
      type: String,
      required: true,
      trim: true,
    },

    enrollmentYear: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["aktif", "nonaktif"],
      default: "aktif",
    },
  },
  { timestamps: true }
);

const Student: Model<IStudent> =
  mongoose.models.Student ||
  mongoose.model<IStudent>("Student", StudentSchema);

export default Student;