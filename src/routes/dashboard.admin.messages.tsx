import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/admin/messages")({
  component: AdminMessagesPage,
});

interface ContactMessage {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setMessages((data as ContactMessage[]) ?? []);
      setLoading(false);
    })();

    const channel = supabase
      .channel("contact_messages_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [payload.new as ContactMessage, ...prev]);
            const m = payload.new as ContactMessage;
            toast.info(`Nouveau message de ${m.prenom} ${m.nom}`);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) => (m.id === (payload.new as ContactMessage).id ? (payload.new as ContactMessage) : m)),
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== (payload.old as { id: string }).id));
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const toggleRead = async (m: ContactMessage) => {
    await supabase.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
  };

  const remove = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    toast.success("Message supprimé");
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Gestion des messages</h2>
          <p className="text-sm text-muted-foreground">Messages reçus via le formulaire de contact</p>
        </div>
        {unreadCount > 0 && <Badge variant="default">{unreadCount} non lu(s)</Badge>}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Chargement…</p>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Aucun message pour le moment.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {messages.map((m) => (
            <Card key={m.id} className={m.is_read ? "" : "border-l-4 border-l-[color:var(--teal,#0D9488)]"}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">
                    {m.prenom} {m.nom}
                  </CardTitle>
                  <a href={`mailto:${m.email}`} className="text-xs text-muted-foreground hover:underline">
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString("fr-FR")}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => void toggleRead(m)} title={m.is_read ? "Marquer non lu" : "Marquer lu"}>
                    {m.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => void remove(m.id)} title="Supprimer">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{m.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}