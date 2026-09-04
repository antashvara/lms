import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Teacher from "@/models/Teacher";

export async function GET() {
  try {
    await connectDB();

    const teachers = await Teacher.find()
      .populate("userId", "name email status role")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("GET Teachers Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data guru",
      },
      {
        status: 500,
      }
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
      nip,
      status = "aktif",
    } = body;

    // Validasi data wajib
    if (!name || !email || !password || !nip) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama, email, password, dan NIP wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    // Cek email sudah digunakan atau belum
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah digunakan",
        },
        {
          status: 409,
        }
      );
    }

    // Cek NIP sudah digunakan atau belum
    const existingTeacher = await Teacher.findOne({ nip });

    if (existingTeacher) {
      return NextResponse.json(
        {
          success: false,
          message: "NIP sudah digunakan",
        },
        {
          status: 409,
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "guru",
      status,
    });

    try {
      // Buat Teacher
      const teacher = await Teacher.create({
        userId: user._id,
        nip,
        status,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Guru berhasil ditambahkan",
          data: teacher,
        },
        {
          status: 201,
        }
      );
    } catch (teacherError) {
      // Jika Teacher gagal dibuat,
      // hapus User yang tadi sudah dibuat
      await User.findByIdAndDelete(user._id);

      throw teacherError;
    }
  } catch (error) {
    console.error("POST Teacher Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan guru",
      },
      {
        status: 500,
      }
    );
  }
}