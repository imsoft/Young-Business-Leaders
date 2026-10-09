import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function MemberCard({ member }: { member: Pick<Profile, "id" | "full_name" | "avatar_url" | "headline" | "company" | "industry" | "city"> }) {
  return (
    <Link href={`/comunidad/${member.id}`} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Avatar size="lg" className="size-14">
        <AvatarImage src={member.avatar_url ?? undefined} alt="" />
        <AvatarFallback className="text-base">{initials(member.full_name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h3 className="font-heading truncate font-bold">{member.full_name}</h3>
        {member.headline ? <p className="truncate text-sm text-muted-foreground">{member.headline}</p> : null}
        {member.company ? <p className="truncate text-sm">{member.company}</p> : null}
        <div className="mt-2 flex flex-wrap gap-1">
          {member.industry ? <Badge variant="secondary">{member.industry}</Badge> : null}
          {member.city ? <Badge variant="outline">{member.city}</Badge> : null}
        </div>
      </div>
    </Link>
  );
}
