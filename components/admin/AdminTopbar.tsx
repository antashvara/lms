"use client";

import {
  Search,
  Bell,
  Settings,
  UserCircle,
} from "lucide-react";

export default function AdminTopbar() {
  return (
    <header className="fixed left-56 right-0 top-0 z-30 h-14 border-b border-[#202226] bg-[#0B0C0E]">
      <div className="flex h-full items-center justify-end gap-4 px-6">

        <button className="text-[#A4A3A0] transition-colors hover:text-[#F2F0EA]">
          <Search size={15} strokeWidth={1.7} />
        </button>

        <button className="text-[#A4A3A0] transition-colors hover:text-[#F2F0EA]">
          <Bell size={15} strokeWidth={1.7} />
        </button>

        <button className="text-[#A4A3A0] transition-colors hover:text-[#F2F0EA]">
          <Settings size={15} strokeWidth={1.7} />
        </button>

        <div className="ml-1 border-l border-[#292B30] pl-4">
          <button className="text-[#A4A3A0]">
            <UserCircle size={17} strokeWidth={1.7} />
          </button>
        </div>

      </div>
    </header>
  );
}