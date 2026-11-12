"use client";

import { useEffect, useState } from "react";

export default function TeachingAssignmentPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    teacherId: "",
    subjectId: "",
    classId: "",
    academicYear: "2026/2027",
    status: "aktif",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

    async function fetchAllData() {
    try {
      setLoading(true);

      const [
        assignmentsResponse,
        teachersResponse,
        subjectsResponse,
        classesResponse,
      ] = await Promise.all([
        fetch("/api/teaching-assignments"),
        fetch("/api/teachers"),
        fetch("/api/subjects"),
        fetch("/api/classes"),
      ]);

      const assignmentsResult = await assignmentsResponse.json();
      const teachersResult = await teachersResponse.json();
      const subjectsResult = await subjectsResponse.json();
      const classesResult = await classesResponse.json();

      if (assignmentsResult.success) {
        setAssignments(assignmentsResult.data);
      }

      if (teachersResult.success) {
        setTeachers(teachersResult.data);
      }

      if (subjectsResult.success) {
        setSubjects(subjectsResult.data);
      }

      if (classesResult.success) {
        setClasses(classesResult.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function openAddModal() {
    setEditingAssignment(null);

    setFormData({
      teacherId: "",
      subjectId: "",
      classId: "",
      academicYear: "2026/2027",
      status: "aktif",
    });

    setIsModalOpen(true);
  }

  function openEditModal(assignment: any) {
  setEditingAssignment(assignment);

  setFormData({
    teacherId: assignment.teacherId?._id || "",
    subjectId: assignment.subjectId?._id || "",
    classId: assignment.classId?._id || "",
    academicYear: assignment.academicYear || "",
    status: assignment.status || "aktif",
  });

  setIsModalOpen(true);
  }

  function openDeleteModal(assignment: any) {
  setDeletingAssignment(assignment);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  if (
    !formData.teacherId ||
    !formData.subjectId ||
    !formData.classId ||
    !formData.academicYear
  ) {
    alert("Guru, mata pelajaran, kelas, dan tahun ajaran wajib diisi.");
    return;
  }

  try {
    setSubmitting(true);

    const url = editingAssignment
      ? `/api/teaching-assignments/${editingAssignment._id}`
      : "/api/teaching-assignments";

    const method = editingAssignment ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Gagal menyimpan teaching assignment.");
      return;
    }

    alert(
      editingAssignment
        ? "Teaching assignment berhasil diperbarui."
        : "Teaching assignment berhasil ditambahkan."
    );

    setIsModalOpen(false);
    setEditingAssignment(null);

    await fetchAllData();
  } catch (error) {
    console.error("Gagal menyimpan teaching assignment:", error);
    alert("Terjadi kesalahan saat menyimpan teaching assignment.");
  } finally {
    setSubmitting(false);
  }
}

  async function handleDelete() {
    if (!deletingAssignment) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/teaching-assignments/${deletingAssignment._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Gagal menghapus teaching assignment.");
        return;
      }

      alert("Teaching assignment berhasil dihapus.");

      setDeletingAssignment(null);
      await fetchAllData();
    } catch (error) {
      console.error("Gagal menghapus teaching assignment:", error);
      alert("Terjadi kesalahan saat menghapus teaching assignment.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen px-8 py-8">
      {/* HEADER */}
      <section className="mb-10">
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#6F7072]">
          Administrator
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#F2F0EA]">
          Teaching Assignment
        </h1>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-[#6F7072]">
          Kelola penugasan guru berdasarkan mata pelajaran dan kelas.
        </p>
      </section>

      {/* TABLE */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#F2F0EA]">
            Daftar Teaching Assignment
          </h2>

          <button
            onClick={openAddModal}
            className="bg-[#F59E0B] px-4 py-2 text-[9px] font-medium text-[#0B0C0E] transition hover:bg-[#FFB11B]"
          >
            + TAMBAH ASSIGNMENT
          </button>
        </div>

        <div className="overflow-hidden border border-[#292B30]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#292B30] bg-[#111214]">
                <th className="px-5 py-4 text-left text-[9px] tracking-[0.08em] text-[#6F7072]">
                  GURU
                </th>

                <th className="px-5 py-4 text-left text-[9px] tracking-[0.08em] text-[#6F7072]">
                  MATA PELAJARAN
                </th>

                <th className="px-5 py-4 text-left text-[9px] tracking-[0.08em] text-[#6F7072]">
                  KELAS
                </th>

                <th className="px-5 py-4 text-left text-[9px] tracking-[0.08em] text-[#6F7072]">
                  TAHUN AJARAN
                </th>

                <th className="px-5 py-4 text-left text-[9px] tracking-[0.08em] text-[#6F7072]">
                  STATUS
                </th>

                <th className="px-5 py-4 text-right text-[9px] tracking-[0.08em] text-[#6F7072]">
                  AKSI
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[10px] text-[#6F7072]"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[10px] text-[#6F7072]"
                  >
                    Belum ada teaching assignment.
                  </td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr
                    key={assignment._id}
                    className="border-b border-[#202226] last:border-b-0"
                  >
                    <td className="px-5 py-4 text-[10px] text-[#F2F0EA]">
                      {assignment.teacherId?.userId?.name || "-"}
                    </td>

                    <td className="px-5 py-4 text-[10px] text-[#F2F0EA]">
                      {assignment.subjectId?.name || "-"}
                    </td>

                    <td className="px-5 py-4 text-[10px] text-[#F2F0EA]">
                      {assignment.classId?.name || "-"}
                    </td>

                    <td className="px-5 py-4 text-[10px] text-[#A4A3A0]">
                      {assignment.academicYear}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-[9px] ${
                          assignment.status === "aktif"
                            ? "text-[#F59E0B]"
                            : "text-[#6F7072]"
                        }`}
                      >
                        {assignment.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => openEditModal(assignment)}
                          className="text-[10px] text-[#A4A3A0] hover:text-[#F2F0EA]"
                        >
                          EDIT
                        </button>

                        <button
                          onClick={() => openDeleteModal(assignment)}
                          className="text-[10px] text-[#A4A3A0] hover:text-red-400"
                        >
                          DELETE
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

      {/* MODAL ADD/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg border border-[#292B30] bg-[#111214]">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#292B30] px-6 py-5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#6F7072]">
                  Administrator
                </p>

                <h2 className="mt-1 text-lg font-medium text-[#F2F0EA]">
                  {editingAssignment
                    ? "Edit Teaching Assignment"
                    : "Tambah Teaching Assignment"}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="text-lg text-[#6F7072] hover:text-[#F2F0EA]"
              >
                ×
              </button>
            </div>

            {/* MODAL FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5 px-6 py-6"
              >
              {/* GURU */}
              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-[0.08em] text-[#6F7072]">
                  Guru
                </label>

                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  className="w-full border border-[#292B30] bg-[#161719] px-3 py-3 text-[10px] text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                >
                  <option value="">Pilih Guru</option>

                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.userId?.name || "-"} — NIP {teacher.nip}
                      </option>
                    ))}
                </select>
              </div>

              {/* MATA PELAJARAN */}
              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-[0.08em] text-[#6F7072]">
                  Mata Pelajaran
                </label>

                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  className="w-full border border-[#292B30] bg-[#161719] px-3 py-3 text-[10px] text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                >
                  <option value="">Pilih Mata Pelajaran</option>

                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name} — {subject.code}
                      </option>
                    ))}
                </select>
              </div>

              {/* KELAS */}
              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-[0.08em] text-[#6F7072]">
                  Kelas
                </label>

                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full border border-[#292B30] bg-[#161719] px-3 py-3 text-[10px] text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                >
                  <option value="">Pilih Kelas</option>

                    {classes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} — {item.academicYear}
                      </option>
                    ))}
                </select>
              </div>

              {/* TAHUN AJARAN */}
              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-[0.08em] text-[#6F7072]">
                  Tahun Ajaran
                </label>

                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  placeholder="Contoh: 2026/2027"
                  className="w-full border border-[#292B30] bg-[#161719] px-3 py-3 text-[10px] text-[#F2F0EA] outline-none placeholder:text-[#6F7072] focus:border-[#F59E0B]"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-[0.08em] text-[#6F7072]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-[#292B30] bg-[#161719] px-3 py-3 text-[10px] text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

               {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 border-t border-[#292B30] px-6 py-4">
              <button
                onClick={closeModal}
                className="border border-[#292B30] px-4 py-2 text-[9px] text-[#A4A3A0] transition hover:border-[#6F7072] hover:text-[#F2F0EA]"
              >
                BATAL
              </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#F59E0B] px-4 py-2 text-[9px] font-medium text-[#0B0C0E] transition hover:bg-[#FFB11B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "MENYIMPAN..." : "SIMPAN"}
                  </button>
            </div>        
            </form>

          </div>
        </div>
      )}
      
      {/* MODAL DELETE */}
            {deletingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-[#292B30] bg-[#161719] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-[#F2F0EA]">
              Hapus Teaching Assignment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#A4A3A0]">
              Apakah kamu yakin ingin menghapus assignment ini? Data yang
              sudah dihapus tidak dapat dikembalikan.
            </p>

            <div className="mt-6 rounded-lg border border-[#292B30] bg-[#111214] p-4">
              <p className="text-sm font-medium text-[#F2F0EA]">
                {deletingAssignment.teacherId?.userId?.name || "-"}
              </p>

              <p className="mt-1 text-xs text-[#6F7072]">
                {deletingAssignment.subjectId?.name || "-"} ·{" "}
                {deletingAssignment.classId?.name || "-"}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAssignment(null)}
                disabled={deleting}
                className="rounded-lg border border-[#292B30] px-4 py-2 text-sm text-[#A4A3A0] transition hover:bg-[#1C1D20] hover:text-[#F2F0EA] disabled:opacity-50"
              >
                BATAL
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                {deleting ? "MENGHAPUS..." : "HAPUS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}