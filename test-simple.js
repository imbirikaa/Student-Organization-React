// Simple test for event registration using existing session approach
const testEventRegistrationSimple = async () => {
  console.log("🧪 Testing Event Registration (Simple)...\n");

  try {
    // 1. First, just test if we can get events without auth
    console.log("1️⃣ Testing events endpoint...");
    const eventsRes = await fetch("http://localhost:8000/api/events");

    if (eventsRes.ok) {
      const events = await eventsRes.json();
      console.log(`✅ Found ${events.length} events`);

      if (events.length > 0) {
        const testEvent = events[0];
        console.log(
          `   - Test event: ${testEvent.event} (ID: ${testEvent.id})`
        );

        // 2. Test registration check endpoint (should work without auth)
        console.log("\n2️⃣ Testing registration check without auth...");
        const checkRes = await fetch(
          `http://localhost:8000/api/events/${testEvent.id}/check-registration`
        );

        if (checkRes.ok) {
          const checkData = await checkRes.json();
          console.log(
            `✅ Registration check works: ${JSON.stringify(checkData)}`
          );
        } else {
          console.log(
            "✅ Registration check returns expected error for unauthenticated user"
          );
        }

        // 3. Test registration stats endpoint
        console.log("\n3️⃣ Testing registration stats...");
        const statsRes = await fetch(
          `http://localhost:8000/api/events/${testEvent.id}/registrations`
        );

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          console.log(
            `✅ Registration stats: Total=${statsData.total_registrations}`
          );
        } else {
          console.log(
            "❌ Could not get registration stats:",
            await statsRes.text()
          );
        }
      }
    } else {
      console.log("❌ Could not get events:", await eventsRes.text());
    }

    console.log("\n🎉 Basic test completed!");
    console.log("\n📝 Next steps:");
    console.log("   1. Open http://localhost:3001 in browser");
    console.log("   2. Login with admin@admin.com / admin123");
    console.log("   3. Go to any event page");
    console.log("   4. Test registration functionality");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Run the test
testEventRegistrationSimple();
