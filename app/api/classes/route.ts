import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";
import Teacher from "@/models/Teacher";

export async function GET() {
  try {
    await connectDB();

  const classes = await Class.find()
    .populate({
      path: "homeroomTeacherId",
      model: Teacher,
    })
    .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error("GET Classes Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kelas",
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
      name,
      grade,
      major,
      academicYear,
      homeroomTeacherId,
      status = "aktif",
    } = body;

    if (!name || !grade || !major || !academicYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama kelas, tingkat, jurusan, dan tahun ajaran wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingClass = await Class.findOne({
      name,
      academicYear,
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

    const newClass = await Class.create({
      name,
      grade,
      major,
      academicYear,
      homeroomTeacherId: homeroomTeacherId || null,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kelas berhasil ditambahkan",
        data: newClass,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Class Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan kelas",
      },
      { status: 500 }
    );
  }
}