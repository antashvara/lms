import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";

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
      code,
      description = "",
      status,
    } = body;

    if (!name || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan kode mata pelajaran wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingSubject = await Subject.findOne({
      code: code.toUpperCase(),
      _id: { $ne: id },
    });

    if (existingSubject) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode mata pelajaran sudah digunakan",
        },
        { status: 409 }
      );
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        name,
        code: code.toUpperCase(),
        description,
        status: status || "aktif",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSubject) {
      return NextResponse.json(
        {
          success: false,
          message: "Mata pelajaran tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil diperbarui",
      data: updatedSubject,
    });
  } catch (error) {
    console.error("PUT Subject Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui mata pelajaran",
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

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return NextResponse.json(
        {
          success: false,
          message: "Mata pelajaran tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Mata pelajaran berhasil dihapus",
      data: deletedSubject,
    });
  } catch (error) {
    console.error("DELETE Subject Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus mata pelajaran",
      },
      { status: 500 }
    );
  }
}