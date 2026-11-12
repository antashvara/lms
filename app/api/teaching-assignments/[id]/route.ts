import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import TeachingAssignment from "@/models/TeachingAssignment";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import Class from "@/models/Class";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    const {
      teacherId,
      subjectId,
      classId,
      academicYear,
      status,
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

    const existingAssignment =
      await TeachingAssignment.findOne({
        teacherId,
        subjectId,
        classId,
        academicYear,
        _id: { $ne: id },
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

    const updatedAssignment =
      await TeachingAssignment.findByIdAndUpdate(
        id,
        {
          teacherId,
          subjectId,
          classId,
          academicYear,
          status: status || "aktif",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedAssignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Teaching assignment tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await updatedAssignment.populate([
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

    return NextResponse.json({
      success: true,
      message: "Teaching assignment berhasil diperbarui",
      data: updatedAssignment,
    });
  } catch (error) {
    console.error("PUT Teaching Assignment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui teaching assignment",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deletedAssignment =
      await TeachingAssignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Teaching assignment tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Teaching assignment berhasil dihapus",
      data: deletedAssignment,
    });
  } catch (error) {
    console.error("DELETE Teaching Assignment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus teaching assignment",
      },
      { status: 500 }
    );
  }
}