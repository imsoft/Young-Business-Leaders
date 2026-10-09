"use client";

import { useTransition } from "react";
import { setMemberAdmin, setMemberStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import type { MemberStatus } from "@/lib/types";

export function MemberActions({ id, status, isAdmin, isSelf }: { id: string; status: MemberStatus; isAdmin: boolean; isSelf: boolean }) {
  const [pending, start] = useTransition();
  const set = (s: MemberStatus) => start(() => setMemberStatus(id, s));
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {status !== "approved" ? (
        <Button size="xs" disabled={pending} onClick={() => set("approved")}>Aprobar</Button>
      ) : null}
      {status !== "rejected" ? (
        <Button size="xs" variant="destructive" disabled={pending || isSelf} onClick={() => set("rejected")}>Rechazar</Button>
      ) : null}
      {status === "rejected" ? (
        <Button size="xs" variant="outline" disabled={pending} onClick={() => set("pending")}>A pendiente</Button>
      ) : null}
      <Button size="xs" variant="ghost" disabled={pending || isSelf} onClick={() => start(() => setMemberAdmin(id, !isAdmin))}>
        {isAdmin ? "Quitar admin" : "Hacer admin"}
      </Button>
    </div>
  );
}
