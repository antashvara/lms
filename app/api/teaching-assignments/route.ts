import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import TeachingAssignment from "@/models/TeachingAssignment";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import Class from "@/models/Class";

export async function GET() {
  try {
    await connectDB();

    const assignments = await TeachingAssignment.find()
      .populate({
        path: "teacherId",
        model: Teacher,
        populate: {
          path: "userId",
          select: "name email status role",
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
      data: assignments,
    });
  } catch (error) {
    console.error("GET Teaching Assignments Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data teaching assignment",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      teacherId,
      subjectId,
      classId,
      academicYear,
      status = "aktif",
    } = body;

    if (!teacherId || !subjectId || !classId || !academicYear) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Guru, mata pelajaran, kelas, dan tahun ajaran wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingAssignment = await TeachingAssignment.findOne({
      teacherId,
      subjectId,
      classId,
      academicYear,
    });

    if (existingAssignment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Teaching assignment dengan kombinasi tersebut sudah ada",
        },
        { status: 409 }
      );
    }

    const assignment = await TeachingAssignment.create({
      teacherId,
      subjectId,
      classId,
      academicYear,
      status,
    });

    await assignment.populate([
      {
        path: "teacherId",
        model: Teacher,
        populate: {
          path: "userId",
          select: "name email status role",
        },
      },
      {
        path: "subjectId",
        model: Subject,
      },
      {
        path: "classId",
        model: Class,
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Teaching assignment berhasil ditambahkan",
        data: assignment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Teaching Assignment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan teaching assignment",
      },
      { status: 500 }
    );
  }
}