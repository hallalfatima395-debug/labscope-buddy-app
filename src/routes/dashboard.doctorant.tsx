import { createFileRoute, Outlet } from "@tanstack/react-router";
import { User, BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import { Protected } from "@/components/protected";
import { RoleLayout, type NavItem } from "@/components/role-layout";

const items: ReadonlyArray<NavItem> = [
  { title: "Mon profil", url: "/dashboard/doctorant", icon: User, i18nKey: "nav.profile" },
  { title: "Mes publications", url: "/dashboard/doctorant/publications", icon: BookOpen, i18nKey: "nav.my_publications" },
  { title: "Mon bilan", url: "/dashboard/doctorant/bilan", icon: ClipboardList, i18nKey: "nav.my_bilan" },
  { title: "Ma thèse", url: "/dashboard/doctorant/these", icon: GraduationCap, i18nKey: "nav.these" },
];

export const Route = createFileRoute("/dashboard/doctorant")({
  component: () => (
    <Protected role="doctorant">
      <RoleLayout
        title="Espace Doctorant"
        roleLabel="Doctorant"
        titleKey="space.doctorant"
        roleLabelKey="role.doctorant"
        items={items}
      >
        <Outlet />
      </RoleLayout>
    </Protected>
  ),
});