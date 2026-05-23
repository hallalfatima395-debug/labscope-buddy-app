import { createFileRoute, Outlet } from "@tanstack/react-router";
import { User, BookOpen, ClipboardList } from "lucide-react";
import { Protected } from "@/components/protected";
import { RoleLayout, type NavItem } from "@/components/role-layout";

const items: ReadonlyArray<NavItem> = [
  { title: "Mon profil", url: "/dashboard/chercheur", icon: User, i18nKey: "nav.profile" },
  { title: "Mes publications", url: "/dashboard/chercheur/publications", icon: BookOpen, i18nKey: "nav.my_publications" },
  { title: "Mon bilan", url: "/dashboard/chercheur/bilan", icon: ClipboardList, i18nKey: "nav.my_bilan" },
];

export const Route = createFileRoute("/dashboard/chercheur")({
  component: () => (
    <Protected role="enseignant">
      <RoleLayout
        title="Espace Chercheur"
        roleLabel="Chercheur"
        titleKey="space.chercheur"
        roleLabelKey="role.chercheur"
        items={items}
      >
        <Outlet />
      </RoleLayout>
    </Protected>
  ),
});