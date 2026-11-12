"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  Download,
  FileText,
} from "lucide-react";

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

export default function TugasDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchAssignment();
    }
  }, [id]);

  async function fetchAssignment() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/assignments/${id}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal mengambil detail tugas"
        );
      }

      setAssignment(result.data);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat detail tugas.");
    } finally {
      setLoading(false);
    }
  }

  function formatDeadline(deadline: string) {
    return new Date(deadline).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function formatTime(deadline: string) {
    return new Date(deadline).toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getDaysLeft(deadline: string) {
    const now = new Date();
    const target = new Date(deadline);

    const difference =
      target.getTime() - now.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  if (loading) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-[#6F7072]">
          Memuat detail tugas...
        </p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="px-8 py-8">
        <Link
          href="/siswa/tugas"
          className="inline-flex items-center gap-2 text-xs text-[#6F7072] transition hover:text-[#F2F0EA]"
        >
          <ArrowLeft size={14} />
          Kembali ke Tugas
        </Link>

        <div className="mt-8 rounded-xl border border-[#202226] bg-[#111214] p-8">
          <p className="text-sm text-[#A4A3A0]">
            {error || "Tugas tidak ditemukan."}
          </p>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysLeft(
    assignment.deadline
  );

  return (
    <div className="min-h-[calc(100vh-56px)] px-8 py-8">
      {/* Back */}
      <Link
        href="/siswa/tugas"
        className="inline-flex items-center gap-2 text-xs text-[#6F7072] transition hover:text-[#F2F0EA]"
      >
        <ArrowLeft size={14} />
        Kembali ke Tugas
      </Link>

      {/* Header */}
      <div className="mt-8 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
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

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#F2F0EA]">
          {assignment.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#6F7072]">
          <span>
            Oleh {assignment.teacherId.userId.name}
          </span>

          <span>
            {assignment.classId.name}
          </span>
        </div>
      </div>

      {/* Main */}
      <div className="mt-8 grid max-w-6xl gap-5 lg:grid-cols-[1fr_320px]">
        {/* Content */}
        <div className="space-y-5">
          {/* Instructions */}
          <section className="rounded-xl border border-[#202226] bg-[#111214] p-6">
            <div className="mb-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6F7072]">
                Instruksi
              </p>

              <h2 className="mt-2 text-sm font-medium text-[#F2F0EA]">
                Deskripsi Tugas
              </h2>
            </div>

            <div className="whitespace-pre-line text-sm leading-7 text-[#A4A3A0]">
              {assignment.description ||
                "Tidak ada deskripsi tugas."}
            </div>
          </section>

          {/* Attachments */}
          <section className="rounded-xl border border-[#202226] bg-[#111214] p-6">
            <div className="mb-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6F7072]">
                Bahan Tugas
              </p>

              <h2 className="mt-2 text-sm font-medium text-[#F2F0EA]">
                Lampiran
              </h2>
            </div>

            {assignment.attachments.length === 0 ? (
              <p className="text-sm text-[#6F7072]">
                Tidak ada lampiran.
              </p>
            ) : (
              <div className="space-y-2">
                {assignment.attachments.map(
                  (attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-[#202226] bg-[#161719] px-4 py-3 transition hover:border-[#292B30]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292B30] text-[#A4A3A0]">
                          <FileText
                            size={15}
                            strokeWidth={1.6}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-[#F2F0EA]">
                            {attachment.name}
                          </p>

                          <p className="mt-1 text-[10px] uppercase text-[#6F7072]">
                            {attachment.type}
                            {attachment.size
                              ? ` • ${attachment.size}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <ArrowUpRight
                        size={15}
                        className="shrink-0 text-[#6F7072] transition group-hover:text-[#F2F0EA]"
                      />
                    </a>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Deadline */}
          <section className="rounded-xl border border-[#202226] bg-[#111214] p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6F7072]">
              Deadline
            </p>

            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292B30] text-[#A4A3A0]">
                <Clock3
                  size={15}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#F2F0EA]">
                  {formatDeadline(
                    assignment.deadline
                  )}
                </p>

                <p className="mt-1 text-[11px] text-[#6F7072]">
                  Pukul{" "}
                  {formatTime(
                    assignment.deadline
                  )} WIB
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-[#202226] pt-4">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#6F7072]">
                Status waktu
              </p>

              <p className="mt-1 text-xs font-medium text-[#A4A3A0]">
                {daysLeft > 0
                  ? `${daysLeft} hari lagi`
                  : daysLeft === 0
                  ? "Deadline hari ini"
                  : "Deadline terlewat"}
              </p>
            </div>
          </section>

          {/* Submission placeholder */}
          <section className="rounded-xl border border-[#202226] bg-[#111214] p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6F7072]">
              Pengumpulan
            </p>

            <h2 className="mt-3 text-sm font-medium text-[#F2F0EA]">
              Belum dikumpulkan
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#6F7072]">
              Setelah siap, kamu bisa mengumpulkan
              tugas dari halaman ini.
            </p>

            <button
              type="button"
              disabled
              className="mt-5 w-full rounded-lg bg-[#1C1D20] px-4 py-2.5 text-xs font-medium text-[#6F7072]"
            >
              Kumpulkan Tugas
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}