import { createFileRoute } from "@tanstack/react-router";
import { BilanPage } from "@/components/membre/bilan-page";

export const Route = createFileRoute("/dashboard/doctorant/bilan")({
  component: () => <BilanPage includeThese />,
});