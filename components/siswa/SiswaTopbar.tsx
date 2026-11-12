"use client";

import { Bell } from "lucide-react";

export default function SiswaTopbar() {
  return (
    <header className="fixed left-56 right-0 top-0 z-30 h-14 border-b border-[#202226] bg-[#0B0C0E]">
      <div className="flex h-full items-center justify-between px-7">
        {/* LEFT */}
        <div>
          <p className="text-xs font-medium text-[#F2F0EA]">
            Overview
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {/* NOTIFICATION */}
          <button
            type="button"
            className="relative rounded-md p-2 text-[#6F7072] transition hover:bg-[#161719] hover:text-[#F2F0EA]"
            title="Notifikasi"
          >
            <Bell size={16} strokeWidth={1.7} />

            {/* Notification indicator */}
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F2F0EA]" />
          </button>

          {/* STUDENT INFO */}
          <div className="flex items-center gap-3">
            {/* AVATAR */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1D20] text-[10px] font-medium text-[#F2F0EA]">
              BS
            </div>

            {/* NAME + CLASS */}
            <div className="leading-none">
              <p className="text-xs font-medium text-[#F2F0EA]">
                Budi Siswa
              </p>

              <p className="mt-1 text-[10px] text-[#6F7072]">
                X PPLG 1
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}