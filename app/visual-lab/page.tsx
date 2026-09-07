import type { Metadata } from "next";
import VisualLab from "../../components/visual-lab/VisualLab";

export const metadata: Metadata = {
  title: "Visual Lab",
  description: "Independent interaction experiments for the Portfolio X² visual system.",
  robots: { index: false, follow: false },
};

export default function VisualLabPage() {
  return <VisualLab />;
}
