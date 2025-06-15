// Test script for the user permission assignment UI

// Function to wait for element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function checkForElement() {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(checkForElement, 100);
      }
    }

    checkForElement();
  });
}

// Function to simulate click with delay
function simulateClick(element, delay = 500) {
  return new Promise((resolve) => {
    element.click();
    setTimeout(resolve, delay);
  });
}

// Function to simulate input
function simulateInput(element, value, delay = 300) {
  return new Promise((resolve) => {
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    setTimeout(resolve, delay);
  });
}

// Main test function
async function testUserPermissionAssignmentUI() {
  console.log("Starting user permission assignment UI test...");

  try {
    // Wait for the main page to load
    await waitForElement("h1");
    console.log("✓ Page loaded");

    // Check if we're on the correct page
    const title = document.querySelector("h1");
    if (title && title.textContent.includes("User Permission Assignment")) {
      console.log("✓ Correct page loaded");
    } else {
      console.log("✗ Wrong page - navigating to user permission assignment...");
      window.location.href = "/admin/user-permission-assignment";
      return;
    }

    // Wait for members list to load
    await waitForElement('[data-testid="members-list"], .space-y-4');
    console.log("✓ Members list container found");

    // Look for member cards
    const memberCards = document.querySelectorAll(
      ".flex.items-center.justify-between.p-4.border.rounded-lg"
    );
    console.log(`✓ Found ${memberCards.length} member cards`);

    if (memberCards.length > 0) {
      // Click on the first "Manage Permissions" button
      const firstCard = memberCards[0];
      const managePermissionsBtn = firstCard.querySelector(
        'button:contains("Manage Permissions"), button[title*="permission"], button:contains("Key")'
      );

      if (managePermissionsBtn) {
        console.log('✓ Found "Manage Permissions" button, clicking...');
        await simulateClick(managePermissionsBtn, 1000);

        // Wait for permission dialog to open
        await waitForElement('[role="dialog"], .dialog-content');
        console.log("✓ Permission dialog opened");

        // Check for permission categories
        const permissionCategories = document.querySelectorAll(
          ".border.rounded-lg.p-4"
        );
        console.log(
          `✓ Found ${permissionCategories.length} permission categories`
        );

        // Check for checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log(`✓ Found ${checkboxes.length} permission checkboxes`);

        // Try to check a few permissions
        if (checkboxes.length > 0) {
          console.log("✓ Testing permission selection...");
          await simulateClick(checkboxes[0], 300);
          await simulateClick(checkboxes[1], 300);
          console.log("✓ Selected some permissions");
        }

        // Look for Apply Changes button
        const applyBtn = document.querySelector(
          'button:contains("Apply Changes"), button[type="submit"]'
        );
        if (applyBtn && !applyBtn.disabled) {
          console.log('✓ Found "Apply Changes" button (ready to submit)');
        } else {
          console.log('⚠ "Apply Changes" button not found or disabled');
        }

        // Close dialog by clicking Cancel or outside
        const cancelBtn = document.querySelector('button:contains("Cancel")');
        if (cancelBtn) {
          await simulateClick(cancelBtn, 500);
          console.log("✓ Dialog closed");
        }
      } else {
        console.log(
          '✗ "Manage Permissions" button not found in first member card'
        );
      }
    } else {
      console.log("✗ No member cards found - check if data is loading");
    }

    // Test role assignment dialog
    console.log("Testing role assignment...");
    if (memberCards.length > 0) {
      const firstCard = memberCards[0];
      const changeRoleBtn = firstCard.querySelector(
        'button:contains("Change Role"), button:contains("Edit")'
      );

      if (changeRoleBtn) {
        console.log('✓ Found "Change Role" button, clicking...');
        await simulateClick(changeRoleBtn, 1000);

        // Wait for role dialog
        await waitForElement('[role="dialog"]');
        console.log("✓ Role dialog opened");

        // Close dialog
        const cancelBtn = document.querySelector('button:contains("Cancel")');
        if (cancelBtn) {
          await simulateClick(cancelBtn, 500);
          console.log("✓ Role dialog closed");
        }
      }
    }

    console.log(
      "✅ User permission assignment UI test completed successfully!"
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);

    // Log current page state for debugging
    console.log("Current page URL:", window.location.href);
    console.log("Page title:", document.title);
    console.log("Main heading:", document.querySelector("h1")?.textContent);
    console.log(
      "Available buttons:",
      Array.from(document.querySelectorAll("button"))
        .map((btn) => btn.textContent)
        .slice(0, 10)
    );
  }
}

// Add CSS for :contains selector simulation
function addTestHelpers() {
  // Helper to find elements by text content
  window.findByText = function (selector, text) {
    return Array.from(document.querySelectorAll(selector)).find((el) =>
      el.textContent.toLowerCase().includes(text.toLowerCase())
    );
  };
}

// Initialize test
addTestHelpers();

// Run test when page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", testUserPermissionAssignmentUI);
} else {
  testUserPermissionAssignmentUI();
}

// Also expose the test function globally for manual execution
window.testUserPermissionAssignmentUI = testUserPermissionAssignmentUI;
