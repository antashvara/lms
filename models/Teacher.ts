import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  nip: string;
  status: "aktif" | "nonaktif";
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    nip: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

const Teacher: Model<ITeacher> =
  mongoose.models.Teacher ||
  mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;