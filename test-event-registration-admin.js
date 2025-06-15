// Test script for Event Registration Management
const API_BASE = "http://localhost:8000";

const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop().split(";").shift();
    return decodeURIComponent(cookieValue);
  }
  return "";
};

const authenticatedFetch = async (url, options = {}) => {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: "include",
  });

  const token = getCookieValue("XSRF-TOKEN");

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
      ...options.headers,
    },
  });
};

const testEventRegistrationManagement = async () => {
  console.log("🎫 Testing Event Registration Management System...\n");

  try {
    // 1. Test authentication
    console.log("1️⃣ Testing authentication...");
    const authRes = await fetch(`${API_BASE}/api/me`, {
      credentials: "include",
    });

    if (!authRes.ok) {
      console.log("❌ Not authenticated. Please login first.");
      return;
    }

    const authData = await authRes.json();
    console.log(`✅ Authenticated as: ${authData.user?.email}`);
    console.log(`   Roles: ${authData.roles?.join(", ") || "None"}`);

    // 2. Test getting registration stats
    console.log("\n2️⃣ Testing registration statistics...");
    const statsRes = await authenticatedFetch(
      `${API_BASE}/api/admin/event-registration-stats`
    );

    if (statsRes.ok) {
      const stats = await statsRes.json();
      console.log("✅ Registration statistics retrieved:");
      console.log(`   Total registrations: ${stats.total_registrations}`);
      console.log(`   Confirmed: ${stats.confirmed_registrations}`);
      console.log(`   Cancelled: ${stats.cancelled_registrations}`);
      console.log(`   Attended: ${stats.attended_registrations}`);
      console.log(`   Recent (7 days): ${stats.recent_registrations}`);
      console.log(`   Upcoming events: ${stats.upcoming_events}`);
    } else {
      const errorData = await statsRes.json();
      console.log(`❌ Stats access failed: ${errorData.message}`);
    }

    // 3. Test getting all registrations
    console.log("\n3️⃣ Testing get all registrations...");
    const registrationsRes = await authenticatedFetch(
      `${API_BASE}/api/admin/event-registrations`
    );

    if (registrationsRes.ok) {
      const registrationsData = await registrationsRes.json();
      console.log(
        `✅ Found ${registrationsData.data?.length || 0} registrations`
      );

      if (registrationsData.data?.length > 0) {
        console.log("   Sample registrations:");
        registrationsData.data.slice(0, 3).forEach((reg, index) => {
          console.log(
            `     ${index + 1}. ${reg.user.name} → ${reg.event.name} (${
              reg.status
            })`
          );
        });
      }
    } else {
      const errorData = await registrationsRes.json();
      console.log(`❌ Get registrations failed: ${errorData.message}`);
    }

    console.log("\n🎉 Event Registration Management test completed!");
    console.log("\n📝 Next steps to test manually:");
    console.log("   1. Go to http://localhost:3000/admin/event-registrations");
    console.log("   2. View registration statistics");
    console.log("   3. Test filter by status");
    console.log("   4. Test mark as attended functionality");
    console.log("   5. Test cancel registration functionality");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Run the test
testEventRegistrationManagement();
