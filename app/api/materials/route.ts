import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Material from "@/models/Material";
import Teacher from "@/models/Teacher";
import User from "@/models/User";
import Subject from "@/models/Subject";
import Class from "@/models/Class";

export async function GET() {
  try {
    await connectDB();

    const materials = await Material.find()
      .populate({
        path: "teacherId",
        model: Teacher,
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      })
      .populate({
        path: "subjectId",
        model: Subject,
      })
      .populate({
        path: "classId",
        model: Class,
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error("GET /api/materials error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil materi",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      title,
      description,
      content,
      teacherId,
      subjectId,
      classId,
      attachments = [],
      videoUrl = "",
      resourceLinks = [],
    } = body;

    // Validasi field utama
    if (
      !title ||
      !content ||
      !teacherId ||
      !subjectId ||
      !classId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Judul, isi materi, guru, mata pelajaran, dan kelas wajib diisi",
        },
        { status: 400 }
      );
    }

    // Validasi attachment
    if (!Array.isArray(attachments)) {
      return NextResponse.json(
        {
          success: false,
          message: "Attachments harus berupa array",
        },
        { status: 400 }
      );
    }

    // Validasi resource links
    if (!Array.isArray(resourceLinks)) {
      return NextResponse.json(
        {
          success: false,
          message: "Resource links harus berupa array",
        },
        { status: 400 }
      );
    }

    const material = await Material.create({
      title,
      description: description || "",
      content,

      attachments,
      videoUrl: videoUrl || "",
      resourceLinks,

      teacherId,
      subjectId,
      classId,
    });

    const populatedMaterial = await Material.findById(material._id)
      .populate({
        path: "teacherId",
        model: Teacher,
        populate: {
          path: "userId",
          model: User,
          select: "name email",
        },
      })
      .populate({
        path: "subjectId",
        model: Subject,
      })
      .populate({
        path: "classId",
        model: Class,
      });

    return NextResponse.json(
      {
        success: true,
        message: "Materi berhasil dibuat",
        data: populatedMaterial,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/materials error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat materi",
      },
      { status: 500 }
    );
  }
}