import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAssignmentAttachment {
  name: string;
  url: string;
  type: "pdf" | "ppt" | "pptx" | "doc" | "docx" | "zip" | "other";
  size?: string;
}

export interface IAssignment extends Document {
  title: string;
  description?: string;

  teacherId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;

  deadline: Date;

  attachments: IAssignmentAttachment[];

  status: "aktif" | "nonaktif";

  createdAt: Date;
  updatedAt: Date;
}

const AssignmentAttachmentSchema =
  new Schema<IAssignmentAttachment>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "pdf",
          "ppt",
          "pptx",
          "doc",
          "docx",
          "zip",
          "other",
        ],
        default: "other",
      },

      size: {
        type: String,
        trim: true,
        default: "",
      },
    },
    { _id: false }
  );

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

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

    deadline: {
      type: Date,
      required: true,
    },

    attachments: {
      type: [AssignmentAttachmentSchema],
      default: [],
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

const Assignment: Model<IAssignment> =
  mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;