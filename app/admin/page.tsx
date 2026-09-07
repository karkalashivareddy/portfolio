import type { Metadata } from "next";
import AdminGate from "../../components/admin/AdminGate";
import AdminPanel from "../../components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 pt-24 pb-16">
      <AdminGate>
        <AdminPanel />
      </AdminGate>
    </div>
  );
}