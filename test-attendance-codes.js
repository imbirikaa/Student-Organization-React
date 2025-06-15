// Test script for attendance code functionality
const BASE_URL = "http://localhost:8000/api";

// Helper function to get CSRF token
async function getCSRFToken() {
  await fetch("http://localhost:8000/sanctum/csrf-cookie", {
    credentials: "include",
  });
}

// Helper function to get XSRF token from cookies
function getXSRFToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; XSRF-TOKEN=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return "";
}

// Test user login
async function loginUser() {
  await getCSRFToken();

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": getXSRFToken(),
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: "admin@admin.com",
      password: "password123",
    }),
  });

  const data = await response.json();
  console.log("Login response:", data);
  return response.ok;
}

// Test getting user's attendance codes
async function testGetMyAttendanceCodes() {
  console.log("\n=== Testing My Attendance Codes ===");

  try {
    await getCSRFToken();

    const response = await fetch(`${BASE_URL}/my-attendance-codes`, {
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": getXSRFToken(),
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log("My attendance codes:", data);

    if (data.success && data.data.length > 0) {
      // Test getting details for the first code
      const firstCode = data.data[0];
      await testGetAttendanceCodeDetails(firstCode.attendance_code);
    }
  } catch (error) {
    console.error("Error getting attendance codes:", error);
  }
}

// Test getting specific attendance code details
async function testGetAttendanceCodeDetails(code) {
  console.log(`\n=== Testing Attendance Code Details for ${code} ===`);

  try {
    await getCSRFToken();

    const response = await fetch(`${BASE_URL}/attendance-code/${code}`, {
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": getXSRFToken(),
      },
      credentials: "include",
    });

    const data = await response.json();
    console.log("Attendance code details:", data);
  } catch (error) {
    console.error("Error getting attendance code details:", error);
  }
}

// Test event registration (which should generate attendance code)
async function testEventRegistration() {
  console.log("\n=== Testing Event Registration ===");

  try {
    // First get available events
    await getCSRFToken();

    const eventsResponse = await fetch(`${BASE_URL}/events`, {
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": getXSRFToken(),
      },
      credentials: "include",
    });

    const eventsData = await eventsResponse.json();
    console.log("Available events:", eventsData);

    if (eventsData.data && eventsData.data.length > 0) {
      const firstEvent = eventsData.data[0];

      // Try to register for the first event
      const registerResponse = await fetch(
        `${BASE_URL}/events/${firstEvent.id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": getXSRFToken(),
          },
          credentials: "include",
        }
      );

      const registerData = await registerResponse.json();
      console.log("Registration response:", registerData);
    }
  } catch (error) {
    console.error("Error testing event registration:", error);
  }
}

// Run all tests
async function runTests() {
  console.log("Starting attendance code tests...");

  const loginSuccess = await loginUser();
  if (!loginSuccess) {
    console.error("Login failed, aborting tests");
    return;
  }

  await testEventRegistration();
  await testGetMyAttendanceCodes();
}

// Run tests when page loads
runTests();
