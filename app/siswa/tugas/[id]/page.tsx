"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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

interface Submission {
  _id: string;
  submissionUrl: string;
  note: string;
  submittedAt: string;
  status: "submitted" | "late";
}


export default function TugasDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
    // ID sementara untuk pengujian
  const studentId = "6ac30d392f62d90eb844ee0b";

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Data pengumpulan tugas
  const [submission, setSubmission] =
    useState<Submission | null>(null);

  const [submissionLoading, setSubmissionLoading] =
    useState(true);

  // Form pengumpulan
  const [submissionUrl, setSubmissionUrl] =
    useState("");

  const [note, setNote] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [submissionError, setSubmissionError] =
    useState("");

  const [submissionSuccess, setSubmissionSuccess] =
    useState("");


  useEffect(() => {
  if (id) {
    fetchAssignment();
    fetchSubmission();
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


async function fetchSubmission() {
  try {
    setSubmissionLoading(true);
    setSubmissionError("");

    const response = await fetch(
      `/api/submissions?assignmentId=${id}&studentId=${studentId}`
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Gagal memeriksa pengumpulan tugas"
      );
    }

    const existingSubmission =
      result.data.length > 0
        ? result.data[0]
        : null;

    setSubmission(existingSubmission);

    // Jika sudah pernah mengumpulkan,
    // tampilkan kembali data sebelumnya
    if (existingSubmission) {
      setSubmissionUrl(
        existingSubmission.submissionUrl || ""
      );

      setNote(existingSubmission.note || "");
    }
  } catch (error) {
    console.error(error);

    setSubmissionError(
      "Gagal memeriksa status pengumpulan tugas."
    );
  } finally {
    setSubmissionLoading(false);
  }
}


async function handleSubmitAssignment(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setSubmissionError("");
  setSubmissionSuccess("");

  if (!submissionUrl.trim()) {
    setSubmissionError(
      "Link hasil pengerjaan wajib diisi."
    );
    return;
  }

  try {
    setSubmitting(true);

    const response = await fetch(
      "/api/submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: id,
          studentId,
          submissionUrl: submissionUrl.trim(),
          note: note.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Gagal mengumpulkan tugas."
      );
    }

    // Simpan data submission yang baru dibuat
    setSubmission(result.data);

    setSubmissionSuccess(
      "Tugas berhasil dikumpulkan!"
    );
  } catch (error) {
    console.error(error);

    setSubmissionError(
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat mengumpulkan tugas."
    );
  } finally {
    setSubmitting(false);
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

      {/* Submission */}
      <section className="rounded-xl border border-[#202226] bg-[#111214] p-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#6F7072]">
          Pengumpulan
        </p>

        {submissionLoading ? (
          <p className="mt-4 text-xs text-[#6F7072]">
            Memeriksa status pengumpulan...
          </p>
        ) : submission ? (
          <>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <p className="text-sm font-medium text-[#F2F0EA]">
                Sudah dikumpulkan
              </p>
            </div>

            <p className="mt-2 text-xs text-[#6F7072]">
              {submission.status === "late"
                ? "Tugas dikumpulkan setelah deadline."
                : "Tugas dikumpulkan tepat waktu."}
            </p>

            <div className="mt-4 border-t border-[#202226] pt-4">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#6F7072]">
                Waktu pengumpulan
              </p>

              <p className="mt-1 text-xs text-[#A4A3A0]">
                {new Date(
                  submission.submittedAt
                ).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#6F7072]">
                Link hasil pengerjaan
              </p>

              <a
                href={submission.submissionUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-[#202226] bg-[#161719] px-3 py-3 text-xs text-[#F2F0EA] transition hover:border-[#F59E0B]"
              >
                <span className="truncate">
                  {submission.submissionUrl}
                </span>

                <ArrowUpRight
                  size={14}
                  className="shrink-0"
                />
              </a>
            </div>

            {submission.note && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#6F7072]">
                  Catatan
                </p>

                <p className="mt-2 text-xs leading-5 text-[#A4A3A0]">
                  {submission.note}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="mt-3 text-sm font-medium text-[#F2F0EA]">
              Belum dikumpulkan
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#6F7072]">
              Masukkan link hasil pengerjaan untuk mengumpulkan tugas ini.
            </p>

            <form
              onSubmit={handleSubmitAssignment}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="mb-2 block text-[11px] font-medium text-[#A4A3A0]">
                  Link hasil pengerjaan
                </label>

                <input
                  type="url"
                  value={submissionUrl}
                  onChange={(event) =>
                    setSubmissionUrl(event.target.value)
                  }
                  placeholder="https://github.com/username/project"
                  required
                  className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-3 text-xs text-[#F2F0EA] outline-none transition placeholder:text-[#55565A] focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium text-[#A4A3A0]">
                  Catatan (opsional)
                </label>

                <textarea
                  value={note}
                  onChange={(event) =>
                    setNote(event.target.value)
                  }
                  placeholder="Tambahkan catatan untuk guru..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#292B30] bg-[#161719] px-3 py-3 text-xs text-[#F2F0EA] outline-none transition placeholder:text-[#55565A] focus:border-[#F59E0B]"
                />
              </div>

              {submissionError && (
                <p className="text-xs leading-5 text-red-400">
                  {submissionError}
                </p>
              )}

              {submissionSuccess && (
                <p className="text-xs leading-5 text-emerald-400">
                  {submissionSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#F59E0B] px-4 py-3 text-xs font-semibold text-[#111214] transition hover:bg-[#FFB11B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Mengirim tugas..."
                  : "Kumpulkan Tugas"}
              </button>
            </form>
          </>
        )}

        {submissionError && submission && (
          <p className="mt-4 text-xs text-red-400">
            {submissionError}
          </p>
        )}
      </section>

        </aside>
      </div>
    </div>
  );
}