import { redirect } from "next/navigation";

// Admin and customer login are unified now — staff accounts are just
// regular Supabase accounts with role = 'staff', and /account/login routes
// them to /admin automatically after signing in. This route only exists so
// old bookmarks/links to /admin/login still land somewhere sensible.
export default function AdminLoginRedirect() {
  redirect("/account/login");
}
