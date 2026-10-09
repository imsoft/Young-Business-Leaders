import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync(".env.local","utf8").split("\n").filter(l=>l.includes("=")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const s = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});
for (const t of ["profiles","events","event_registrations","gallery_albums","gallery_photos","sponsors","contact_messages"]) {
  const { count, error } = await s.from(t).select("*",{count:"exact",head:true});
  console.log(t, error ? "ERROR " + error.message : `ok (${count} rows)`);
}
const { data: b } = await s.storage.listBuckets();
console.log("buckets:", b?.map(x=>x.name).join(", "));
const { data: fn, error: fe } = await s.rpc("event_attendee_count", { event: "00000000-0000-0000-0000-000000000000" });
console.log("rpc event_attendee_count:", fe ? "ERROR " + fe.message : fn);
