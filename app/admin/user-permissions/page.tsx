"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, User, Shield, CheckCircle, XCircle } from "lucide-react";

interface UserPermissionViewerProps {
  userId?: number;
  communityId?: number;
}

interface UserPermissions {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  communityId: number;
  community: {
    id: number;
    name: string;
  };
  role: {
    id: number;
    role: string;
    description: string;
  };
  permissions: string[];
}

const getCookieValue = (name: string): string => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift()!;
  return "";
};

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  await fetch("http://localhost:8000/sanctum/csrf-cookie", {
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

export function UserPermissionViewer({
  userId,
  communityId,
}: UserPermissionViewerProps) {
  const [userPermissions, setUserPermissions] = useState<UserPermissions[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchUserId, setSearchUserId] = useState(userId?.toString() || "");
  const [searchEmail, setSearchEmail] = useState("");

  // All available permissions for reference
  const allPermissions = [
    "view_community",
    "edit_community",
    "delete_community",
    "view_members",
    "approve_members",
    "reject_members",
    "remove_members",
    "assign_roles",
    "view_events",
    "create_events",
    "edit_events",
    "delete_events",
    "manage_registrations",
    "view_registrations",
    "approve_registrations",
    "reject_registrations",
    "view_attendance",
    "manage_attendance",
    "generate_codes",
    "view_reports",
    "manage_gallery",
    "moderate_content",
    "send_notifications",
    "manage_announcements",
    "view_audit_logs",
  ];

  const fetchUserPermissions = async (targetUserId?: number) => {
    setLoading(true);
    try {
      // If we have a specific user ID, we might need a different endpoint
      // For now, let's fetch current user permissions and simulate
      const response = await authenticatedFetch(
        "http://localhost:8000/api/user/permissions"
      );

      if (response.ok) {
        const data = await response.json();
        setUserPermissions(data.permissions || []);
      } else {
        console.error("Failed to fetch permissions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserPermissions(userId);
    }
  }, [userId]);

  const handleSearchByUserId = () => {
    if (searchUserId) {
      fetchUserPermissions(parseInt(searchUserId));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Kurucu":
        return "bg-purple-100 text-purple-800";
      case "Yönetici":
        return "bg-blue-100 text-blue-800";
      case "Moderatör":
        return "bg-green-100 text-green-800";
      case "Üye":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPermissionDescription = (permission: string) => {
    const descriptions: { [key: string]: string } = {
      view_community: "Topluluk görüntüleme",
      edit_community: "Topluluk düzenleme",
      delete_community: "Topluluk silme",
      view_members: "Üye görüntüleme",
      approve_members: "Üye onaylama",
      reject_members: "Üye reddetme",
      remove_members: "Üye çıkarma",
      assign_roles: "Rol atama",
      view_events: "Etkinlik görüntüleme",
      create_events: "Etkinlik oluşturma",
      edit_events: "Etkinlik düzenleme",
      delete_events: "Etkinlik silme",
      manage_registrations: "Kayıt yönetimi",
      view_registrations: "Kayıt görüntüleme",
      approve_registrations: "Kayıt onaylama",
      reject_registrations: "Kayıt reddetme",
      view_attendance: "Katılım görüntüleme",
      manage_attendance: "Katılım yönetimi",
      generate_codes: "Kod oluşturma",
      view_reports: "Rapor görüntüleme",
      manage_gallery: "Galeri yönetimi",
      moderate_content: "İçerik moderasyonu",
      send_notifications: "Bildirim gönderme",
      manage_announcements: "Duyuru yönetimi",
      view_audit_logs: "Denetim günlükleri görüntüleme",
    };
    return descriptions[permission] || permission;
  };

  return (
    <div className="space-y-6">
      {!userId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search User Permissions</span>
            </CardTitle>
            <CardDescription>
              Search for a user by ID or email to view their permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="userId">User ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="userId"
                    type="number"
                    placeholder="Enter user ID"
                    value={searchUserId}
                    onChange={(e) => setSearchUserId(e.target.value)}
                  />
                  <Button
                    onClick={handleSearchByUserId}
                    disabled={!searchUserId || loading}
                  >
                    {loading ? "Loading..." : "Search"}
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <Label htmlFor="email">Email (Future Feature)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userPermissions.length > 0 ? (
        <div className="space-y-4">
          {userPermissions.map((userPerm, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5" />
                    <span>User Permissions</span>
                  </div>
                  <Badge className={getRoleColor(userPerm.role.role)}>
                    {userPerm.role.role}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Permissions for {userPerm.community.name} (Community ID:{" "}
                  {userPerm.communityId})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">User Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">
                        {userPerm.user?.first_name} {userPerm.user?.last_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2">{userPerm.user?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <span className="ml-2">{userPerm.role.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Community:</span>
                      <span className="ml-2">{userPerm.community.name}</span>
                    </div>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>
                      Permissions ({userPerm.permissions.length}/
                      {allPermissions.length})
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allPermissions.map((permission) => {
                      const hasPermission =
                        userPerm.permissions.includes(permission);
                      return (
                        <div
                          key={permission}
                          className={`p-3 rounded-lg border ${
                            hasPermission
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {hasPermission ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${
                                  hasPermission
                                    ? "text-green-900"
                                    : "text-gray-500"
                                }`}
                              >
                                {permission}
                              </p>
                              <p
                                className={`text-xs truncate ${
                                  hasPermission
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {getPermissionDescription(permission)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Permission Summary
                  </h4>
                  <div className="text-sm text-blue-800">
                    <p>
                      • Total permissions: {userPerm.permissions.length} out of{" "}
                      {allPermissions.length}
                    </p>
                    <p>
                      • Role: {userPerm.role.role} - {userPerm.role.description}
                    </p>
                    <p>• Community: {userPerm.community.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No user permissions found</p>
              <p className="text-sm text-gray-400">
                Search for a user to view their permissions
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}

export default function UserPermissionViewerPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Permission Viewer</h1>
        <p className="text-gray-600">
          View detailed permissions for any user in the community
        </p>
      </div>
      <UserPermissionViewer />
    </div>
  );
}
