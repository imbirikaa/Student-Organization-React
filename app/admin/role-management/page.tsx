"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { usePermissions } from "@/app/context/permissions-context";
import { RequirePermission, RequireRole } from "@/components/RequirePermission";
import { toast } from "react-hot-toast";
import {
  Shield,
  Users,
  Settings,
  UserCheck,
  UserMinus,
  UserPlus,
  Edit3,
  Save,
  X,
  Crown,
  Star,
  Eye,
} from "lucide-react";
import { LoadingSpinner, PageLoader } from "@/components/ui/loading";

interface Community {
  id: number;
  community: string;
  logo?: string;
}

interface Role {
  id: number;
  role: string;
  description: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Member {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  role: {
    id: number;
    name: string;
  };
  joined_date: string;
  status: string;
}

const getCookieValue = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()!.split(";").shift()!;
    return decodeURIComponent(cookieValue);
  }
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

export default function RoleManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const { hasPermission, getUserRole, refreshPermissions } = usePermissions();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [newRoleId, setNewRoleId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCommunities();
      fetchRoles();
      fetchPermissions();
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (selectedCommunityId) {
      fetchMembers();
    }
  }, [selectedCommunityId]);

  const fetchCommunities = async () => {
    try {
      const response = await authenticatedFetch("http://localhost:8000/api/user/communities");
      if (response.ok) {
        const data = await response.json();
        setCommunities(data.communities || []);
        if (data.communities?.length > 0) {
          setSelectedCommunityId(data.communities[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  const fetchMembers = async () => {
    if (!selectedCommunityId) return;
    
    try {
      setLoading(true);
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members`
      );
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch community members");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await authenticatedFetch("http://localhost:8000/api/community-roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await authenticatedFetch("http://localhost:8000/api/permissions");
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions || []);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleRoleChange = async (memberId: number) => {
    if (!newRoleId || !selectedCommunityId) return;

    try {
      setLoading(true);
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role_id: newRoleId }),
        }
      );

      if (response.ok) {
        toast.success("Role updated successfully");
        await fetchMembers();
        await refreshPermissions();
        setEditingMember(null);
        setNewRoleId(null);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from this community?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        toast.success("Member removed successfully");
        await fetchMembers();
        await refreshPermissions();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'Kurucu':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'Yönetici':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'Moderatör':
        return <Star className="h-4 w-4 text-purple-500" />;
      case 'Üye':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'Kurucu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Yönetici':
        return 'bg-blue-100 text-blue-800';
      case 'Moderatör':
        return 'bg-purple-100 text-purple-800';
      case 'Üye':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return <PageLoader />;
  }

  if (!selectedCommunityId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Communities</h1>
          <p className="text-gray-600">You need to be a member of a community to manage roles.</p>
        </div>
      </div>
    );
  }

  return (
    <RequirePermission 
      communityId={selectedCommunityId} 
      permission="assign_roles"
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">
              You need role assignment permissions in this community.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Current role: {getUserRole(selectedCommunityId) || 'None'}
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Role Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage community member roles and permissions
            </p>
          </div>

          {/* Community Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Community
            </label>
            <select
              value={selectedCommunityId || ""}
              onChange={(e) => setSelectedCommunityId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.community}
                </option>
              ))}
            </select>
          </div>

          {/* Members List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Community Members
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {members.length} total members
              </p>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member) => (
                  <div key={member.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                            {member.user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.user.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.user.email}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Joined: {new Date(member.joined_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Current Role */}
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(member.role.name)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role.name)}`}>
                            {member.role.name}
                          </span>
                        </div>

                        {/* Role Management */}
                        {editingMember === member.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={newRoleId || ""}
                              onChange={(e) => setNewRoleId(Number(e.target.value))}
                              className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Select role...</option>
                              {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.role}
                                </option>
                              ))}
                            </select>
                            <Button
                              onClick={() => handleRoleChange(member.id)}
                              size="sm"
                              disabled={!newRoleId}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingMember(null);
                                setNewRoleId(null);
                              }}
                              size="sm"
                              variant="outline"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <RequirePermission
                              communityId={selectedCommunityId}
                              permission="assign_roles"
                            >
                              <Button
                                onClick={() => setEditingMember(member.id)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </RequirePermission>
                            
                            <RequirePermission
                              communityId={selectedCommunityId}
                              permission="remove_members"
                            >
                              <Button
                                onClick={() => handleRemoveMember(member.id, member.user.name)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:border-red-300"
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </RequirePermission>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
