"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardList,
  FileCheck,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

const menuGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Workspace",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        label: "Guru",
        href: "/admin/guru",
        icon: Users,
      },
      {
        label: "Siswa",
        href: "/admin/siswa",
        icon: GraduationCap,
      },
      {
        label: "Kelas",
        href: "/admin/kelas",
        icon: School,
      },
    ],
  },
  {
    label: "ACADEMIC",
    items: [
      {
        label: "Mata Pelajaran",
        href: "/admin/mata-pelajaran",
        icon: BookOpen,
      },
      {
        label: "Kurikulum",
        href: "/admin/kurikulum",
        icon: FileText,
      },
    ],
  },
  {
    label: "LEARNING",
    items: [
      {
        label: "Materi",
        href: "/admin/materi",
        icon: BookOpen,
      },
      {
        label: "Tugas",
        href: "/admin/tugas",
        icon: ClipboardList,
      },
      {
        label: "Assessment",
        href: "/admin/assessment",
        icon: FileCheck,
      },
    ],
  },
  {
    label: "EVALUATION",
    items: [
      {
        label: "Penilaian",
        href: "/admin/penilaian",
        icon: BarChart3,
      },
      {
        label: "Laporan",
        href: "/admin/laporan",
        icon: FileText,
      },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-[#202226] bg-[#0B0C0E]">
      <div className="flex h-full flex-col px-4 py-5">

        {/* Brand */}
        <div className="mb-8 px-2">
          <h1 className="text-sm font-bold tracking-wide text-[#F2F0EA]">
            ARUNIKA
          </h1>

          <p className="mt-1 text-[8px] tracking-[0.15em] text-[#6F7072]">
            INSTITUTIONAL PORTAL
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2 text-[9px] font-medium tracking-[0.12em] text-[#6F7072]">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-2 py-2 text-xs transition-colors ${
                        item.href === "/admin"
                          ? "bg-[#161719] text-[#F2F0EA]"
                          : "text-[#A4A3A0] hover:bg-[#161719] hover:text-[#F2F0EA]"
                      }`}
                    >
                      <Icon size={14} strokeWidth={1.7} />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </div>
    </aside>
  );
}