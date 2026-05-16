import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LabScope — Lab management platform" },
      { name: "description", content: "LabScope: manage your lab members, roles, and approvals." },
    ],
  }),
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Lab management
        </p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight text-foreground">
          LabScope
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Backend connected. Profiles table ready for admins, directors,
          teachers, and PhD students.
        </p>
      </div>
    </main>
  );
}
