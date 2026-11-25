"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, Plus, Search } from "lucide-react";

import AddMaterialModal from "@/components/guru/materi/add-material-modal";

interface Material {
  _id: string;
  title: string;
  description?: string;
  content: string;
  teacherId: {
    _id: string;
    userId: {
      _id: string;
      name: string;
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
  createdAt: string;
}

export default function GuruMateriPage() {
  const { data: session } = useSession();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Mengambil materi milik guru yang sedang login
  async function fetchMaterials() {
    try {
      const response = await fetch("/api/materials");
      const result = await response.json();

      if (!result.success) {
        throw new Error("Gagal mengambil data materi");
      }

      const userId = session?.user?.id;

      const myMaterials = result.data.filter(
        (material: Material) =>
          material.teacherId?.userId?._id === userId
      );

      setMaterials(myMaterials);
    } catch (error) {
      console.error("Fetch Materials Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchMaterials();
    }
  }, [session?.user?.id]);

  // Filter materi berdasarkan pencarian
  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm text-[#6F7072]">
            Teaching Workspace
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
            Materi Pembelajaran
          </h1>

          <p className="mt-2 text-sm text-[#A4A3A0]">
            Kelola dan bagikan materi pembelajaran kepada siswa.
          </p>
        </div>

        {/* Tombol Tambah Materi */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#FFB11B]"
        >
          <Plus size={17} />
          Tambah Materi
        </button>
      </div>

      {/* Search dan jumlah materi */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7072]"
          />

          <input
            type="text"
            placeholder="Cari materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#292B30] bg-[#111214] py-2.5 pl-10 pr-4 text-sm text-[#F2F0EA] outline-none transition focus:border-[#F59E0B] placeholder:text-[#6F7072]"
          />
        </div>

        <p className="text-sm text-[#A4A3A0]">
          Total{" "}
          <span className="font-medium text-[#F2F0EA]">
            {materials.length}
          </span>{" "}
          materi
        </p>
      </div>

      {/* Daftar Materi */}
      {loading ? (
        <div className="rounded-xl border border-[#292B30] bg-[#111214] p-8 text-center">
          <p className="text-sm text-[#A4A3A0]">
            Memuat materi...
          </p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="rounded-xl border border-[#292B30] bg-[#111214] p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C1D20]">
            <BookOpen
              size={22}
              className="text-[#6F7072]"
            />
          </div>

          <h3 className="text-sm font-medium text-[#F2F0EA]">
            {search
              ? "Materi tidak ditemukan"
              : "Belum ada materi"}
          </h3>

          <p className="mt-2 text-sm text-[#6F7072]">
            {search
              ? "Coba gunakan kata kunci pencarian lain."
              : "Materi pembelajaran yang kamu buat akan muncul di sini."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMaterials.map((material) => (
            <div
              key={material._id}
              className="rounded-xl border border-[#292B30] bg-[#111214] p-5 transition hover:border-[#3A3C42]"
            >
              {/* Icon */}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C1D20]">
                <BookOpen
                  size={19}
                  className="text-[#F59E0B]"
                />
              </div>

              {/* Judul */}
              <h3 className="text-base font-medium text-[#F2F0EA]">
                {material.title}
              </h3>

              {/* Deskripsi */}
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#A4A3A0]">
                {material.description || "Tidak ada deskripsi."}
              </p>

              {/* Informasi Kelas */}
              <div className="mt-4 space-y-2 border-t border-[#292B30] pt-4">
                <p className="text-xs text-[#A4A3A0]">
                  Mata Pelajaran
                </p>

                <p className="text-sm text-[#F2F0EA]">
                  {material.subjectId?.name || "-"}
                </p>

                <p className="text-xs text-[#A4A3A0]">
                  Kelas
                </p>

                <p className="text-sm text-[#F2F0EA]">
                  {material.classId?.name || "-"}
                </p>  
              </div>

              {/* Tanggal */}
              <p className="mt-4 text-xs text-[#6F7072]">
                Dibuat pada{" "}
                {new Date(material.createdAt).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Materi */}
      {showModal && (
        <AddMaterialModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchMaterials();
          }}
        />
      )}
    </div>
  );
} 