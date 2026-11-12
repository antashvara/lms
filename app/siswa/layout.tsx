import SiswaSidebar from "@/components/siswa/SiswaSidebar";
import SiswaTopbar from "@/components/siswa/SiswaTopbar";

export default function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F2F0EA]">
      <SiswaSidebar />
      <SiswaTopbar />

      <main className="ml-56 pt-14">
        {children}
      </main>
    </div>
  );
}