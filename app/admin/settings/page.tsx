import type { Metadata } from "next";
import AdminGate from "../../../components/admin/AdminGate";
import SettingsPanel from "../../../components/admin/SettingsPanel";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 pt-24 pb-16">
      <AdminGate>
        <SettingsPanel />
      </AdminGate>
    </div>
  );
}