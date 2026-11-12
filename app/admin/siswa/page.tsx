"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

type Student = {
  _id: string;
  nis: string;
  major: string;
  enrollmentYear: number;
  status: "aktif" | "nonaktif";
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: "aktif" | "nonaktif";
  };
  classId: {
    _id: string;
    name: string;
    grade: string;
    major: string;
    academicYear: string;
    status: "aktif" | "nonaktif";
  };
};

type Class = {
  _id: string;
  name: string;
  grade: string;
  major: string;
  academicYear: string;
  status: "aktif" | "nonaktif";
};

export default function SiswaPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nis: "",
    classId: "",
    major: "",
    enrollmentYear: new Date().getFullYear(),
    status: "aktif",
  });

  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/students");
      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
      }
    } catch (error) {
      console.error("Fetch students error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes");
      const result = await response.json();

      if (result.success) {
        setClasses(result.data);
      }
    } catch (error) {
      console.error("Fetch classes error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      nis: "",
      classId: "",
      major: "",
      enrollmentYear: new Date().getFullYear(),
      status: "aktif",
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
  setEditingStudent(student);

  setFormData({
    name: student.userId.name,
    email: student.userId.email,
    password: "",
    nis: student.nis,
    classId: student.classId._id,
    major: student.major,
    enrollmentYear: student.enrollmentYear,
    status: student.status,
  });

  setIsModalOpen(true);
};

  const openDeleteModal = (student: Student) => {
    setDeletingStudent(student);
  };

    const handleDelete = async () => {
    if (!deletingStudent) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/students/${deletingStudent._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Gagal menghapus siswa");
        return;
      }

      alert("Siswa berhasil dihapus");

      setDeletingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Delete student error:", error);
      alert("Terjadi kesalahan saat menghapus siswa");
    } finally {
      setDeleting(false);
    }
  };            

  const closeModal = () => {
    if (submitting) return;

    setIsModalOpen(false);
    setEditingStudent(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const url = editingStudent
        ? `/api/students/${editingStudent._id}`
        : "/api/students";

      const method = editingStudent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.message ||
            `Gagal ${editingStudent ? "memperbarui" : "menambahkan"} siswa`
        );
        return;
      }

      alert(
        editingStudent
          ? "Siswa berhasil diperbarui"
          : "Siswa berhasil ditambahkan"
      );

      setIsModalOpen(false);
      setEditingStudent(null);
      resetForm();

      fetchStudents();
    } catch (error) {
      console.error("Submit student error:", error);
      alert("Terjadi kesalahan saat menyimpan data siswa");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();

    return (
      student.userId.name.toLowerCase().includes(keyword) ||
      student.userId.email.toLowerCase().includes(keyword) ||
      student.nis.toLowerCase().includes(keyword) ||
      student.classId.name.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen px-8 py-7">
      {/* HEADER */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="mb-2 text-[10px] font-medium tracking-[0.18em] text-[#6F7072]">
            MANAGEMENT
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
            Kelola Siswa
          </h1>

          <p className="mt-1 text-sm text-[#6F7072]">
            Kelola data akun dan informasi akademik siswa.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-md bg-[#F2F0EA] px-4 py-2.5 text-xs font-medium text-[#0B0C0E] transition hover:bg-white"
        >
          <Plus size={15} />
          Tambah Siswa
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="mb-5 flex items-center justify-between">
        <div className="relative w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7072]"
          />

          <input
            type="text"
            placeholder="Cari siswa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-[#292B30] bg-[#111214] py-2.5 pl-9 pr-3 text-xs text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F2F0EA]"
          />
        </div>

        <p className="text-xs text-[#6F7072]">
          {filteredStudents.length} siswa
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-[#202226] bg-[#111214]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#202226] text-left">
              <th className="px-5 py-4 text-[10px] font-medium tracking-wider text-[#6F7072]">
                SISWA
              </th>

              <th className="px-5 py-4 text-[10px] font-medium tracking-wider text-[#6F7072]">
                NIS
              </th>

              <th className="px-5 py-4 text-[10px] font-medium tracking-wider text-[#6F7072]">
                KELAS
              </th>

              <th className="px-5 py-4 text-[10px] font-medium tracking-wider text-[#6F7072]">
                JURUSAN
              </th>

              <th className="px-5 py-4 text-[10px] font-medium tracking-wider text-[#6F7072]">
                TAHUN MASUK
              </th>

              <th className="px-5 py-4 text-[10px] font-medium tracking-wider text-[#6F7072]">
                STATUS
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-medium tracking-wider text-[#6F7072]">
                AKSI
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-xs text-[#6F7072]"
                >
                  Memuat data siswa...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-xs text-[#6F7072]"
                >
                  Belum ada data siswa.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-[#202226] last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#F2F0EA]">
                        {student.userId.name}
                      </p>

                      <p className="mt-0.5 text-xs text-[#6F7072]">
                        {student.userId.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-[#A4A3A0]">
                    {student.nis}
                  </td>

                  <td className="px-5 py-4 text-xs text-[#A4A3A0]">
                    {student.classId.name}
                  </td>

                  <td className="px-5 py-4 text-xs text-[#A4A3A0]">
                    {student.major}
                  </td>

                  <td className="px-5 py-4 text-xs text-[#A4A3A0]">
                    {student.enrollmentYear}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        student.status === "aktif"
                          ? "bg-[#1C1D20] text-[#F2F0EA]"
                          : "bg-[#1C1D20] text-[#6F7072]"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(student)}
                        className="rounded-md p-2 text-[#6F7072] transition hover:bg-[#1C1D20] hover:text-[#F2F0EA]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => openDeleteModal(student)}
                        className="rounded-md p-2 text-[#6F7072] transition hover:bg-[#1C1D20] hover:text-[#F2F0EA]"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-lg border border-[#292B30] bg-[#111214] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#202226] px-6 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#F2F0EA]">
                  {editingStudent ? "Edit Siswa" : "Tambah Siswa"}
                </h2>

                <p className="mt-1 text-xs text-[#6F7072]">
                  {editingStudent
                    ? "Perbarui data akun dan informasi akademik siswa."
                    : "Tambahkan akun dan data akademik siswa."}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-md p-1.5 text-[#6F7072] transition hover:bg-[#1C1D20] hover:text-[#F2F0EA]"
              >
                <X size={16} />
              </button>
            </div>

            {/* FORM */}  
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {/* NAMA */}
                <div className="col-span-2">
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Nama Siswa
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Contoh: Budi Siswa"
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F2F0EA]"
                  />
                </div>

                {/* NIS */}
                <div>
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    NIS
                  </label>

                  <input
                    type="text"
                    value={formData.nis}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nis: e.target.value,
                      })
                    }
                    placeholder="Nomor Induk Siswa"
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F2F0EA]"
                  />
                </div>

                {/* TAHUN MASUK */}
                <div>
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Tahun Masuk
                  </label>

                  <input
                    type="number"
                    value={formData.enrollmentYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enrollmentYear: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#F2F0EA] outline-none focus:border-[#F2F0EA]"
                  />
                </div>

                {/* EMAIL */}
                <div className="col-span-2">
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    placeholder="siswa@lms.com"
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F2F0EA]"
                  />
                </div>

                {/* PASSWORD */}
                <div className="col-span-2">
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Password
                  </label>

                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder={
                      editingStudent
                        ? "Kosongkan jika tidak ingin mengubah password"
                        : "Password akun siswa"
                    }
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F2F0EA]"
                  />
                </div>

                {/* KELAS */}
                <div>
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Kelas
                  </label>

                  <select
                    value={formData.classId}
                    onChange={(e) => {
                      const selectedClass = classes.find(
                        (item) => item._id === e.target.value
                      );

                      setFormData({
                        ...formData,
                        classId: e.target.value,
                        major: selectedClass?.major || "",
                      });
                    }}
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#F2F0EA] outline-none focus:border-[#F2F0EA]"
                  >
                    <option value="">Pilih kelas</option>

                    {classes
                      .filter((item) => item.status === "aktif")
                      .map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* JURUSAN */}
                <div>
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Jurusan
                  </label>

                  <input
                    type="text"
                    value={formData.major}
                    readOnly
                    placeholder="Otomatis dari kelas"
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#A4A3A0] outline-none"
                  />
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <label className="mb-2 block text-xs text-[#A4A3A0]">
                    Status
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-[#292B30] bg-[#161719] px-3 py-2.5 text-xs text-[#F2F0EA] outline-none focus:border-[#F2F0EA]"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex justify-end gap-2 border-t border-[#202226] pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-md border border-[#292B30] px-4 py-2.5 text-xs text-[#A4A3A0] transition hover:bg-[#1C1D20] hover:text-[#F2F0EA] disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-[#F2F0EA] px-4 py-2.5 text-xs font-medium text-[#0B0C0E] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Siswa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          {/* DELETE CONFIRMATION MODAL */}
          {deletingStudent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-sm rounded-lg border border-[#292B30] bg-[#111214] shadow-2xl">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-[#F2F0EA]">
                Hapus Siswa
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#6F7072]">
                Apakah kamu yakin ingin menghapus siswa{" "}
                <span className="font-medium text-[#F2F0EA]">
                  {deletingStudent.userId.name}
                </span>
                ?
              </p>

              <p className="mt-2 text-[11px] leading-5 text-[#6F7072]">
                Data akun dan data akademik siswa juga akan dihapus.
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#202226] pt-4">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                disabled={deleting}
                className="rounded-md border border-[#292B30] px-4 py-2.5 text-xs text-[#A4A3A0] transition hover:bg-[#1C1D20] hover:text-[#F2F0EA] disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md bg-[#F2F0EA] px-4 py-2.5 text-xs font-medium text-[#0B0C0E] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "Hapus Siswa"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}