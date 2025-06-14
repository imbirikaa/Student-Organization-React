"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AuthTestPage() {
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const getCookieValue = (name: string): string => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()!.split(";").shift()!;
      return decodeURIComponent(cookieValue);
    }
    return "";
  };

  const testCSRF = async () => {
    try {
      addResult("🧪 Testing CSRF cookie...");
      const res = await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });
      addResult(`CSRF cookie response: ${res.status}`);

      const token = getCookieValue("XSRF-TOKEN");
      addResult(`CSRF token: ${token ? "Found" : "Not found"}`);
      if (token) {
        addResult(`Token length: ${token.length}`);
      }
    } catch (error) {
      addResult(`❌ CSRF test failed: ${error}`);
    }
  };

  const testAuth = async () => {
    try {
      addResult("🔑 Testing /api/me...");
      const res = await fetch("http://localhost:8000/api/me", {
        credentials: "include",
      });
      addResult(`Auth response: ${res.status}`);

      if (res.ok) {
        const data = await res.json();
        addResult(`✅ User: ${data.user?.email || "Unknown"}`);
        addResult(`Roles: ${data.roles?.join(", ") || "None"}`);
      } else {
        addResult(`❌ Auth failed: ${await res.text()}`);
      }
    } catch (error) {
      addResult(`❌ Auth test failed: ${error}`);
    }
  };

  const testRegistrationCheck = async () => {
    try {
      addResult("📝 Testing registration check...");
      const res = await fetch(
        "http://localhost:8000/api/events/2/check-registration",
        {
          credentials: "include",
        }
      );
      addResult(`Registration check response: ${res.status}`);

      if (res.ok) {
        const data = await res.json();
        addResult(`✅ Registration status: ${data.registered}`);
      } else {
        addResult(`❌ Registration check failed: ${await res.text()}`);
      }
    } catch (error) {
      addResult(`❌ Registration check failed: ${error}`);
    }
  };

  const testEventRegistration = async () => {
    try {
      addResult("🎯 Testing event registration...");

      // Get CSRF token first
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const token = getCookieValue("XSRF-TOKEN");
      addResult(`Using CSRF token: ${token ? "Yes" : "No"}`);

      const res = await fetch("http://localhost:8000/api/events/2/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": token,
          "X-CSRF-TOKEN": token,
        },
      });

      addResult(`Registration response: ${res.status}`);

      const data = await res.json();
      if (res.ok) {
        addResult(`✅ Registration success: ${data.message}`);
      } else {
        addResult(`❌ Registration failed: ${data.message}`);
      }
    } catch (error) {
      addResult(`❌ Event registration failed: ${error}`);
    }
  };

  const clearResults = () => setResults([]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Authentication Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Button onClick={testCSRF} variant="outline">
          Test CSRF Cookie
        </Button>
        <Button onClick={testAuth} variant="outline">
          Test Authentication
        </Button>
        <Button onClick={testRegistrationCheck} variant="outline">
          Test Registration Check
        </Button>
        <Button onClick={testEventRegistration} variant="outline">
          Test Event Registration
        </Button>
        <Button onClick={clearResults} variant="destructive">
          Clear Results
        </Button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-gray-500">
              No tests run yet. Click a button above to start testing.
            </p>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className="text-sm font-mono bg-white dark:bg-gray-700 p-2 rounded"
              >
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Make sure you're logged in first (go to /login)</li>
          <li>Test CSRF Cookie to verify the token setup</li>
          <li>Test Authentication to verify you're logged in</li>
          <li>Test Registration Check to verify the endpoint works</li>
          <li>Test Event Registration to verify the registration process</li>
        </ol>
      </div>
    </div>
  );
}
