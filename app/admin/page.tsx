import RequireRole from "@/components/RequireRole";

export default function AdminPage() {
  return (
    <RequireRole role="admin">
      <h1>Welcome to the Admin Panel</h1>
    </RequireRole>
  );
}
