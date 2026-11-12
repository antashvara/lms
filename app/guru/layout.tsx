import GuruSidebar from "@/components/guru/GuruSidebar";
import GuruTopbar from "@/components/guru/GuruTopbar";

export default function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F2F0EA]">
      <GuruSidebar />
      <GuruTopbar />

      <main className="ml-56 pt-14">
        {children}
      </main>
    </div>
  );
}