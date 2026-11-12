import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Assignment from "@/models/Assignment";
import Teacher from "@/models/Teacher";
import User from "@/models/User";
import Subject from "@/models/Subject";
import Class from "@/models/Class";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const assignment = await Assignment.findById(id)
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

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Tugas tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("GET /api/assignments/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail tugas",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    const {
      title,
      description,
      teacherId,
      subjectId,
      classId,
      deadline,
      attachments,
      status,
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

    if (attachments !== undefined && !Array.isArray(attachments)) {
      return NextResponse.json(
        {
          success: false,
          message: "Attachments harus berupa array",
        },
        { status: 400 }
      );
    }

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      {
        title,
        description: description || "",
        teacherId,
        subjectId,
        classId,
        deadline,
        attachments: attachments || [],
        status: status || "aktif",
      },
      {
        new: true,
        runValidators: true,
      }
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

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Tugas tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tugas berhasil diperbarui",
      data: assignment,
    });
  } catch (error) {
    console.error("PUT /api/assignments/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui tugas",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Tugas tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tugas berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/assignments/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus tugas",
      },
      { status: 500 }
    );
  }
}