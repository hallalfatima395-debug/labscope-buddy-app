import { useEffect, useRef, type ReactNode } from "react";
import { useLang } from "@/hooks/use-lang";

// French -> Arabic dictionary covering dashboard pages' static UI text.
// Keys are the trimmed visible French strings.
const AR: Record<string, string> = {
  "Actions": "إجراءات",
  "Activités de recherche": "أنشطة البحث",
  "Ajouter": "إضافة",
  "Annuler": "إلغاء",
  "Année": "السنة",
  "Article": "مقال",
  "Assigner": "تعيين",
  "Assigner un chercheur": "تعيين باحث",
  "Aucun chercheur dans l'équipe": "لا يوجد باحث في الفريق",
  "Aucun laboratoire associé à votre compte.": "لا يوجد مختبر مرتبط بحسابك.",
  "Aucun utilisateur disponible": "لا يوجد مستخدم متاح",
  "Aucune donnée disponible": "لا توجد بيانات متاحة",
  "Auteurs": "المؤلفون",
  "Avancement de la thèse": "تقدّم الأطروحة",
  "Bilan": "الحصيلة",
  "Bilan soumis": "تم تقديم الحصيلة",
  "Bilans": "الحصائل",
  "Brevet": "براءة اختراع",
  "Chargement…": "جارٍ التحميل…",
  "Chef d'équipe": "رئيس الفريق",
  "Chef d'équipe mis à jour": "تم تحديث رئيس الفريق",
  "Chercheur assigné": "تم تعيين الباحث",
  "Chercheur retiré": "تم إزالة الباحث",
  "Chercheurs": "الباحثون",
  "Co-auteurs": "المؤلفون المشاركون",
  "Communications": "المداخلات",
  "Conférence": "مؤتمر",
  "Date début": "تاريخ البداية",
  "Date fin": "تاريخ النهاية",
  "Demandes d'inscription": "طلبات التسجيل",
  "Demandes de Directeurs": "طلبات المديرين",
  "Description": "الوصف",
  "Directeur": "المدير",
  "Doctorants": "طلبة الدكتوراه",
  "Début": "البداية",
  "Désigner un chef…": "تعيين رئيس…",
  "Email": "البريد الإلكتروني",
  "En cours": "قيد الإنجاز",
  "Encadrements": "التأطيرات",
  "Enregistrer": "حفظ",
  "Enregistré": "تم الحفظ",
  "Espace Chercheur": "فضاء الباحث",
  "Espace Doctorant": "فضاء طالب الدكتوراه",
  "Fermer": "إغلاق",
  "Fin": "النهاية",
  "Gestion des messages": "إدارة الرسائل",
  "Grade": "الرتبة",
  "Informations": "المعلومات",
  "Informations sur la thèse": "معلومات عن الأطروحة",
  "La mise à jour du statut n'a pas été enregistrée.": "لم يتم حفظ تحديث الحالة.",
  "Laboratoire": "المختبر",
  "Ma thèse": "أطروحتي",
  "Mes publications": "منشوراتي",
  "Message supprimé": "تم حذف الرسالة",
  "Messages reçus via le formulaire de contact": "الرسائل المستلمة عبر نموذج الاتصال",
  "Modifier": "تعديل",
  "Modifier le profil": "تعديل الملف الشخصي",
  "Modifier ma thèse": "تعديل أطروحتي",
  "Mon bilan": "حصيلتي",
  "Mon profil": "ملفّي الشخصي",
  "Nom": "الاسم",
  "Nombre de laboratoires": "عدد المختبرات",
  "Nombre de projets": "عدد المشاريع",
  "Objet :": "الموضوع:",
  "Profil mis à jour": "تم تحديث الملف الشخصي",
  "Projets": "المشاريع",
  "Prénom": "الاسم الشخصي",
  "Publication ajoutée": "تمت إضافة المنشور",
  "Publication modifiée": "تم تعديل المنشور",
  "Publication supprimée": "تم حذف المنشور",
  "Publications": "المنشورات",
  "Publications de l'année": "منشورات السنة",
  "Rechercher…": "بحث…",
  "Responsable": "المسؤول",
  "Retirer ce chercheur du laboratoire ?": "إزالة هذا الباحث من المختبر؟",
  "Rôle": "الدور",
  "Soumettre le bilan": "تقديم الحصيلة",
  "Soutenue": "تمت المناقشة",
  "Spécialité": "التخصص",
  "Statut": "الحالة",
  "Sujet": "الموضوع",
  "Sujet de thèse": "موضوع الأطروحة",
  "Supprimer": "حذف",
  "Supprimer ce projet ?": "حذف هذا المشروع؟",
  "Supprimer cette publication ?": "حذف هذا المنشور؟",
  "Supprimer cette équipe ?": "حذف هذا الفريق؟",
  "Sélectionner": "اختيار",
  "Séparés par des virgules": "مفصولة بفواصل",
  "Thèse mise à jour": "تم تحديث الأطروحة",
  "Titre": "العنوان",
  "Toutes années": "كل السنوات",
  "Toutes les équipes": "كل الفِرَق",
  "Type": "النوع",
  "Utilisateur": "المستخدم",
  "À :": "إلى:",
  "Équipe": "الفريق",
  "Équipe (optionnel)": "الفريق (اختياري)",
  "Équipe ajoutée": "تمت إضافة الفريق",
  "Équipe modifiée": "تم تعديل الفريق",
  "Équipe supprimée": "تم حذف الفريق",
  "Équipes": "الفِرَق",
  "— Aucun —": "— لا أحد —",
  "Déconnexion": "تسجيل الخروج",
  "Enseignants-Chercheurs": "الأساتذة الباحثون",
  "Enseignants": "الأساتذة",
  "Ajouter projet": "إضافة مشروع",
  "Modifier projet": "تعديل مشروع",
  "Ajouter publication": "إضافة منشور",
  "Modifier publication": "تعديل منشور",
  "Ajouter équipe": "إضافة فريق",
  "Modifier équipe": "تعديل فريق",
  "Valider": "تأكيد",
  "Refuser": "رفض",
  "Accepter": "قبول",
  "En attente": "قيد الانتظار",
  "Accepté": "مقبول",
  "Refusé": "مرفوض",
  "Date": "التاريخ",
  "Aucun message": "لا توجد رسائل",
};

function translateNode(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  while (node) {
    const t = node.nodeValue;
    if (t) {
      const trimmed = t.trim();
      const ar = AR[trimmed];
      if (ar && trimmed !== ar) {
        node.nodeValue = t.replace(trimmed, ar);
      }
    }
    node = walker.nextNode();
  }
  // placeholders
  if (root instanceof Element) {
    root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[placeholder]").forEach((el) => {
      const ph = el.getAttribute("placeholder");
      if (ph && AR[ph.trim()]) el.setAttribute("placeholder", AR[ph.trim()]);
    });
  }
}

export function AutoTranslate({ children }: { children: ReactNode }) {
  const { isAr } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAr || !ref.current) return;
    const el = ref.current;
    translateNode(el);
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "characterData" && m.target) translateNode(m.target);
        m.addedNodes.forEach((n) => translateNode(n));
        if (m.type === "attributes" && m.target instanceof Element) translateNode(m.target);
      }
    });
    obs.observe(el, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder"] });
    // Also translate portals (dialogs/selects) at document.body
    const bodyObs = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => translateNode(n));
    });
    bodyObs.observe(document.body, { childList: true, subtree: true });
    translateNode(document.body);
    return () => { obs.disconnect(); bodyObs.disconnect(); };
  }, [isAr]);

  return <div ref={ref}>{children}</div>;
}