// Test script for community application admin workflow
const API_BASE = "http://localhost:8000";

// Function to get CSRF token
async function getCSRFToken() {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: "include",
    method: "GET",
  });
}

// Function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return "";
}

// Authenticated fetch with CSRF
async function authenticatedFetch(url, options = {}) {
  await getCSRFToken();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

// Test functions
window.testAdminWorkflow = {
  // Test getting pending applications
  async getPendingApplications() {
    console.log("Testing: Get pending applications...");
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/api/admin/community-applications`
      );
      const data = await response.json();
      console.log("✅ Success:", data);
      return data;
    } catch (error) {
      console.error("❌ Error:", error);
    }
  },

  // Test approving an application
  async approveApplication(applicationId) {
    if (!applicationId) {
      console.log("❌ Please provide an application ID");
      return;
    }

    console.log(`Testing: Approve application ${applicationId}...`);
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/api/admin/applications/${applicationId}/approve`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log("✅ Success:", data);
      return data;
    } catch (error) {
      console.error("❌ Error:", error);
    }
  },

  // Test rejecting an application
  async rejectApplication(applicationId, reason = "Test rejection") {
    if (!applicationId) {
      console.log("❌ Please provide an application ID");
      return;
    }

    console.log(`Testing: Reject application ${applicationId}...`);
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/api/admin/applications/${applicationId}/reject`,
        {
          method: "POST",
          body: JSON.stringify({ reason }),
        }
      );
      const data = await response.json();
      console.log("✅ Success:", data);
      return data;
    } catch (error) {
      console.error("❌ Error:", error);
    }
  },

  // Test getting applications for a specific community
  async getCommunityApplications(communityId) {
    if (!communityId) {
      console.log("❌ Please provide a community ID");
      return;
    }

    console.log(`Testing: Get applications for community ${communityId}...`);
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/api/admin/communities/${communityId}/applications`
      );
      const data = await response.json();
      console.log("✅ Success:", data);
      return data;
    } catch (error) {
      console.error("❌ Error:", error);
    }
  },

  // Test creating a new application (as a regular user)
  async createApplication(communityId) {
    if (!communityId) {
      console.log("❌ Please provide a community ID");
      return;
    }

    console.log(`Testing: Create application for community ${communityId}...`);
    try {
      const response = await authenticatedFetch(
        `${API_BASE}/api/communities/${communityId}/apply`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log("✅ Success:", data);
      return data;
    } catch (error) {
      console.error("❌ Error:", error);
    }
  },

  // Run complete workflow test
  async runCompleteTest() {
    console.log("🚀 Starting complete admin workflow test...\n");

    // Step 1: Get initial pending applications
    console.log("1. Getting initial pending applications...");
    const initialApps = await this.getPendingApplications();

    if (!initialApps?.applications || initialApps.applications.length === 0) {
      console.log(
        "ℹ️ No pending applications found. The test can still verify the API endpoints work."
      );
      return;
    }

    const firstApp = initialApps.applications[0];
    console.log(
      `\n2. Found application ID ${firstApp.id} from user ${firstApp.user.name}`
    );

    // Step 2: Test approval (you may want to skip this in real testing)
    // console.log('\n3. Testing approval...');
    // await this.approveApplication(firstApp.id);

    // Step 3: Get updated applications
    console.log("\n3. Getting updated applications...");
    await this.getPendingApplications();

    console.log("\n✅ Complete workflow test finished!");
  },
};

console.log("🎯 Admin workflow test functions loaded!");
console.log("Usage:");
console.log("- testAdminWorkflow.getPendingApplications()");
console.log("- testAdminWorkflow.approveApplication(id)");
console.log("- testAdminWorkflow.rejectApplication(id, reason)");
console.log("- testAdminWorkflow.getCommunityApplications(communityId)");
console.log("- testAdminWorkflow.createApplication(communityId)");
console.log("- testAdminWorkflow.runCompleteTest()");
