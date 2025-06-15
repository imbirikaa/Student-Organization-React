// Test script for event registration functionality
const API_BASE = "http://localhost:8000";

// Test functions
const testEventRegistration = async () => {
  console.log("🧪 Testing Event Registration API...\n");

  try {
    // 1. Test login first
    console.log("1️⃣ Testing login...");

    // Get CSRF cookie first
    await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
      credentials: "include",
    });

    const loginRes = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: "admin@admin.com",
        password: "admin123",
      }),
      credentials: "include",
    });

    if (loginRes.ok) {
      console.log("✅ Login successful");
    } else {
      console.log("❌ Login failed:", await loginRes.text());
      return;
    }

    // 2. Get first event
    console.log("\n2️⃣ Getting first event...");
    const eventsRes = await fetch(`${API_BASE}/api/events`, {
      credentials: "include",
    });

    if (!eventsRes.ok) {
      console.log("❌ Failed to get events:", await eventsRes.text());
      return;
    }

    const events = await eventsRes.json();
    if (events.length === 0) {
      console.log("❌ No events found");
      return;
    }

    const testEvent = events[0];
    console.log(`✅ Using event: ${testEvent.event} (ID: ${testEvent.id})`);

    // 3. Check current registration status
    console.log("\n3️⃣ Checking registration status...");
    const checkRes = await fetch(
      `${API_BASE}/api/events/${testEvent.id}/check-registration`,
      {
        credentials: "include",
      }
    );

    if (checkRes.ok) {
      const checkData = await checkRes.json();
      console.log(`✅ Current registration status: ${checkData.registered}`);

      // 4. Register/unregister based on current status
      if (!checkData.registered) {
        console.log("\n4️⃣ Registering for event...");
        const registerRes = await fetch(
          `${API_BASE}/api/events/${testEvent.id}/register`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (registerRes.ok) {
          const registerData = await registerRes.json();
          console.log("✅ Registration successful:", registerData.message);
        } else {
          const errorText = await registerRes.text();
          console.log("❌ Registration failed:", errorText);
        }
      } else {
        console.log("\n4️⃣ Unregistering from event...");
        const unregisterRes = await fetch(
          `${API_BASE}/api/events/${testEvent.id}/unregister`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (unregisterRes.ok) {
          const unregisterData = await unregisterRes.json();
          console.log("✅ Unregistration successful:", unregisterData.message);
        } else {
          const errorText = await unregisterRes.text();
          console.log("❌ Unregistration failed:", errorText);
        }
      }
    } else {
      console.log(
        "❌ Failed to check registration status:",
        await checkRes.text()
      );
    }

    // 5. Get registration statistics
    console.log("\n5️⃣ Getting registration statistics...");
    const statsRes = await fetch(
      `${API_BASE}/api/events/${testEvent.id}/registrations`,
      {
        credentials: "include",
      }
    );

    if (statsRes.ok) {
      const statsData = await statsRes.json();
      console.log("✅ Registration stats:");
      console.log(`   - Total: ${statsData.total_registrations}`);
      console.log(
        `   - Confirmed: ${
          statsData.registrations?.filter((r) => r.status === "confirmed")
            .length || 0
        }`
      );
    } else {
      console.log(
        "❌ Failed to get registration stats:",
        await statsRes.text()
      );
    }

    // 6. Final status check
    console.log("\n6️⃣ Final registration status check...");
    const finalCheckRes = await fetch(
      `${API_BASE}/api/events/${testEvent.id}/check-registration`,
      {
        credentials: "include",
      }
    );

    if (finalCheckRes.ok) {
      const finalCheckData = await finalCheckRes.json();
      console.log(`✅ Final registration status: ${finalCheckData.registered}`);
    }

    console.log("\n🎉 Test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Run the test
testEventRegistration();
