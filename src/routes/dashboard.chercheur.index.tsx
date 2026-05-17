import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/membre/profile-page";

export const Route = createFileRoute("/dashboard/chercheur/")({
  component: ProfilePage,
});