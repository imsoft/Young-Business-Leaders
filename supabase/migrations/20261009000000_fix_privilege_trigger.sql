-- El service role (panel admin, scripts) no tiene auth.uid(), así que el trigger
-- revertía status/is_admin en cada actualización administrativa. Solo se protege
-- cuando hay un usuario autenticado que no es admin.
create or replace function public.protect_profile_privileges()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.status := old.status;
    new.is_admin := old.is_admin;
    new.email := old.email;
  end if;
  return new;
end;
$$;
