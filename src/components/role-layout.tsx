import type { ReactNode, ComponentType } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
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
import { AutoTranslate } from "@/components/auto-translate";

export interface NavItem {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  i18nKey?: string;
}

export function RoleLayout({
  title,
  roleLabel,
  items,
  children,
  titleKey,
  roleLabelKey,
}: {
  title: string;
  roleLabel: string;
  items: ReadonlyArray<NavItem>;
  children: ReactNode;
  titleKey?: string;
  roleLabelKey?: string;
}) {
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
            <p className="text-sm font-semibold">{roleLabelKey ? t(roleLabelKey) : roleLabel}</p>
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
                          <span>{item.i18nKey ? t(item.i18nKey) : item.title}</span>
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
              <h1 className="font-display text-2xl font-semibold" style={{ color: "var(--navy)" }}>
                {titleKey ? t(titleKey) : title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                {t("logout")}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <AutoTranslate>{children}</AutoTranslate>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}