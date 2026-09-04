"use client";

import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";

interface Teacher {
  _id: string;
  nip: string;
  status: "aktif" | "nonaktif";
  userId: {
    _id: string;
    name: string;
    email: string;
    status: "aktif" | "nonaktif";
    role: string;
  };
}

export default function GuruPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      setLoading(true);

      const response = await fetch("/api/teachers");

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data guru");
      }

      setTeachers(result.data);
    } catch (error) {
      console.error(error);

      setError("Gagal mengambil data guru");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-8 py-8">

      {/* HEADER */}
      <section className="mb-8">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#6F7072]">
          Management
        </p>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
              Kelola Guru
            </h1>

            <p className="mt-2 text-xs text-[#6F7072]">
              Kelola data, akses, profil, dan penugasan guru.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="..."
            >
            <Plus size={18} />
            Tambah Guru
            </button>
        </div>
      </section>

      {/* TOOLBAR */}
      <section className="mb-5 flex items-center justify-between">

        <div className="relative w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7072]"
          />

          <input
            type="text"
            placeholder="Cari guru..."
            className="w-full border border-[#292B30] bg-[#111214] py-2.5 pl-9 pr-3 text-[10px] text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
          />
        </div>

        <p className="text-[9px] text-[#6F7072]">
          {teachers.length} GURU TERDAFTAR
        </p>

      </section>

      {/* ERROR */}
      {error && (
        <div className="mb-5 border border-red-900/50 bg-red-950/20 px-4 py-3 text-[10px] text-red-400">
          {error}
        </div>
      )}

      {/* TABLE */}
      <section className="border-y border-[#292B30]">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-[1.5fr_1.3fr_1.3fr_0.8fr_50px] border-b border-[#292B30] px-5 py-3">

          <p className="text-[9px] tracking-[0.08em] text-[#6F7072]">
            NAMA GURU
          </p>

          <p className="text-[9px] tracking-[0.08em] text-[#6F7072]">
            NIP
          </p>

          <p className="text-[9px] tracking-[0.08em] text-[#6F7072]">
            EMAIL
          </p>

          <p className="text-[9px] tracking-[0.08em] text-[#6F7072]">
            STATUS
          </p>

          <p />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="px-5 py-10 text-center text-[10px] text-[#6F7072]">
            Memuat data guru...
          </div>
        )}

        {/* EMPTY */}
        {!loading && teachers.length === 0 && !error && (
          <div className="px-5 py-10 text-center text-[10px] text-[#6F7072]">
            Belum ada data guru.
          </div>
        )}

        {/* DATA */}
        {!loading &&
          teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="grid grid-cols-[1.5fr_1.3fr_1.3fr_0.8fr_50px] items-center border-b border-[#202226] px-5 py-4 last:border-b-0"
            >

              <div>
                <p className="text-[11px] text-[#F2F0EA]">
                  {teacher.userId.name}
                </p>

                <p className="mt-1 text-[8px] text-[#6F7072]">
                  Guru
                </p>
              </div>

              <p className="text-[10px] text-[#A4A3A0]">
                {teacher.nip}
              </p>

              <p className="truncate text-[10px] text-[#A4A3A0]">
                {teacher.userId.email}
              </p>

              <div>
                <span className="border border-[#3B321F] bg-[#211B0E] px-2 py-1 text-[8px] text-[#F59E0B]">
                  {teacher.status}
                </span>
              </div>

              <button className="flex justify-center text-[#6F7072] transition hover:text-[#F2F0EA]">
                <MoreHorizontal size={15} />
              </button>

            </div>
          ))}

      </section>

      {/* FOOTER */}
      {!loading && teachers.length > 0 && (
        <div className="mt-5 flex items-center justify-between">

          <p className="text-[9px] text-[#6F7072]">
            Menampilkan {teachers.length} dari {teachers.length} guru
          </p>

          <div className="flex gap-1">
            <button className="border border-[#292B30] px-3 py-1.5 text-[9px] text-[#6F7072]">
              Sebelumnya
            </button>

            <button className="border border-[#292B30] px-3 py-1.5 text-[9px] text-[#A4A3A0] hover:bg-[#161719]">
              Berikutnya
            </button>
          </div>

        </div>
      )}

    </div>
  );
}