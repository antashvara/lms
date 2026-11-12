"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  GraduationCap,
  User,
} from "lucide-react";

interface Material {
  _id: string;
  title: string;
  description: string;
  content: string;

  attachments: {
    name: string;
    url: string;
    type: string;
    size?: string;
  }[];

  videoUrl?: string;

  resourceLinks: {
    title: string;
    url: string;
  }[];

  teacherId: {
    userId: {
      name: string;
      email: string;
    };
  };

  subjectId: {
    name: string;
    code: string;
  };

  classId: {
    name: string;
    grade: string;
    major: string;
  };
}

export default function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        const { id } = await params;

        const response = await fetch(`/api/materials/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          setError(result.message || "Materi tidak ditemukan");
          return;
        }

        setMaterial(result.data);
      } catch (error) {
        console.error("Gagal mengambil detail materi:", error);
        setError("Terjadi kesalahan saat mengambil materi");
      } finally {
        setLoading(false);
      }
    }

    fetchMaterial();
  }, [params]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-[#202226] bg-[#111214] p-10 text-center">
          <p className="text-xs text-[#6F7072]">
            Memuat materi...
          </p>
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-[#202226] bg-[#111214] p-10 text-center">
          <p className="text-sm text-[#F2F0EA]">
            {error || "Materi tidak ditemukan"}
          </p>

          <Link
            href="/siswa/materi"
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#A4A3A0] transition hover:text-[#F2F0EA]"
          >
            <ArrowLeft size={14} strokeWidth={1.7} />
            Kembali ke Materi
          </Link>
        </div>
      </div>
    );
  }

  // Memisahkan content berdasarkan baris kosong.
  // Jadi kalau nanti content memiliki beberapa paragraf,
  // masing-masing akan tampil sebagai paragraf terpisah.
  const paragraphs = material.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="p-8">
      {/* BACK */}
      <Link
        href="/siswa/materi"
        className="mb-7 inline-flex items-center gap-2 text-xs text-[#6F7072] transition hover:text-[#F2F0EA]"
      >
        <ArrowLeft size={14} strokeWidth={1.7} />
        Kembali ke Materi
      </Link>

      {/* HEADER */}
      <div className="max-w-6xl">
        <div className="flex items-start gap-4">
          {/* ICON */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#292B30] bg-[#161719]">
            <BookOpen
              size={19}
              strokeWidth={1.6}
              className="text-[#F2F0EA]"
            />
          </div>

          {/* TITLE */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
                {material.subjectId.name}
              </p>

              <span className="text-[10px] text-[#6F7072]">
                ·
              </span>

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
                {material.subjectId.code}
              </p>
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#F2F0EA]">
              {material.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F7072]">
              {material.description}
            </p>
          </div>
        </div>

        {/* META */}
        <div className="mt-7 flex flex-wrap gap-x-10 gap-y-5 border-y border-[#202226] py-5">
          {/* GURU */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#161719]">
              <User
                size={14}
                strokeWidth={1.6}
                className="text-[#A4A3A0]"
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#6F7072]">
                Guru
              </p>

              <p className="mt-1 text-xs text-[#A4A3A0]">
                {material.teacherId.userId.name}
              </p>
            </div>
          </div>

          {/* KELAS */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#161719]">
              <GraduationCap
                size={14}
                strokeWidth={1.6}
                className="text-[#A4A3A0]"
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#6F7072]">
                Kelas
              </p>

              <p className="mt-1 text-xs text-[#A4A3A0]">
                {material.classId.name}
              </p>
            </div>
          </div>

          {/* TAHUN AJARAN */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#161719]">
              <Clock3
                size={14}
                strokeWidth={1.6}
                className="text-[#A4A3A0]"
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#6F7072]">
                Tahun Ajaran
              </p>

              <p className="mt-1 text-xs text-[#A4A3A0]">
                2026/2027
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* ARTICLE */}
        <article className="rounded-lg border border-[#202226] bg-[#111214]">
          <div className="border-b border-[#202226] px-7 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
              Materi Pembelajaran
            </p>

            <h2 className="mt-2 text-lg font-medium text-[#F2F0EA]">
              {material.title}
            </h2>
          </div>

          <div className="px-7 py-7">
            {paragraphs.length > 0 ? (
              <div className="space-y-5">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="max-w-3xl text-sm leading-7 text-[#A4A3A0]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6F7072]">
                Belum ada isi materi.
              </p>
            )}
          </div>
        </article>

        {/* BAHAN AJAR */}
        <div className="mt-6 rounded-lg border border-[#202226] bg-[#111214]">
          <div className="border-b border-[#202226] px-7 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
              Bahan Ajar
            </p>

            <h2 className="mt-2 text-lg font-medium text-[#F2F0EA]">
              Materi Pendukung
            </h2>
          </div>

          <div className="px-7 py-5">
            {material.attachments.length > 0 ? (
              <div className="space-y-3">
                {material.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-md border border-[#292B30] bg-[#161719] px-4 py-3 transition-colors hover:border-[#3A3C42] hover:bg-[#1C1D20]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#F2F0EA]">
                        {attachment.name}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[9px] uppercase tracking-[0.08em] text-[#6F7072]">
                          {attachment.type}
                        </span>

                        {attachment.size && (
                          <>
                            <span className="text-[9px] text-[#6F7072]">
                              ·
                            </span>

                            <span className="text-[9px] text-[#6F7072]">
                              {attachment.size}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <ArrowRight
                      size={14}
                      strokeWidth={1.7}
                      className="ml-4 shrink-0 text-[#6F7072]"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6F7072]">
                Belum ada bahan ajar.
              </p>
            )}
          </div>
        </div>

                {/* VIDEO PEMBELAJARAN */}
        {material.videoUrl && (
          <div className="mt-6 rounded-lg border border-[#202226] bg-[#111214]">
            <div className="border-b border-[#202226] px-7 py-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
                Video Pembelajaran
              </p>

              <h2 className="mt-2 text-lg font-medium text-[#F2F0EA]">
                Video Materi
              </h2>
            </div>

            <div className="p-7">
              <div className="overflow-hidden rounded-md border border-[#292B30] bg-[#0B0C0E]">
                <div className="flex aspect-video items-center justify-center">
                  <a
                    href={material.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 text-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#292B30] bg-[#161719]">
                      <ArrowRight
                        size={17}
                        strokeWidth={1.7}
                        className="ml-0.5 text-[#F2F0EA]"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#F2F0EA]">
                        Tonton Video Pembelajaran
                      </p>

                      <p className="mt-1 text-[10px] text-[#6F7072]">
                        Buka video di halaman baru
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

                {/* SUMBER PEMBELAJARAN */}
        {material.resourceLinks.length > 0 && (
          <div className="mt-6 rounded-lg border border-[#202226] bg-[#111214]">
            <div className="border-b border-[#202226] px-7 py-5">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
                Sumber Pembelajaran
              </p>

              <h2 className="mt-2 text-lg font-medium text-[#F2F0EA]">
                Referensi Tambahan
              </h2>
            </div>

            <div className="px-7 py-5">
              <div className="space-y-3">
                {material.resourceLinks.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-md border border-[#292B30] bg-[#161719] px-4 py-3 transition-colors hover:border-[#3A3C42] hover:bg-[#1C1D20]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#F2F0EA]">
                        {resource.title}
                      </p>

                      <p className="mt-1 truncate text-[9px] text-[#6F7072]">
                        {resource.url}
                      </p>
                    </div>

                    <ArrowRight
                      size={14}
                      strokeWidth={1.7}
                      className="ml-4 shrink-0 text-[#6F7072]"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SIDEBAR */}
        <aside className="space-y-4">
          {/* PROGRESS */}
          <div className="rounded-lg border border-[#202226] bg-[#111214] p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
              Learning Progress
            </p>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-[#F2F0EA]">
                  {completed ? "100%" : "0%"}
                </p>

                <p className="mt-1 text-[10px] text-[#6F7072]">
                  Materi
                </p>
              </div>

              {completed && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F2F0EA]">
                  <Check
                    size={14}
                    strokeWidth={2}
                    className="text-[#0B0C0E]"
                  />
                </div>
              )}
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#202226]">
              <div
                className="h-full rounded-full bg-[#F2F0EA] transition-all duration-300"
                style={{
                  width: completed ? "100%" : "0%",
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => setCompleted(!completed)}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${
                completed
                  ? "border border-[#292B30] bg-[#161719] text-[#A4A3A0] hover:text-[#F2F0EA]"
                  : "bg-[#F2F0EA] text-[#0B0C0E] hover:bg-[#DCDAD4]"
              }`}
            >
              {completed ? (
                <>
                  <Check size={14} strokeWidth={2} />
                  Sudah Selesai
                </>
              ) : (
                <>
                  Tandai Selesai
                  <ArrowRight size={14} strokeWidth={1.7} />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[9px] leading-4 text-[#6F7072]">
              Progress ini masih bersifat lokal dan belum
              disimpan ke database.
            </p>
          </div>

          {/* MATERIAL INFO */}
          <div className="rounded-lg border border-[#202226] bg-[#111214] p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#6F7072]">
              Tentang Materi
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#6F7072]">
                  Mata Pelajaran
                </p>

                <p className="mt-1 text-xs text-[#A4A3A0]">
                  {material.subjectId.name}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#6F7072]">
                  Kode
                </p>

                <p className="mt-1 text-xs text-[#A4A3A0]">
                  {material.subjectId.code}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#6F7072]">
                  Kelas
                </p>

                <p className="mt-1 text-xs text-[#A4A3A0]">
                  {material.classId.name}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#6F7072]">
                  Pengajar
                </p>

                <p className="mt-1 text-xs text-[#A4A3A0]">
                  {material.teacherId.userId.name}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="mt-6 flex max-w-6xl items-center justify-between border-t border-[#202226] pt-5">
        <Link
          href="/siswa/materi"
          className="inline-flex items-center gap-2 text-xs text-[#6F7072] transition hover:text-[#F2F0EA]"
        >
          <ArrowLeft size={14} strokeWidth={1.7} />
          Semua Materi
        </Link>

        <button
          type="button"
          onClick={() => setCompleted(true)}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#F2F0EA] transition hover:text-[#A4A3A0]"
        >
          Selesai Belajar
          <Check size={14} strokeWidth={1.7} />
        </button>
      </div>
    </div>
  );
}