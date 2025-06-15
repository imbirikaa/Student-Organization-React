// Test API Endpoints
// Run this from browser console or use a tool like Postman

const API_BASE = "http://localhost:8000/api";

// Test 1: Check /me endpoint
async function testMeEndpoint() {
  try {
    console.log("Testing /me endpoint...");
    const response = await fetch(`${API_BASE}/me`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log("Me endpoint response:", data);
    return data;
  } catch (error) {
    console.error("Me endpoint error:", error);
  }
}

// Test 2: Check admin stats (requires admin role)
async function testAdminStats() {
  try {
    console.log("Testing admin stats...");
    // First get CSRF token
    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });

    const response = await fetch(`${API_BASE}/admin/stats`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
      },
    });
    const data = await response.json();
    console.log("Admin stats response:", data);
    return data;
  } catch (error) {
    console.error("Admin stats error:", error);
  }
}

// Test 3: Check user communities
async function testUserCommunities() {
  try {
    console.log("Testing user communities...");
    const response = await fetch(`${API_BASE}/user/communities`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log("User communities response:", data);
    return data;
  } catch (error) {
    console.error("User communities error:", error);
  }
}

// Helper function to get cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Run all tests
async function runAllTests() {
  console.log("=== API Endpoint Tests ===");
  await testMeEndpoint();
  await testAdminStats();
  await testUserCommunities();
  console.log("=== Tests Complete ===");
}

// Export for use
window.testAPI = {
  testMeEndpoint,
  testAdminStats,
  testUserCommunities,
  runAllTests,
};

console.log("API test functions available as window.testAPI");
console.log("Run window.testAPI.runAllTests() to test all endpoints");
