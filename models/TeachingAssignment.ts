import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeachingAssignment extends Document {
  teacherId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  academicYear: string;
  status: "aktif" | "nonaktif";
  createdAt: Date;
  updatedAt: Date;
}

const TeachingAssignmentSchema =
  new Schema<ITeachingAssignment>(
    {
      teacherId: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      },

      subjectId: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },

      classId: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },

      academicYear: {
        type: String,
        required: true,
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

const TeachingAssignment: Model<ITeachingAssignment> =
  mongoose.models.TeachingAssignment ||
  mongoose.model<ITeachingAssignment>(
    "TeachingAssignment",
    TeachingAssignmentSchema
  );

export default TeachingAssignment;