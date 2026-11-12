"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, FileText } from "lucide-react";

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  status: "aktif" | "nonaktif";

  teacherId: {
    userId: {
      name: string;
    };
  };

  subjectId: {
    name: string;
    code: string;
  };

  classId: {
    name: string;
  };

  attachments: {
    name: string;
    url: string;
    type: string;
    size?: string;
  }[];
}

export default function TugasPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    try {
      setLoading(true);

      const response = await fetch("/api/assignments");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data tugas");
      }

      setAssignments(result.data);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat tugas.");
    } finally {
      setLoading(false);
    }
  }

  function formatDeadline(deadline: string) {
    return new Date(deadline).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getDaysLeft(deadline: string) {
    const now = new Date();
    const target = new Date(deadline);

    const difference = target.getTime() - now.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return days;
  }

  return (
    <div className="min-h-[calc(100vh-56px)] px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#6F7072]">
          Learning
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
          Tugas
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#6F7072]">
          Lihat tugas yang perlu dikerjakan dan pantau deadline pembelajaranmu.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-[#202226] bg-[#111214] p-6">
          <p className="text-sm text-[#6F7072]">
            Memuat tugas...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-[#292B30] bg-[#111214] p-6">
          <p className="text-sm text-[#A4A3A0]">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && assignments.length === 0 && (
        <div className="rounded-xl border border-[#202226] bg-[#111214] p-10 text-center">
          <FileText
            size={28}
            strokeWidth={1.5}
            className="mx-auto text-[#6F7072]"
          />

          <h2 className="mt-4 text-sm font-medium text-[#F2F0EA]">
            Belum ada tugas
          </h2>

          <p className="mt-2 text-xs text-[#6F7072]">
            Tugas yang diberikan guru akan muncul di sini.
          </p>
        </div>
      )}

      {/* Assignment List */}
      {!loading && !error && assignments.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#F2F0EA]">
                Semua Tugas
              </h2>

              <p className="mt-1 text-xs text-[#6F7072]">
                {assignments.length} tugas tersedia
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {assignments.map((assignment) => {
              const daysLeft = getDaysLeft(assignment.deadline);

              return (
                <Link
                  key={assignment._id}
                  href={`/siswa/tugas/${assignment._id}`}
                  className="group block rounded-xl border border-[#202226] bg-[#111214] p-5 transition hover:border-[#292B30] hover:bg-[#161719]"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      {/* Subject */}
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#A4A3A0]">
                          {assignment.subjectId.name}
                        </span>

                        <span className="text-[#292B30]">
                          •
                        </span>

                        <span className="text-[11px] text-[#6F7072]">
                          {assignment.subjectId.code}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-medium text-[#F2F0EA] transition group-hover:text-white">
                        {assignment.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-[#6F7072]">
                        {assignment.description || "Tidak ada deskripsi tugas."}
                      </p>

                      {/* Meta */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#6F7072]">
                          <Clock3 size={13} strokeWidth={1.7} />

                          <span>
                            Deadline {formatDeadline(assignment.deadline)}
                          </span>
                        </div>

                        <span className="text-xs text-[#6F7072]">
                          {assignment.teacherId.userId.name}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex shrink-0 items-center gap-4">
                      <div className="hidden text-right sm:block">
                        <p className="text-[10px] uppercase tracking-[0.08em] text-[#6F7072]">
                          Deadline
                        </p>

                        <p
                          className={`mt-1 text-xs font-medium ${
                            daysLeft <= 3
                              ? "text-[#F2F0EA]"
                              : "text-[#A4A3A0]"
                          }`}
                        >
                          {daysLeft > 0
                            ? `${daysLeft} hari lagi`
                            : daysLeft === 0
                            ? "Hari ini"
                            : "Terlewat"}
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292B30] text-[#6F7072] transition group-hover:border-[#3A3C42] group-hover:text-[#F2F0EA]">
                        <ArrowRight
                          size={15}
                          strokeWidth={1.7}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}