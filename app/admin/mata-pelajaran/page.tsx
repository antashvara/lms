"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";

interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
  status: "aktif" | "nonaktif";
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  code: string;
  description: string;
  status: "aktif" | "nonaktif";
}

const initialFormData: FormData = {
  name: "",
  code: "",
  description: "",
  status: "aktif",
};

export default function MataPelajaranPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/subjects");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal mengambil data mata pelajaran"
        );
      }

      setSubjects(result.data);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data mata pelajaran"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function openAddModal() {
    setEditingSubject(null);
    setFormData(initialFormData);
    setError("");
    setIsModalOpen(true);
  }

  function openEditModal(subject: Subject) {
    setEditingSubject(subject);

    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || "",
      status: subject.status,
    });

    setError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;

    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData(initialFormData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const isEditing = Boolean(editingSubject);

      const url = isEditing
        ? `/api/subjects/${editingSubject?._id}`
        : "/api/subjects";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Gagal memperbarui mata pelajaran"
              : "Gagal menambahkan mata pelajaran")
        );
      }

      await fetchSubjects();

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
      "Yakin ingin menghapus mata pelajaran ini?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(id);
      setError("");

      const response = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal menghapus mata pelajaran"
        );
      }

      await fetchSubjects();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus mata pelajaran"
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  const filteredSubjects = subjects.filter((subject) => {
    const keyword = search.toLowerCase();

    return (
      subject.name.toLowerCase().includes(keyword) ||
      subject.code.toLowerCase().includes(keyword) ||
      subject.description.toLowerCase().includes(keyword)
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
              Kelola Mata Pelajaran
            </h1>

            <p className="mt-2 text-xs text-[#6F7072]">
              Kelola data mata pelajaran yang digunakan dalam sistem LMS.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#FFB11B]"
          >
            <Plus size={18} />
            Tambah Mata Pelajaran
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
            placeholder="Cari mata pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#292B30] bg-[#111214] py-2.5 pl-9 pr-4 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
          />
        </div>

        <div className="text-xs text-[#6F7072]">
          {filteredSubjects.length} mata pelajaran
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
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-[#292B30]">
              <tr className="text-[11px] uppercase tracking-wider text-[#6F7072]">
                <th className="px-5 py-4 font-medium">
                  Mata Pelajaran
                </th>

                <th className="px-5 py-4 font-medium">
                  Kode
                </th>

                <th className="px-5 py-4 font-medium">
                  Deskripsi
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
                    colSpan={5}
                    className="px-5 py-16 text-center text-sm text-[#6F7072]"
                  >
                    Memuat data mata pelajaran...
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#292B30] bg-[#161719]">
                        <BookOpen
                          size={20}
                          className="text-[#6F7072]"
                        />
                      </div>

                      <p className="text-sm font-medium text-[#F2F0EA]">
                        Belum ada data mata pelajaran
                      </p>

                      <p className="mt-1 text-xs text-[#6F7072]">
                        Tambahkan mata pelajaran pertama untuk mulai
                        mengelola data akademik.
                      </p>

                      <button
                        onClick={openAddModal}
                        className="mt-4 flex items-center gap-2 rounded-lg border border-[#292B30] px-3 py-2 text-xs text-[#F2F0EA] transition hover:bg-[#161719]"
                      >
                        <Plus size={14} />
                        Tambah Mata Pelajaran
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject) => (
                  <tr
                    key={subject._id}
                    className="border-b border-[#202226] last:border-b-0 hover:bg-[#161719]/60"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#F2F0EA]">
                        {subject.name}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[#292B30] px-2.5 py-1 text-xs font-medium text-[#F2F0EA]">
                        {subject.code}
                      </span>
                    </td>

                    <td className="max-w-md px-5 py-4 text-sm text-[#A4A3A0]">
                      <p className="truncate">
                        {subject.description || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          subject.status === "aktif"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-[#292B30] text-[#A4A3A0]"
                        }`}
                      >
                        {subject.status === "aktif"
                          ? "Aktif"
                          : "Nonaktif"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(subject)}
                          title="Edit"
                          className="rounded-lg p-2 text-[#6F7072] transition hover:bg-[#292B30] hover:text-[#F2F0EA]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(subject._id)}
                          disabled={deleteLoading === subject._id}
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
                  {editingSubject
                    ? "Edit Mata Pelajaran"
                    : "Tambah Mata Pelajaran"}
                </h2>

                <p className="mt-1 text-xs text-[#6F7072]">
                  {editingSubject
                    ? "Perbarui informasi mata pelajaran."
                    : "Tambahkan mata pelajaran baru ke sistem."}
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

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* NAMA */}
              <div>
                <label className="mb-2 block text-xs text-[#A4A3A0]">
                  Nama Mata Pelajaran
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Pemrograman Web"
                  required
                  className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                />
              </div>

              {/* KODE */}
              <div>
                <label className="mb-2 block text-xs text-[#A4A3A0]">
                  Kode Mata Pelajaran
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Contoh: PWPB"
                  required
                  className="w-full rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm uppercase text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="mb-2 block text-xs text-[#A4A3A0]">
                  Deskripsi
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Deskripsi singkat mata pelajaran..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-[#292B30] bg-[#161719] px-3 py-2.5 text-sm text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                />
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
                  <option value="nonaktif">Nonaktif</option>
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
                    : editingSubject
                    ? "Simpan Perubahan"
                    : "Tambah Mata Pelajaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}