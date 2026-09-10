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
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  nip: "",
  status: "aktif",
});

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

    function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    setSubmitting(true);
    setError("");

    const response = await fetch("/api/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal menambahkan guru");
    }

    await fetchTeachers();

    setIsModalOpen(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      nip: "",
      status: "aktif",
    });
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Gagal menambahkan guru"
    );
  } finally {
    setSubmitting(false);
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
            className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-black"
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

              {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                <div className="w-full max-w-lg rounded-xl border border-[#292B30] bg-[#161719] shadow-2xl">
                
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-[#292B30] px-6 py-5">
                    <div>
                    <h2 className="text-lg font-semibold text-[#F2F0EA]">
                        Tambah Guru
                    </h2>
                    <p className="mt-1 text-sm text-[#6F7072]">
                        Tambahkan data guru baru ke sistem.
                    </p>
                    </div>

                    <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-[#6F7072] transition hover:text-[#F2F0EA]"
                    >
                    ✕
                    </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 px-6 py-6"
                >
                    
                    {/* Nama */}
                    <div>
                    <label className="mb-2 block text-sm text-[#A4A3A0]">
                        Nama Guru
                    </label>

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        placeholder="Masukkan nama guru"
                        className="w-full rounded-lg border border-[#292B30] bg-[#111214] px-4 py-3 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                    />
                    </div>

                    {/* NIP */}
                    <div>
                    <label className="mb-2 block text-sm text-[#A4A3A0]">
                        NIP
                    </label>

                    <input
                      name="nip"
                      type="text"
                      value={formData.nip}
                      onChange={handleChange}
                      placeholder="Masukkan NIP"
                      className="w-full rounded-lg border border-[#292B30] bg-[#111214] px-4 py-3 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                    />
                    </div>

                    {/* Email */}
                    <div>
                    <label className="mb-2 block text-sm text-[#A4A3A0]">
                        Email
                    </label>

                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan email guru"
                        className="w-full rounded-lg border border-[#292B30] bg-[#111214] px-4 py-3 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                    />
                    </div>

                    {/* Password */}
                    <div>
                    <label className="mb-2 block text-sm text-[#A4A3A0]">
                        Password
                    </label>

                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="w-full rounded-lg border border-[#292B30] bg-[#111214] px-4 py-3 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                    />
                    </div>

                    {/* Status */}
                    <div>
                    <label className="mb-2 block text-sm text-[#A4A3A0]">Status</label>

                    <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#292B30] bg-[#111214] px-4 py-3 text-sm text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                    </div>

                    {/* Footer Tombol */}
                <div className="flex justify-end gap-3 border-t border-[#292B30] px-6 py-4">
                    <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-[#292B30] px-4 py-2.5 text-sm font-medium text-[#A4A3A0] transition hover:bg-[#1C1D20] hover:text-[#F2F0EA]"
                    >
                    Batal
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#FFB11B] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Menyimpan..." : "Tambah Guru"}
                    </button>
                </div>

                </form>

                

                </div>
            </div>
            )}

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