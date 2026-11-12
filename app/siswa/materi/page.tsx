"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Material {
  _id: string;
  title: string;
  description: string;
  content: string;

  teacherId: {
    _id: string;
    userId: {
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
}

export default function MateriPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    try {
      setLoading(true);

      const response = await fetch("/api/materials");
      const result = await response.json();

      if (result.success) {
        setMaterials(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil materi:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMaterials = materials.filter((material) => {
    const keyword = search.toLowerCase();

    return (
      material.title.toLowerCase().includes(keyword) ||
      material.subjectId.name.toLowerCase().includes(keyword) ||
      material.teacherId.userId.name.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#6F7072]">
          Learning
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
          Materi
        </h1>

        <p className="mt-2 text-sm text-[#6F7072]">
          Pelajari materi pembelajaran dari guru dan mata pelajaranmu.
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex items-center">
        <div className="relative w-full max-w-md">
          <Search
            size={15}
            strokeWidth={1.7}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7072]"
          />

          <input
            type="text"
            placeholder="Cari materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-[#202226] bg-[#111214] py-2.5 pl-9 pr-3 text-xs text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#292B30]"
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="rounded-lg border border-[#202226] bg-[#111214] p-10 text-center">
          <p className="text-xs text-[#6F7072]">
            Memuat materi...
          </p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="rounded-lg border border-[#202226] bg-[#111214] p-10 text-center">
          <BookOpen
            size={22}
            strokeWidth={1.5}
            className="mx-auto text-[#6F7072]"
          />

          <p className="mt-4 text-sm text-[#F2F0EA]">
            {search
              ? "Materi tidak ditemukan"
              : "Belum ada materi"}
          </p>

          <p className="mt-2 text-xs text-[#6F7072]">
            {search
              ? "Coba gunakan kata kunci lain."
              : "Materi pembelajaran akan muncul di sini."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((material) => (
            <div
              key={material._id}
              className="group flex flex-col rounded-lg border border-[#202226] bg-[#111214] p-5 transition-colors hover:border-[#292B30]"
            >
              {/* ICON + SUBJECT */}
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1C1D20]">
                  <BookOpen
                    size={16}
                    strokeWidth={1.7}
                    className="text-[#F2F0EA]"
                  />
                </div>

                <span className="rounded-md bg-[#1C1D20] px-2 py-1 text-[9px] font-medium uppercase tracking-wide text-[#A4A3A0]">
                  {material.subjectId.code}
                </span>
              </div>

              {/* TITLE */}
              <div className="mt-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#6F7072]">
                  {material.subjectId.name}
                </p>

                <h2 className="mt-2 text-base font-medium text-[#F2F0EA]">
                  {material.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6F7072]">
                  {material.description || "Tidak ada deskripsi materi."}
                </p>
              </div>

              {/* FOOTER */}
              <div className="mt-auto pt-6">
                <div className="mb-4 flex items-center justify-between border-t border-[#202226] pt-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-[#6F7072]">
                      Guru
                    </p>

                    <p className="mt-1 text-xs text-[#A4A3A0]">
                      {material.teacherId.userId.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.1em] text-[#6F7072]">
                      Kelas
                    </p>

                    <p className="mt-1 text-xs text-[#A4A3A0]">
                      {material.classId.name}
                    </p>
                  </div>
                </div>

                <Link
                href={`/siswa/materi/${material._id}`}
                className="flex w-full items-center justify-between rounded-md border border-[#292B30] px-3 py-2 text-xs font-medium text-[#F2F0EA] transition-colors hover:bg-[#161719]"
                >
                <span>Pelajari Materi</span>

                <ArrowRight
                    size={14}
                    strokeWidth={1.7}
                    className="transition-transform group-hover:translate-x-0.5"
                />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}