"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
  LogOut,
} from "lucide-react";

const menuGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/guru",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "PEMBELAJARAN",
    items: [
      {
        label: "Materi",
        href: "/guru/materi",
        icon: BookOpen,
      },
      {
        label: "Tugas",
        href: "/guru/tugas",
        icon: ClipboardList,
      },
      {
        label: "Assessment",
        href: "/guru/assessment",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "EVALUASI",
    items: [
      {
        label: "Penilaian",
        href: "/guru/penilaian",
        icon: BarChart3,
      },
      {
        label: "Feedback",
        href: "/guru/feedback",
        icon: MessageSquare,
      },
    ],
  },
];

export default function GuruSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-[#292B30] bg-[#111214]">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-[#292B30] px-5">
        <div>
          <p className="text-sm font-semibold tracking-wide text-[#F2F0EA]">
            ARUNIKA
          </p>
          <p className="text-[11px] text-[#6F7072]">
            Teaching Workspace
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.14em] text-[#6F7072]">
              {group.label}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/guru"
                    ? pathname === "/guru"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-[#1C1D20] text-[#F2F0EA]"
                        : "text-[#A4A3A0] hover:bg-[#161719] hover:text-[#F2F0EA]"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-[#292B30] p-3">
        <div className="mb-2 rounded-lg px-3 py-2">
          <p className="truncate text-sm text-[#F2F0EA]">
        {session?.user?.name || "Guru"}
        </p>

        <p className="truncate text-xs text-[#6F7072]">
        {session?.user?.email || ""}
        </p>
        </div>

        <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#A4A3A0] transition hover:bg-[#161719] hover:text-[#F2F0EA]"
        >
          <LogOut size={17} strokeWidth={1.8} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}