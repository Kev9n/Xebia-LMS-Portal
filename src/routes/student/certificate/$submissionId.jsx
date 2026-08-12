import { createFileRoute } from "@tanstack/react-router";
import { CertificateView } from "@/pages/CertificateView";

export const Route = createFileRoute("/student/certificate/$submissionId")({
  component: CertificateView,
});
