"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSession } from "next-auth/react";
import { X, BookOpen, Loader2 } from "lucide-react";
import MaterialUploader from "@/components/upload/material-uploader";

interface TeachingAssignment {
  _id: string;
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
  academicYear: string;
  status: string;
}

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  key: string;
}

interface Attachment {
  name: string;
  url: string;
  type: "pdf" | "ppt" | "pptx" | "doc" | "docx" | "zip" | "other";
  size: string;
}

interface AddMaterialModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMaterialModal({
  onClose,
  onSuccess,
}: AddMaterialModalProps) {
  const { data: session } = useSession();

  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Mengambil teaching assignment milik guru yang login
  useEffect(() => {
    async function fetchAssignments() {
      try {
        const response = await fetch("/api/teaching-assignments");
        const result = await response.json();

        if (!result.success) {
          throw new Error("Gagal mengambil data pengampu");
        }

        const userId = session?.user?.id;

        const myAssignments = result.data.filter(
          (assignment: TeachingAssignment) =>
            assignment.teacherId?.userId?._id === userId &&
            assignment.status === "aktif"
        );

        setAssignments(myAssignments);
      } catch (error) {
        console.error("Fetch Teaching Assignments Error:", error);
        setError("Gagal mengambil data kelas dan mata pelajaran.");
      } finally {
        setLoadingAssignments(false);
      }
    }

    if (session?.user?.id) {
      fetchAssignments();
    }
  }, [session?.user?.id]);

  // Mengubah file UploadThing menjadi format attachment Material
  function handleUploadComplete(files: UploadedFile[]) {
    const formattedAttachments: Attachment[] = files.map((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();

      let type: Attachment["type"] = "other";

      if (extension === "pdf") type = "pdf";
      else if (extension === "ppt") type = "ppt";
      else if (extension === "pptx") type = "pptx";
      else if (extension === "doc") type = "doc";
      else if (extension === "docx") type = "docx";
      else if (extension === "zip") type = "zip";

      return {
        name: file.name,
        url: file.url,
        type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      };
    });

    setAttachments(formattedAttachments);
  }

  // Submit materi
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!selectedAssignment) {
      setError("Pilih kelas dan mata pelajaran terlebih dahulu.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Judul dan isi materi wajib diisi.");
      return;
    }

    const assignment = assignments.find(
      (item) => item._id === selectedAssignment
    );

    if (!assignment) {
      setError("Teaching assignment tidak ditemukan.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),

          teacherId: assignment.teacherId._id,
          subjectId: assignment.subjectId._id,
          classId: assignment.classId._id,

          attachments,
          videoUrl: "",
          resourceLinks: [],
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal membuat materi.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Create Material Error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat materi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#292B30] bg-[#111214] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#292B30] bg-[#111214] px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[#F59E0B]" />

              <h2 className="text-lg font-semibold text-[#F2F0EA]">
                Tambah Materi
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#A4A3A0]">
              Bagikan materi pembelajaran kepada siswa.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-[#A4A3A0] transition hover:bg-[#1C1D20] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Teaching Assignment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#F2F0EA]">
              Kelas & Mata Pelajaran
            </label>

            {loadingAssignments ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#292B30] bg-[#18191C] px-4 py-3 text-sm text-[#A4A3A0]">
                <Loader2 size={16} className="animate-spin" />
                Memuat data pengampu...
              </div>
            ) : assignments.length === 0 ? (
              <div className="rounded-lg border border-[#292B30] bg-[#18191C] p-4 text-sm text-[#A4A3A0]">
                Kamu belum memiliki teaching assignment aktif.
              </div>
            ) : (
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                required
                className="w-full rounded-lg border border-[#292B30] bg-[#18191C] px-4 py-3 text-sm text-[#F2F0EA] outline-none focus:border-[#F59E0B]"
              >
                <option value="">Pilih kelas dan mata pelajaran</option>

                {assignments.map((assignment) => (
                  <option key={assignment._id} value={assignment._id}>
                    {assignment.subjectId.name} — {assignment.classId.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#F2F0EA]">
              Judul Materi
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pengenalan HTML dan CSS"
              required
              className="w-full rounded-lg border border-[#292B30] bg-[#18191C] px-4 py-3 text-sm text-[#F2F0EA] outline-none transition focus:border-[#F59E0B] placeholder:text-[#6F7072]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#F2F0EA]">
              Deskripsi
              <span className="ml-2 text-xs font-normal text-[#6F7072]">
                (Opsional)
              </span>
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat mengenai materi..."
              rows={3}
              className="w-full resize-none rounded-lg border border-[#292B30] bg-[#18191C] px-4 py-3 text-sm text-[#F2F0EA] outline-none transition focus:border-[#F59E0B] placeholder:text-[#6F7072]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#F2F0EA]">
              Isi Materi
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi materi pembelajaran..."
              rows={5}
              required
              className="w-full resize-y rounded-lg border border-[#292B30] bg-[#18191C] px-4 py-3 text-sm leading-6 text-[#F2F0EA] outline-none transition focus:border-[#F59E0B] placeholder:text-[#6F7072]"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#F2F0EA]">
              File Materi
            </label>

            <MaterialUploader onUploadComplete={handleUploadComplete} />

            <p className="mt-2 text-xs text-[#6F7072]">
              File PDF maksimal 8 MB, maksimal 5 file.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-[#292B30] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-[#292B30] px-4 py-2.5 text-sm font-medium text-[#A4A3A0] transition hover:bg-[#1C1D20] hover:text-white disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting || loadingAssignments || assignments.length === 0}
              className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#FFB11B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}

              {submitting ? "Menyimpan..." : "Simpan Materi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}