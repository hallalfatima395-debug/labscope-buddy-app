import { createFileRoute } from "@tanstack/react-router";
import { ThesePage } from "@/components/membre/these-page";

export const Route = createFileRoute("/dashboard/doctorant/these")({
  component: ThesePage,
});