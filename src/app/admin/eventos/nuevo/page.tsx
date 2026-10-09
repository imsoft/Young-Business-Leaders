import type { Metadata } from "next";
import { EventForm } from "@/components/admin/event-form";

export const metadata: Metadata = { title: "Nuevo evento" };

export default function NuevoEventoPage() {
  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <h1 className="font-heading text-2xl font-extrabold">Nuevo evento</h1>
      <div className="rounded-2xl border bg-card p-6">
        <EventForm />
      </div>
    </div>
  );
}
