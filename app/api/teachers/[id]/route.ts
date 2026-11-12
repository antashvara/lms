import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Teacher from "@/models/Teacher";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      email,
      password,
      nip,
      status,
    } = body;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Guru tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const user = await User.findById(teacher.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Data user guru tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    if (email && email !== user.email) {
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
          {
            status: 409,
          }
        );
      }
    }

    if (nip && nip !== teacher.nip) {
      const existingTeacher = await Teacher.findOne({
        nip,
        _id: { $ne: teacher._id },
      });

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
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (status) {
      user.status = status;
      teacher.status = status;
    }

    if (nip) {
      teacher.nip = nip;
    }

    await user.save();
    await teacher.save();

    return NextResponse.json({
      success: true,
      message: "Guru berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT Teacher Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui data guru",
      },
      {
        status: 500,
      }
    );
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Guru tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await Teacher.findByIdAndDelete(id);
    await User.findByIdAndDelete(teacher.userId);

    return NextResponse.json({
      success: true,
      message: "Guru berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Teacher Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus guru",
      },
      { status: 500 }
    );
  }
}