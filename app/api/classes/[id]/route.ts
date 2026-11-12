import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";
import Teacher from "@/models/Teacher";

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
      name,
      grade,
      major,
      academicYear,
      homeroomTeacherId,
      status,
    } = body;

    if (!name || !grade || !major || !academicYear) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nama kelas, tingkat, jurusan, dan tahun ajaran wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingClass = await Class.findOne({
      name,
      academicYear,
      _id: { $ne: id },
    });

    if (existingClass) {
      return NextResponse.json(
        {
          success: false,
          message: "Kelas dengan tahun ajaran tersebut sudah ada",
        },
        { status: 409 }
      );
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        name,
        grade,
        major,
        academicYear,
        homeroomTeacherId: homeroomTeacherId || null,
        status: status || "aktif",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClass) {
      return NextResponse.json(
        {
          success: false,
          message: "Kelas tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await updatedClass.populate({
      path: "homeroomTeacherId",
      model: Teacher,
    });

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil diperbarui",
      data: updatedClass,
    });
  } catch (error) {
    console.error("PUT Class Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui kelas",
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

    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return NextResponse.json(
        {
          success: false,
          message: "Kelas tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kelas berhasil dihapus",
      data: deletedClass,
    });
  } catch (error) {
    console.error("DELETE Class Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus kelas",
      },
      { status: 500 }
    );
  }
}