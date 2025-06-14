// Debug script to test CSRF and authentication
const testAuth = async () => {
  console.log("🔍 Testing Authentication and CSRF...\n");

  try {
    // 1. Get CSRF cookie
    console.log("1️⃣ Getting CSRF cookie...");
    const csrfRes = await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });
    console.log("CSRF response status:", csrfRes.status);

    // 2. Check current cookies
    console.log("\n2️⃣ Current cookies:");
    console.log(document.cookie);

    // 3. Get CSRF token
    const getCookieValue = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return "";
    };

    const xsrfToken = getCookieValue("XSRF-TOKEN");
    console.log("XSRF Token:", xsrfToken ? "Found" : "Not found");
    console.log("Token value:", xsrfToken);

    // 4. Test /api/me endpoint
    console.log("\n3️⃣ Testing /api/me endpoint...");
    const meRes = await fetch("http://localhost:8000/api/me", {
      credentials: "include",
      headers: {
        "X-XSRF-TOKEN": xsrfToken,
        Accept: "application/json",
      },
    });

    console.log("/api/me status:", meRes.status);
    if (meRes.ok) {
      const meData = await meRes.json();
      console.log("User data:", meData);
    } else {
      const errorText = await meRes.text();
      console.log("/api/me error:", errorText);
    }

    // 5. Test event registration endpoint
    console.log("\n4️⃣ Testing event registration endpoint...");

    // First get an event ID
    const eventsRes = await fetch("http://localhost:8000/api/events");
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (events.data && events.data.length > 0) {
        const testEventId = events.data[0].id;
        console.log("Using event ID:", testEventId);

        // Test registration endpoint
        const regRes = await fetch(
          `http://localhost:8000/api/events/${testEventId}/register`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "X-XSRF-TOKEN": xsrfToken,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Registration attempt status:", regRes.status);
        const regText = await regRes.text();
        console.log("Registration response:", regText);
      }
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run in browser console
console.log("Run testAuth() in the browser console to debug authentication");
window.testAuth = testAuth;
