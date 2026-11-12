"use client";

import { useSession } from "next-auth/react";
import {
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function GuruPage() {
  const { data: session } = useSession();

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
            3
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
            12
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
            8
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
            5
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
          {[
            {
              className: "XII PPLG 1",
              subject: "Pemrograman Web",
              students: 32,
            },
            {
              className: "XII PPLG 2",
              subject: "Pemrograman Web",
              students: 30,
            },
            {
              className: "XI PPLG 1",
              subject: "Basis Data",
              students: 28,
            },
          ].map((item) => (
            <div
              key={`${item.className}-${item.subject}`}
              className="flex items-center justify-between rounded-xl border border-[#292B30] bg-[#111214] px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-[#F2F0EA]">
                  {item.className}
                </p>

                <p className="mt-1 text-xs text-[#6F7072]">
                  {item.subject} · {item.students} siswa
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 text-sm text-[#A4A3A0] transition hover:text-[#F2F0EA]"
              >
                Lihat
                <ArrowUpRight size={15} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}