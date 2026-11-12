import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Subject from "@/models/Subject";

export async function GET() {
  try {
    await connectDB();

    const subjects = await Subject.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error("GET Subjects Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data mata pelajaran",
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
      code,
      description = "",
      status = "aktif",
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

    const subject = await Subject.create({
      name,
      code,
      description,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mata pelajaran berhasil ditambahkan",
        data: subject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Subject Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan mata pelajaran",
      },
      { status: 500 }
    );
  }
}