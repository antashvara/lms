"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  Users,
  ArrowUpRight,
} from "lucide-react";

interface TeachingAssignment {
  _id: string;
  teacherId: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
    };
  };
  subjectId: {
    _id: string;
    name: string;
    code: string;
  };
  classId: {
    _id: string;
    name: string;
    grade: string;
    major: string;
  };
  academicYear: string;
  status: string;
}

interface Material {
  _id: string;
  teacherId: {
    userId: {
      _id: string;
    };
  };
  title: string;
}

interface Assignment {
  _id: string;
  teacherId: {
    userId: {
      _id: string;
    };
  };
  title: string;
  status: string;
  deadline: string;
}

interface Submission {
  _id: string;
  assignmentId: string;
  status: "submitted" | "late";
}

export default function GuruPage() {
  const { data: session } = useSession();

  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [totalMaterials, setTotalMaterials] = useState(0);
  const [totalActiveAssignments, setTotalActiveAssignments] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);


useEffect(() => {
  async function fetchTeachingAssignments() {
    try {
      const response = await fetch("/api/teaching-assignments");
      const result = await response.json();

      if (!result.success) {
        throw new Error("Gagal mengambil data kelas");
      }

      const userId = session?.user?.id;

      const myAssignments = result.data.filter(
        (assignment: TeachingAssignment) =>
          assignment.teacherId?.userId?._id === userId &&
          assignment.status === "aktif"
      );

      setAssignments(myAssignments);
    } catch (error) {
      console.error("Fetch Teaching Assignments Error:", error);
    } finally {
      setLoadingClasses(false);
    }
  }

  if (session?.user?.id) {
    fetchTeachingAssignments();
  }
}, [session?.user?.id]);

useEffect(() => {
  async function fetchDashboardStats() {
    try {
      const userId = session?.user?.id;

      if (!userId) return;

      // Ambil data materi dan tugas dari API
      const [materialsResponse, assignmentsResponse] =
        await Promise.all([
          fetch("/api/materials"),
          fetch("/api/assignments"),
        ]);

      const materialsResult = await materialsResponse.json();
      const assignmentsResult = await assignmentsResponse.json();

      // Periksa apakah API berhasil
      if (
        !materialsResult.success ||
        !assignmentsResult.success
      ) {
        throw new Error("Gagal mengambil statistik dashboard");
      }

      // Filter materi milik guru yang sedang login
      const myMaterials = materialsResult.data.filter(
        (material: Material) =>
          material.teacherId?.userId?._id === userId
      );

      // Filter tugas milik guru yang sedang login
      const myAssignments = assignmentsResult.data.filter(
        (assignment: Assignment) =>
          assignment.teacherId?.userId?._id === userId
      );

      // Hitung tugas yang statusnya aktif
      const activeAssignments = myAssignments.filter(
        (assignment: Assignment) =>
          assignment.status === "aktif"
      );

      // Simpan jumlah materi dan tugas aktif
      setTotalMaterials(myMaterials.length);
      setTotalActiveAssignments(activeAssignments.length);
      
      // Ambil submission dari setiap tugas milik guru
      const submissionResponses = await Promise.all(
        myAssignments.map((assignment: Assignment) =>
          fetch(`/api/submissions?assignmentId=${assignment._id}`)
        )
      );

      // Ubah response menjadi JSON
      const submissionResults = await Promise.all(
        submissionResponses.map((response) => response.json())
      );

      // Hitung total seluruh submission
      const submissionCount = submissionResults.reduce(
        (total, result) =>
          total + (result.success ? result.total : 0),
        0
      );

      // Simpan jumlah submission
      setTotalSubmissions(submissionCount);

    } catch (error) {
      console.error("Fetch Dashboard Stats Error:", error);
    } finally {
      setLoadingStats(false);
    }
  }

  if (session?.user?.id) {
    fetchDashboardStats();
  }
  }, [session?.user?.id]);

const totalClasses = assignments.length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm text-[#6F7072]">
          Dashboard
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
          Selamat datang, {session?.user?.name || "Guru"}
        </h1>

        <p className="mt-2 text-sm text-[#A4A3A0]">
          Kelola pembelajaran dan pantau aktivitas siswa dari sini.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#292B30] bg-[#111214] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#A4A3A0]">
              Kelas Diajar
            </p>

            <Users
              size={18}
              className="text-[#6F7072]"
              strokeWidth={1.8}
            />
          </div>

          <p className="text-2xl font-semibold text-[#F2F0EA]">
            {loadingClasses ? "..." : totalClasses}
          </p>
        </div>

        <div className="rounded-xl border border-[#292B30] bg-[#111214] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#A4A3A0]">
              Materi
            </p>

            <BookOpen
              size={18}
              className="text-[#6F7072]"
              strokeWidth={1.8}
            />
          </div>

         <p className="text-2xl font-semibold text-[#F2F0EA]">
          {loadingStats ? "..." : totalMaterials}
        </p>
        </div>

        <div className="rounded-xl border border-[#292B30] bg-[#111214] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#A4A3A0]">
              Tugas Aktif
            </p>

            <ClipboardList
              size={18}
              className="text-[#6F7072]"
              strokeWidth={1.8}
            />
          </div>

          <p className="text-2xl font-semibold text-[#F2F0EA]">
            {loadingStats ? "..." : totalActiveAssignments}
          </p>
        </div>

        <div className="rounded-xl border border-[#292B30] bg-[#111214] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[#A4A3A0]">
              Perlu Dinilai
            </p>

            <ClipboardCheck
              size={18}
              className="text-[#F59E0B]"
              strokeWidth={1.8}
            />
          </div>

            <p className="text-2xl font-semibold text-[#F2F0EA]">
              {loadingStats ? "..." : totalSubmissions}
            </p>
        </div>
      </div>

      {/* Classes */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-[#F2F0EA]">
              Kelas yang Diajar
            </h2>

            <p className="mt-1 text-sm text-[#6F7072]">
              Ringkasan kelas dan mata pelajaran yang kamu ajar.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {loadingClasses ? (
            <div className="rounded-xl border border-[#292B30] bg-[#111214] px-5 py-6">
              <p className="text-sm text-[#6F7072]">
                Memuat data kelas...
              </p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="rounded-xl border border-[#292B30] bg-[#111214] px-5 py-6">
              <p className="text-sm text-[#A4A3A0]">
                Belum ada kelas yang ditugaskan kepadamu.
              </p>
            </div>
          ) : (
            assignments.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-xl border border-[#292B30] bg-[#111214] px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-[#F2F0EA]">
                    {item.classId.name}
                  </p>

                  <p className="mt-1 text-xs text-[#6F7072]">
                    {item.subjectId.name} · {item.subjectId.code}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6F7072]">
                  <span>{item.academicYear}</span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.8}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}