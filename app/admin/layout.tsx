import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F2F0EA]">

      <AdminSidebar />

      <AdminTopbar />

      <main className="ml-56 pt-14">
        {children}
      </main>

    </div>
  );
}