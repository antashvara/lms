import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClass extends Document {
  name: string;
  grade: "X" | "XI" | "XII";
  major: string;
  academicYear: string;
  homeroomTeacherId?: mongoose.Types.ObjectId | null;
  status: "aktif" | "nonaktif";
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    grade: {
      type: String,
      enum: ["X", "XI", "XII"],
      required: true,
    },

    major: {
      type: String,
      required: true,
      trim: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    homeroomTeacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
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

const Class: Model<IClass> =
  mongoose.models.Class ||
  mongoose.model<IClass>("Class", ClassSchema);

export default Class;