"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Users,
} from "lucide-react";

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

interface SchoolClass {
  _id: string;
  name: string;
  grade: "X" | "XI" | "XII";
  major: string;
  academicYear: string;
  homeroomTeacherId:
    | {
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
    | null;
  status: "aktif" | "nonaktif";
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  grade: "X" | "XI" | "XII";
  major: string;
  academicYear: string;
  homeroomTeacherId: string;
  status: "aktif" | "nonaktif";
}

const initialFormData: FormData = {
  name: "",
  grade: "X",
  major: "PPLG",
  academicYear: "2026/2027",
  homeroomTeacherId: "",
  status: "aktif",
};

export default function KelasPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  async function fetchClasses() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/classes");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data kelas");
      }

      setClasses(result.data);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data kelas"
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeachers() {
    try {
      const response = await fetch("/api/teachers");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data guru");
      }

      setTeachers(result.data);
    } catch (error) {
      console.error(error);
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

  function openAddModal() {
    setEditingClass(null);
    setFormData(initialFormData);
    setError("");
    setIsModalOpen(true);
  }

  function openEditModal(item: SchoolClass) {
    setEditingClass(item);

    setFormData({
      name: item.name,
      grade: item.grade,
      major: item.major,
      academicYear: item.academicYear,
      homeroomTeacherId: item.homeroomTeacherId?._id || "",
      status: item.status,
    });

    setError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;

    setIsModalOpen(false);
    setEditingClass(null);
    setFormData(initialFormData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const isEditing = Boolean(editingClass);

      const url = isEditing
        ? `/api/classes/${editingClass?._id}`
        : "/api/classes";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          homeroomTeacherId:
            formData.homeroomTeacherId || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Gagal memperbarui kelas"
              : "Gagal menambahkan kelas")
        );
      }

      await fetchClasses();

      closeModal();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus kelas ini?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);
      setError("");

      const response = await fetch(`/api/classes/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menghapus kelas"
        );
      }

      await fetchClasses();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus kelas"
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  const filteredClasses = classes.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(keyword) ||
      item.major.toLowerCase().includes(keyword) ||
      item.grade.toLowerCase().includes(keyword) ||
      item.academicYear.toLowerCase().includes(keyword) ||
      item.homeroomTeacherId?.userId.name
        .toLowerCase()
        .includes(keyword)
    );
  });

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
              Kelola Kelas
            </h1>

            <p className="mt-2 text-xs text-[#6F7072]">
              Kelola data kelas, tingkat, jurusan, dan wali kelas.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#FFB11B]"
          >
            <Plus size={18} />
            Tambah Kelas
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
            placeholder="Cari kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#292B30] bg-[#111214] py-2.5 pl-9 pr-4 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
          />
        </div>

        <div className="text-xs text-[#6F7072]">
          {filteredClasses.length} kelas
        </div>
      </section>

      {/* ERROR */}
      {error && !isModalOpen && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* TABLE */}
      <section className="overflow-hidden rounded-xl border border-[#292B30] bg-[#111214]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-[#292B30]">
              <tr className="text-[11px] uppercase tracking-wider text-[#6F7072]">
                <th className="px-5 py-4 font-medium">
                  Kelas
                </th>

                <th className="px-5 py-4 font-medium">
                  Tingkat
                </th>

                <th className="px-5 py-4 font-medium">
                  Jurusan
                </th>

                <th className="px-5 py-4 font-medium">
                  Tahun Ajaran
                </th>

                <th className="px-5 py-4 font-medium">
                  Wali Kelas
                </th>

                <th className="px-5 py-4 font-medium">
                  Status
                </th>

                <th className="px-5 py-4 text-right font-medium">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-sm text-[#6F7072]"
                  >
                    Memuat data kelas...
                  </td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#292B30] bg-[#161719]">
                        <Users
                          size={20}
                          className="text-[#6F7072]"
                        />
                      </div>

                      <p className="text-sm font-medium text-[#F2F0EA]">
                        Belum ada data kelas
                      </p>

                      <p className="mt-1 text-xs text-[#6F7072]">
                        Tambahkan kelas pertama untuk mulai
                        mengelola data akademik.
                      </p>

                      <button
                        onClick={openAddModal}
                        className="mt-4 flex items-center gap-2 rounded-lg border border-[#292B30] px-3 py-2 text-xs text-[#F2F0EA] transition hover:bg-[#161719]"
                      >
                        <Plus size={14} />
                        Tambah Kelas
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClasses.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-[#202226] last:border-b-0 hover:bg-[#161719]/60"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#F2F0EA]">
                        {item.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#A4A3A0]">
                      {item.grade}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#A4A3A0]">
                      {item.major}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#A4A3A0]">
                      {item.academicYear}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#F2F0EA]">
                        {item.homeroomTeacherId?.userId.name ||
                          "Belum ditentukan"}
                      </p>

                      {item.homeroomTeacherId && (
                        <p className="mt-0.5 text-xs text-[#6F7072]">
                          NIP {item.homeroomTeacherId.nip}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          item.status === "aktif"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-[#292B30] text-[#A4A3A0]"
                        }`}
                      >
                        {item.status === "aktif"
                          ? "Aktif"
                          : "Nonaktif"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit"
                          className="rounded-lg p-2 text-[#6F7072] transition hover:bg-[#292B30] hover:text-[#F2F0EA]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          disabled={deleteLoading === item._id}
                          title="Hapus"
                          className="rounded-lg p-2 text-[#6F7072] transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          title="Lainnya"
                          className="rounded-lg p-2 text-[#6F7072] transition hover:bg-[#292B30] hover:text-[#F2F0EA]"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#292B30] bg-[#111214] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#292B30] px-6 py-5">
              <div>
                <h2 className="text-base font-medium text-[#F2F0EA]">
                  {editingClass
                    ? "Edit Kelas"
                    : "Tambah Kelas"}
                </h2>

                <p className="mt-1 text-xs text-[#6F7072]">
                  {editingClass
                    ? "Perbarui informasi kelas."
                    : "Tambahkan kelas baru ke sistem."}
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg p-2 text-[#6F7072] transition hover:bg-[#292B30] hover:text-[#F2F0EA]"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* NAMA KELAS */}
              <div>
                <label className="mb-2 block text-xs text-[#A4A3A0]">
                  Nama Kelas
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: XII PPLG 1"
                  required
                  className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                />
              </div>

              {/* TINGKAT + JURUSAN */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Tingkat
                  </label>

                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                  >
                    <option value="X">X</option>
                    <option value="XI">XI</option>
                    <option value="XII">XII</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Jurusan
                  </label>

                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    placeholder="Contoh: PPLG"
                    required
                    className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              {/* TAHUN AJARAN */}
              <div>
                <label className="mb-2 block text-xs text-[#A4A3A0]">
                  Tahun Ajaran
                </label>

                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="Contoh: 2026/2027"
                  required
                  className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                />
              </div>

              {/* WALI KELAS */}
              <div>
                <label className="mb-2 block text-xs text-[#A4A3A0]">
                  Wali Kelas
                </label>

                <select
                  name="homeroomTeacherId"
                  value={formData.homeroomTeacherId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                >
                  <option value="">
                    Belum ditentukan
                  </option>

                  {teachers
                    .filter(
                      (teacher) =>
                        teacher.status === "aktif" &&
                        teacher.userId?.status === "aktif"
                    )
                    .map((teacher) => (
                      <option
                        key={teacher._id}
                        value={teacher._id}
                      >
                        {teacher.userId.name} — {teacher.nip}
                      </option>
                    ))}
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-xs text-[#A4A3A0]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">
                    Nonaktif
                  </option>
                </select>
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-3 border-t border-[#292B30] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-lg border border-[#292B30] px-4 py-2.5 text-sm text-[#A4A3A0] transition hover:bg-[#161719] hover:text-[#F2F0EA]"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#FFB11B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Menyimpan..."
                    : editingClass
                    ? "Simpan Perubahan"
                    : "Tambah Kelas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}