import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Assignment from "@/models/Assignment";
import Teacher from "@/models/Teacher";
import User from "@/models/User";
import Subject from "@/models/Subject";
import Class from "@/models/Class";

export async function GET() {
  try {
    await connectDB();

    const assignments = await Assignment.find()
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
      .sort({ deadline: 1 });

    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("GET /api/assignments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil tugas",
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
      teacherId,
      subjectId,
      classId,
      deadline,
      attachments = [],
      status = "aktif",
    } = body;

    if (
      !title ||
      !teacherId ||
      !subjectId ||
      !classId ||
      !deadline
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Judul, guru, mata pelajaran, kelas, dan deadline wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(attachments)) {
      return NextResponse.json(
        {
          success: false,
          message: "Attachments harus berupa array",
        },
        { status: 400 }
      );
    }

    const assignment = await Assignment.create({
      title,
      description: description || "",
      teacherId,
      subjectId,
      classId,
      deadline,
      attachments,
      status,
    });

    const populatedAssignment = await Assignment.findById(
      assignment._id
    )
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
        message: "Tugas berhasil dibuat",
        data: populatedAssignment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/assignments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat tugas",
      },
      { status: 500 }
    );
  }
}