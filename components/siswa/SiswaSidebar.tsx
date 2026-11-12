"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileCheck,
  BarChart3,
  TrendingUp,
  User,
  LogOut,
} from "lucide-react";

const menuGroups = [
  {
    label: "MY LEARNING SPACE",
    items: [
      {
        label: "Overview",
        href: "/siswa",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "LEARNING",
    items: [
      {
        label: "Materi",
        href: "/siswa/materi",
        icon: BookOpen,
      },
      {
        label: "Tugas",
        href: "/siswa/tugas",
        icon: ClipboardList,
      },
      {
        label: "Assessment",
        href: "/siswa/assessment",
        icon: FileCheck,
      },
    ],
  },
  {
    label: "PROGRESS",
    items: [
      {
        label: "Penilaian",
        href: "/siswa/penilaian",
        icon: BarChart3,
      },
      {
        label: "Progress",
        href: "/siswa/progress",
        icon: TrendingUp,
      },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      {
        label: "Profil",
        href: "/siswa/profil",
        icon: User,
      },
    ],
  },
];

export default function SiswaSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-[#202226] bg-[#0B0C0E]">
      <div className="flex h-full flex-col px-4 py-5">

        {/* BRAND */}
        <div className="mb-8 px-2">
          <h1 className="text-sm font-bold tracking-wide text-[#F2F0EA]">
            ARUNIKA
          </h1>

          <p className="mt-1 text-[8px] tracking-[0.15em] text-[#6F7072]">
            STUDENT WORKSPACE
          </p>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-6 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2 text-[9px] font-medium tracking-[0.12em] text-[#6F7072]">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/siswa"
                      ? pathname === "/siswa"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-2 py-2 text-xs transition-colors ${
                        isActive
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

        {/* LOGOUT */}
        <div className="border-t border-[#202226] pt-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-xs text-[#A4A3A0] transition-colors hover:bg-[#161719] hover:text-[#F2F0EA]"
          >
            <LogOut size={14} strokeWidth={1.7} />
            <span>Keluar</span>
          </button>
        </div>

      </div>
    </aside>
  );
}