import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMaterialAttachment {
  name: string;
  url: string;
  type: "pdf" | "ppt" | "pptx" | "doc" | "docx" | "zip" | "other";
  size?: string;
}

export interface IMaterialResourceLink {
  title: string;
  url: string;
}

export interface IMaterial extends Document {
  title: string;
  description?: string;
  content: string;

  attachments: IMaterialAttachment[];

  videoUrl?: string;

  resourceLinks: IMaterialResourceLink[];

  teacherId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const MaterialAttachmentSchema = new Schema<IMaterialAttachment>(
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

const MaterialResourceLinkSchema =
  new Schema<IMaterialResourceLink>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { _id: false }
  );

const MaterialSchema = new Schema<IMaterial>(
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

    content: {
      type: String,
      required: true,
    },

    // Bahan ajar seperti PDF, PPT, DOCX, ZIP, dll.
    attachments: {
      type: [MaterialAttachmentSchema],
      default: [],
    },

    // Video pembelajaran.
    // Untuk sekarang kita simpan URL,
    // misalnya URL YouTube.
    videoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // Link pembelajaran tambahan.
    resourceLinks: {
      type: [MaterialResourceLinkSchema],
      default: [],
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
  },
  {
    timestamps: true,
  }
);

const Material: Model<IMaterial> =
  mongoose.models.Material ||
  mongoose.model<IMaterial>("Material", MaterialSchema);

export default Material;