"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth-context";
import { usePermissions } from "@/app/context/permissions-context";
import { RequirePermission } from "@/components/RequirePermission";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  UserPlus,
  Shield,
  Users,
  Settings,
  Trash2,
  Edit,
} from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  nickname?: string;
}

interface CommunityMember {
  id: number;
  user: User;
  community_id: number;
  role: {
    id: number;
    role: string;
    description: string;
  };
  status: string;
  permissions: string[];
}

interface CommunityRole {
  id: number;
  role: string;
  description: string;
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

export default function RolePermissionManagementPage() {
  const { user } = useAuth();
  const { getCurrentCommunityId, hasPermission } = usePermissions();

  const [selectedCommunityId, setSelectedCommunityId] = useState<number>(1); // Default to community 1
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [roles, setRoles] = useState<CommunityRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(
    null
  );
  const [newRoleId, setNewRoleId] = useState("");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  // Mock roles data - in a real app, fetch from API
  const availableRoles = [
    { id: 1, role: "Kurucu", description: "Topluluğun kurucusu." },
    { id: 2, role: "Yönetici", description: "Topluluk yöneticisi." },
    { id: 3, role: "Moderatör", description: "İçerik moderatörü." },
    { id: 4, role: "Üye", description: "Normal üye." },
  ];

  // Available permissions
  const availablePermissions = [
    { name: "view_community", description: "Topluluk görüntüleme" },
    { name: "edit_community", description: "Topluluk düzenleme" },
    { name: "delete_community", description: "Topluluk silme" },
    { name: "view_members", description: "Üye görüntüleme" },
    { name: "approve_members", description: "Üye onaylama" },
    { name: "reject_members", description: "Üye reddetme" },
    { name: "remove_members", description: "Üye çıkarma" },
    { name: "assign_roles", description: "Rol atama" },
    { name: "view_events", description: "Etkinlik görüntüleme" },
    { name: "create_events", description: "Etkinlik oluşturma" },
    { name: "edit_events", description: "Etkinlik düzenleme" },
    { name: "delete_events", description: "Etkinlik silme" },
    { name: "manage_registrations", description: "Kayıt yönetimi" },
    { name: "view_registrations", description: "Kayıt görüntüleme" },
    { name: "approve_registrations", description: "Kayıt onaylama" },
    { name: "reject_registrations", description: "Kayıt reddetme" },
    { name: "view_attendance", description: "Katılım görüntüleme" },
    { name: "manage_attendance", description: "Katılım yönetimi" },
    { name: "generate_codes", description: "Kod oluşturma" },
    { name: "view_reports", description: "Rapor görüntüleme" },
    { name: "manage_gallery", description: "Galeri yönetimi" },
    { name: "moderate_content", description: "İçerik moderasyonu" },
    { name: "send_notifications", description: "Bildirim gönderme" },
    { name: "manage_announcements", description: "Duyuru yönetimi" },
    { name: "view_audit_logs", description: "Denetim günlükleri görüntüleme" },
  ];

  useEffect(() => {
    if (selectedCommunityId) {
      fetchMembers();
    }
  }, [selectedCommunityId]);

  const fetchMembers = async () => {
    if (!hasPermission(selectedCommunityId, "view_members")) {
      console.error("No permission to view members");
      return;
    }

    setLoading(true);
    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members`
      );
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      } else {
        console.error("Failed to fetch members:", response.status);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (memberId: number, roleId: number) => {
    if (!hasPermission(selectedCommunityId, "assign_roles")) {
      alert("You do not have permission to assign roles");
      return;
    }

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({ role_id: roleId }),
        }
      );

      if (response.ok) {
        await fetchMembers(); // Refresh the members list
        setIsRoleDialogOpen(false);
        setSelectedMember(null);
        alert("Role assigned successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to assign role: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Error assigning role");
    }
  };

  const removeMember = async (memberId: number) => {
    if (!hasPermission(selectedCommunityId, "remove_members")) {
      alert("You do not have permission to remove members");
      return;
    }

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchMembers(); // Refresh the members list
        alert("Member removed successfully!");
      } else {
        const errorData = await response.json();
        alert(
          `Failed to remove member: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Error removing member");
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access role management.</p>
      </div>
    );
  }

  return (
    <RequirePermission
      communityId={selectedCommunityId}
      permission="view_members"
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Role & Permission Management</h1>
            <p className="text-gray-600">
              Manage community members, roles, and permissions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={selectedCommunityId.toString()}
              onValueChange={(value) => setSelectedCommunityId(parseInt(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Community 1</SelectItem>
                <SelectItem value="2">Community 2</SelectItem>
                <SelectItem value="3">Community 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList>
            <TabsTrigger
              value="members"
              className="flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span>Members</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Permissions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Members</CardTitle>
                <CardDescription>
                  View and manage member roles in Community{" "}
                  {selectedCommunityId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={fetchMembers} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {member.user.first_name[0]}
                            {member.user.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {member.user.first_name} {member.user.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {member.user.email}
                          </p>
                        </div>
                        <Badge className={getRoleColor(member.role.role)}>
                          {member.role.role}
                        </Badge>
                        <Badge variant="outline">{member.status}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RequirePermission
                          communityId={selectedCommunityId}
                          permission="assign_roles"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsRoleDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Change Role
                          </Button>
                        </RequirePermission>

                        <RequirePermission
                          communityId={selectedCommunityId}
                          permission="remove_members"
                        >
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Member
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove{" "}
                                  {member.user.first_name}{" "}
                                  {member.user.last_name} from this community?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeMember(member.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </RequirePermission>
                      </div>
                    </div>
                  ))}

                  {filteredMembers.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      No members found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Roles</CardTitle>
                <CardDescription>
                  View available roles and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableRoles.map((role) => (
                    <div key={role.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getRoleColor(role.role)}>
                          {role.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {role.description}
                      </p>
                      <div className="text-sm">
                        <span className="font-medium">
                          Example permissions:{" "}
                        </span>
                        <span className="text-gray-600">
                          {role.role === "Kurucu" && "All permissions"}
                          {role.role === "Yönetici" &&
                            "Manage events, members, content moderation"}
                          {role.role === "Moderatör" &&
                            "Content moderation, basic member management"}
                          {role.role === "Üye" &&
                            "View community, participate in events"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Permissions</CardTitle>
                <CardDescription>
                  Complete list of permissions in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission.name}
                      className="p-3 border rounded-lg"
                    >
                      <h4 className="font-medium text-sm">{permission.name}</h4>
                      <p className="text-xs text-gray-600">
                        {permission.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Role Assignment Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Member Role</DialogTitle>
              <DialogDescription>
                Assign a new role to {selectedMember?.user.first_name}{" "}
                {selectedMember?.user.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Role</Label>
                <p className="text-sm text-gray-600">
                  {selectedMember?.role.role}
                </p>
              </div>
              <div>
                <Label htmlFor="newRole">New Role</Label>
                <Select value={newRoleId} onValueChange={setNewRoleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.role} - {role.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedMember &&
                  assignRole(selectedMember.id, parseInt(newRoleId))
                }
                disabled={!newRoleId}
              >
                Assign Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequirePermission>
  );
}
