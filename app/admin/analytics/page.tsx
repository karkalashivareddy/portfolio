import type { Metadata } from "next";
import AdminGate from "../../../components/admin/AdminGate";
import AnalyticsPanel from "../../../components/admin/AnalyticsPanel";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 pt-24 pb-16">
      <AdminGate>
        <AnalyticsPanel />
      </AdminGate>
    </div>
  );
}