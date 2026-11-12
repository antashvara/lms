import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Material from "@/models/Material";
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

    const material = await Material.findById(id)
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

    if (!material) {
      return NextResponse.json(
        {
          success: false,
          message: "Materi tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error("GET /api/materials/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail materi",
      },
      { status: 500 }
    );
  }
}