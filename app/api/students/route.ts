import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
import Class from "@/models/Class";

export async function GET() {
  try {
    await connectDB();

    const students = await Student.find()
      .populate({
        path: "userId",
        select: "name email status role",
      })
      .populate({
        path: "classId",
        model: Class,
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("GET Students Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data siswa",
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
      email,
      password,
      nis,
      classId,
      major,
      enrollmentYear,
      status = "aktif",
    } = body;

    if (
      !name ||
      !email ||
      !password ||
      !nis ||
      !classId ||
      !major ||
      !enrollmentYear
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nama, email, password, NIS, kelas, jurusan, dan tahun masuk wajib diisi",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah digunakan",
        },
        { status: 409 }
      );
    }

    const existingStudent = await Student.findOne({ nis });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "NIS sudah digunakan",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "siswa",
      status,
    });

    try {
      const student = await Student.create({
        userId: user._id,
        nis,
        classId,
        major,
        enrollmentYear: Number(enrollmentYear),
        status,
      });

      await student.populate([
        {
          path: "userId",
          select: "name email status role",
        },
        {
          path: "classId",
          model: Class,
        },
      ]);

      return NextResponse.json(
        {
          success: true,
          message: "Siswa berhasil ditambahkan",
          data: student,
        },
        { status: 201 }
      );
    } catch (studentError) {
      await User.findByIdAndDelete(user._id);

      throw studentError;
    }
  } catch (error) {
    console.error("POST Student Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan siswa",
      },
      { status: 500 }
    );
  }
}