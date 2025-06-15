// Test script for Community Application Management
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

const testCommunityApplicationWorkflow = async () => {
  console.log("🏢 Testing Community Application Management Workflow...\n");

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

    // 2. Get all communities (to test application to one)
    console.log("\n2️⃣ Getting available communities...");
    const communitiesRes = await fetch(`${API_BASE}/api/communities`);

    if (!communitiesRes.ok) {
      console.log("❌ Failed to get communities");
      return;
    }

    const communities = await communitiesRes.json();
    console.log(
      `✅ Found ${
        communities.data?.length || communities.length || 0
      } communities`
    );

    if (!communities.data?.length && !communities.length) {
      console.log("   No communities found to test with");
      return;
    }

    const testCommunity = communities.data?.[0] || communities[0];
    console.log(
      `   Using community: ${
        testCommunity.community || testCommunity.name
      } (ID: ${testCommunity.id})`
    );

    // 3. Test community application (might fail if already applied)
    console.log("\n3️⃣ Testing community application...");
    try {
      const applyRes = await authenticatedFetch(
        `${API_BASE}/api/communities/${testCommunity.id}/apply`,
        {
          method: "POST",
        }
      );

      if (applyRes.ok) {
        const applyData = await applyRes.json();
        console.log("✅ Application submitted successfully");
        console.log(`   Message: ${applyData.message}`);
      } else {
        const errorData = await applyRes.json();
        console.log(`ℹ️ Application response: ${errorData.message}`);
      }
    } catch (error) {
      console.log(`ℹ️ Application test: ${error.message}`);
    }

    // 4. Test getting pending applications (admin only)
    console.log("\n4️⃣ Testing admin - get pending applications...");
    const pendingRes = await authenticatedFetch(
      `${API_BASE}/api/admin/community-applications`
    );

    if (pendingRes.ok) {
      const pendingData = await pendingRes.json();
      console.log(`✅ Admin access successful`);
      console.log(
        `   Total pending applications: ${pendingData.total_pending || 0}`
      );

      if (pendingData.applications?.length > 0) {
        console.log("   Sample applications:");
        pendingData.applications.slice(0, 3).forEach((app, index) => {
          console.log(
            `     ${index + 1}. ${app.user.name} → ${app.community.name} (${
              app.status
            })`
          );
        });

        // 5. Test approving an application
        const sampleApp = pendingData.applications[0];
        console.log(
          `\n5️⃣ Testing application approval for application ID: ${sampleApp.id}...`
        );

        const approveRes = await authenticatedFetch(
          `${API_BASE}/api/admin/applications/${sampleApp.id}/approve`,
          {
            method: "POST",
          }
        );

        if (approveRes.ok) {
          const approveData = await approveRes.json();
          console.log("✅ Application approved successfully");
          console.log(`   Message: ${approveData.message}`);
        } else {
          const errorData = await approveRes.json();
          console.log(`❌ Approval failed: ${errorData.message}`);
        }
      } else {
        console.log("   No pending applications to test approval with");
      }
    } else {
      const errorData = await pendingRes.json();
      console.log(`❌ Admin access failed: ${errorData.message}`);
    }

    // 6. Test getting applications for a specific community
    console.log("\n6️⃣ Testing community-specific applications...");
    const communityAppsRes = await authenticatedFetch(
      `${API_BASE}/api/admin/communities/${testCommunity.id}/applications`
    );

    if (communityAppsRes.ok) {
      const communityAppsData = await communityAppsRes.json();
      console.log(`✅ Community applications retrieved`);
      console.log(`   Community: ${communityAppsData.community}`);
      console.log(`   Pending: ${communityAppsData.total_pending || 0}`);
    } else {
      const errorData = await communityAppsRes.json();
      console.log(`❌ Community applications failed: ${errorData.message}`);
    }

    console.log("\n🎉 Community Application Management test completed!");
    console.log("\n📝 Next steps to test manually:");
    console.log(
      "   1. Go to http://localhost:3000/admin/community-applications"
    );
    console.log("   2. View pending applications");
    console.log("   3. Test approve/reject functionality");
    console.log("   4. Check notification system");
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }
};

// Run the test
testCommunityApplicationWorkflow();
