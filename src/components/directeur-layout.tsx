import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, GraduationCap, FolderKanban, BookOpen, ClipboardList, LogOut, UserPlus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useLang } from "@/hooks/use-lang";
import { LanguageSwitcher } from "@/components/language-switcher";

const items = [
  { title: "Dashboard", url: "/dashboard/directeur", icon: LayoutDashboard, key: "nav.dashboard" },
  { title: "Équipes", url: "/dashboard/directeur/equipes", icon: Users, key: "nav.equipes" },
  { title: "Chercheurs", url: "/dashboard/directeur/chercheurs", icon: GraduationCap, key: "nav.chercheurs" },
  { title: "Projets", url: "/dashboard/directeur/projets", icon: FolderKanban, key: "nav.projets" },
  { title: "Publications", url: "/dashboard/directeur/publications", icon: BookOpen, key: "nav.publications" },
  { title: "Bilans", url: "/dashboard/directeur/bilans", icon: ClipboardList, key: "nav.bilans" },
  { title: "Demandes d'inscription", url: "/dashboard/directeur/inscriptions", icon: UserPlus, key: "nav.inscriptions" },
] as const;

export function DirecteurLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, dir, isAr } = useLang();

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/login" });
  };

  return (
    <SidebarProvider>
      <div dir={dir} className={`min-h-screen flex w-full bg-background ${isAr ? "font-arabic" : ""}`}>
        <Sidebar collapsible="icon" side={isAr ? "right" : "left"}>
          <SidebarHeader className="px-4 py-4">
            <p className="text-xs uppercase tracking-widest text-sidebar-foreground/60">LabScope</p>
            <p className="text-sm font-semibold">{t("role.directeur")}</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{t(item.key)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                      <span>{t("logoutShort")}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="px-4 py-3 text-xs text-sidebar-foreground/70">
            {profile?.prenom} {profile?.nom}
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="relative h-16 flex items-center justify-between border-b border-border bg-card px-6">
            <span className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundColor: "var(--teal)" }} />
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="font-display text-2xl font-semibold" style={{ color: "var(--navy)" }}>{t("space.directeur")}</h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                {t("logout")}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto"><AutoTranslate>{children}</AutoTranslate></main>
        </div>
      </div>
    </SidebarProvider>
  );
}