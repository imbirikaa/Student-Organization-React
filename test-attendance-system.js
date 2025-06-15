// Test script for Attendance Check-In System
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

const testAttendanceSystem = async () => {
  console.log("📋 Testing Attendance Check-In System...\n");

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

    // 2. Get events with registrations
    console.log("\n2️⃣ Getting events...");
    const eventsRes = await fetch(`${API_BASE}/api/events`);

    if (!eventsRes.ok) {
      console.log("❌ Failed to get events");
      return;
    }

    const events = await eventsRes.json();
    console.log(`✅ Found ${events.data?.length || 0} events`);

    if (!events.data?.length) {
      console.log("   No events found to test with");
      return;
    }

    const testEvent = events.data[0];
    console.log(`   Using event: ${testEvent.event} (ID: ${testEvent.id})`);

    // 3. Get check-in statistics for the event
    console.log("\n3️⃣ Testing check-in statistics...");
    const statsRes = await authenticatedFetch(
      `${API_BASE}/api/admin/events/${testEvent.id}/check-in-stats`
    );

    if (statsRes.ok) {
      const stats = await statsRes.json();
      console.log("✅ Check-in statistics retrieved:");
      console.log(`   Event: ${stats.event}`);
      console.log(`   Total registrations: ${stats.total_registrations}`);
      console.log(`   Checked in: ${stats.checked_in_count}`);
      console.log(`   Attendance rate: ${stats.attendance_rate}%`);
      console.log(`   Pending check-ins: ${stats.pending_check_ins}`);

      if (stats.recent_check_ins?.length > 0) {
        console.log(`   Recent check-ins: ${stats.recent_check_ins.length}`);
      }
    } else {
      const errorData = await statsRes.json();
      console.log(`❌ Stats failed: ${errorData.message}`);
    }

    // 4. Get registrations to find attendance codes
    console.log("\n4️⃣ Getting event registrations for attendance codes...");
    const regsRes = await authenticatedFetch(
      `${API_BASE}/api/admin/events/${testEvent.id}/registrations`
    );

    if (regsRes.ok) {
      const regsData = await regsRes.json();
      console.log(
        `✅ Found ${regsData.total_registrations || 0} registrations`
      );

      if (regsData.registrations?.length > 0) {
        // Test check-in by code (be careful with this in real testing)
        const testReg = regsData.registrations.find(
          (r) => r.status === "confirmed"
        );
        if (testReg) {
          console.log(
            `   Sample registration: ${testReg.user_name} (Status: ${testReg.status})`
          );
          console.log(
            `   ⚠️  Note: In production, you would get attendance codes from registration details`
          );
        }
      }
    }

    // 5. Test invalid attendance code check-in
    console.log("\n5️⃣ Testing invalid attendance code...");
    const invalidRes = await authenticatedFetch(
      `${API_BASE}/api/admin/check-in-by-code`,
      {
        method: "POST",
        body: JSON.stringify({
          attendance_code: "INVALID1",
          notes: "Test check-in",
        }),
      }
    );

    if (!invalidRes.ok) {
      const errorData = await invalidRes.json();
      console.log(`✅ Invalid code properly rejected: ${errorData.message}`);
    } else {
      console.log("❌ Invalid code was accepted (unexpected)");
    }

    // 6. Test bulk check-in with invalid codes
    console.log("\n6️⃣ Testing bulk check-in with invalid codes...");
    const bulkRes = await authenticatedFetch(
      `${API_BASE}/api/admin/bulk-check-in`,
      {
        method: "POST",
        body: JSON.stringify({
          attendance_codes: ["INVALID1", "INVALID2", "INVALID3"],
          notes: "Test bulk check-in",
        }),
      }
    );

    if (bulkRes.ok) {
      const bulkData = await bulkRes.json();
      console.log("✅ Bulk check-in test completed:");
      console.log(`   Results: ${JSON.stringify(bulkData.summary, null, 2)}`);
    } else {
      const errorData = await bulkRes.json();
      console.log(`❌ Bulk check-in failed: ${errorData.message}`);
    }

    console.log("\n🎉 Attendance Check-In System test completed!");
    console.log("\n📝 Next steps to test manually:");
    console.log("   1. Go to http://localhost:3000/admin/attendance-check-in");
    console.log("   2. Select an event");
    console.log("   3. View check-in statistics");
    console.log("   4. Test single check-in with valid attendance codes");
    console.log("   5. Test bulk check-in functionality");
    console.log("   6. Check recent check-ins display");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Run the test
testAttendanceSystem();
