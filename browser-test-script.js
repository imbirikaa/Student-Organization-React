// Test the audit system APIs in browser console
// Make sure you're logged in first, then run these in browser console:

// 1. Check user permissions
fetch("/api/user/permissions", {
  credentials: "include",
  headers: { Accept: "application/json" },
})
  .then((r) => r.json())
  .then((data) => console.log("User Permissions:", data));

// 2. Get audit logs (replace {communityId} with actual ID)
fetch("/api/communities/1/audit-logs", {
  credentials: "include",
  headers: { Accept: "application/json" },
})
  .then((r) => r.json())
  .then((data) => console.log("Audit Logs:", data));

// 3. Get audit stats
fetch("/api/communities/1/audit-stats", {
  credentials: "include",
  headers: { Accept: "application/json" },
})
  .then((r) => r.json())
  .then((data) => console.log("Audit Stats:", data));

// 4. Get community members
fetch("/api/communities/1/members", {
  credentials: "include",
  headers: { Accept: "application/json" },
})
  .then((r) => r.json())
  .then((data) => console.log("Community Members:", data));
