"use client";

import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";

export default function GuruTopbar() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 right-0 left-56 z-30 flex h-14 items-center justify-between border-b border-[#292B30] bg-[#111214] px-6">
      <div>
        <p className="text-sm font-medium text-[#F2F0EA]">
          Teaching Workspace
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#A4A3A0] transition hover:bg-[#161719] hover:text-[#F2F0EA]"
        >
          <Bell size={18} strokeWidth={1.8} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
        </button>

        <div className="flex items-center gap-3 border-l border-[#292B30] pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1D20] text-xs font-medium text-[#F2F0EA]">
            {session?.user?.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "G"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm text-[#F2F0EA]">
              {session?.user?.name || "Guru"}
            </p>

            <p className="text-xs text-[#6F7072]">
              Guru
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}