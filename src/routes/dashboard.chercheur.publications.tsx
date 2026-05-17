import { createFileRoute } from "@tanstack/react-router";
import { PublicationsPage } from "@/components/membre/publications-page";

export const Route = createFileRoute("/dashboard/chercheur/publications")({
  component: PublicationsPage,
});