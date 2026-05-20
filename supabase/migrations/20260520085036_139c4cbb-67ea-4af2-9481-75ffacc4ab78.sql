CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  admin_emails text[] := array[
    'timewithtree@gmail.com',
    'jklwjr@gmail.com',
    'arminko2023@gmail.com',
    'bj.euphoria@gmail.com'
  ];
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );

  if lower(new.email) = any(admin_emails) then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$function$;

-- Restore admin role for existing accounts
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE lower(email) IN ('arminko2023@gmail.com', 'bj.euphoria@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;