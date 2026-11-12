import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Student from "@/models/Student";
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
      name,
      email,
      password,
      nis,
      classId,
      major,
      enrollmentYear,
      status,
    } = body;

    if (
      !name ||
      !email ||
      !nis ||
      !classId ||
      !major ||
      !enrollmentYear
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nama, email, NIS, kelas, jurusan, dan tahun masuk wajib diisi",
        },
        { status: 400 }
      );
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Siswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Cek NIS milik siswa lain
    const existingStudent = await Student.findOne({
      nis,
      _id: { $ne: id },
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "NIS sudah digunakan",
        },
        { status: 409 }
      );
    }

    // Ambil User yang terhubung dengan Student
    const user = await User.findById(student.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Data akun siswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Cek email milik user lain
    const existingUser = await User.findOne({
      email,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah digunakan",
        },
        { status: 409 }
      );
    }

    // Update data User
    user.name = name;
    user.email = email;
    user.status = status || "aktif";

    // Password hanya diubah kalau diisi
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Update data Student
    student.nis = nis;
    student.classId = classId;
    student.major = major;
    student.enrollmentYear = Number(enrollmentYear);
    student.status = status || "aktif";

    await student.save();

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

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil diperbarui",
      data: student,
    });
  } catch (error) {
    console.error("PUT Student Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui siswa",
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

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Siswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Hapus Student
    await Student.findByIdAndDelete(id);

    // Hapus User yang terhubung
    await User.findByIdAndDelete(student.userId);

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Student Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus siswa",
      },
      { status: 500 }
    );
  }
}   