import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Submission from "@/models/Submission";
import Assignment from "@/models/Assignment";
import Student from "@/models/Student";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      assignmentId,
      studentId,
      submissionUrl,
      note,
    } = body;

    if (!assignmentId || !studentId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Assignment dan siswa wajib diisi",
        },
        { status: 400 }
      );
    }

    // Cek tugas
    const assignment = await Assignment.findById(
      assignmentId
    );

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "Tugas tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Cek siswa
    const student = await Student.findById(
      studentId
    );

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Siswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Cek apakah siswa sudah pernah mengumpulkan
    const existingSubmission =
      await Submission.findOne({
        assignmentId,
        studentId,
      });

    if (existingSubmission) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Siswa sudah mengumpulkan tugas ini",
        },
        { status: 400 }
      );
    }

    // Tentukan status berdasarkan deadline
    const now = new Date();
    const deadline = new Date(
      assignment.deadline
    );

    const status =
      now > deadline
        ? "late"
        : "submitted";

    const submission = await Submission.create({
      assignmentId,
      studentId,
      submissionUrl: submissionUrl || "",
      note: note || "",
      submittedAt: now,
      status,
    });

    const populatedSubmission =
      await Submission.findById(
        submission._id
      )
        .populate({
          path: "assignmentId",
          model: Assignment,
          populate: [
            {
              path: "subjectId",
            },
            {
              path: "teacherId",
              populate: {
                path: "userId",
                model: User,
                select: "name email",
              },
            },
          ],
        })
        .populate({
          path: "studentId",
          model: Student,
          populate: {
            path: "userId",
            model: User,
            select: "name email",
          },
        });

    return NextResponse.json(
      {
        success: true,
        message: "Tugas berhasil dikumpulkan",
        data: populatedSubmission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/submissions error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengumpulkan tugas",
      },
      { status: 500 }
    );
  }
}