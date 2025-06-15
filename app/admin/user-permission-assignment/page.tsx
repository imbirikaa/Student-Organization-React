'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/auth-context'
import { usePermissions } from '@/app/context/permissions-context'
import { RequirePermission } from '@/components/RequirePermission'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Search, UserPlus, Shield, Users, Settings, Trash2, Edit, Plus, Minus, Key } from 'lucide-react'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  nickname?: string
}

interface CommunityMember {
  id: number
  user: User
  community_id: number
  role: {
    id: number
    role: string
    description: string
  }
  status: string
  permissions: string[]
  direct_permissions?: string[]
}

interface Permission {
  name: string
  description: string
  category?: string
}

const getCookieValue = (name: string): string => {
  if (typeof document === 'undefined') return ''
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return ''
}

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  await fetch('http://localhost:8000/sanctum/csrf-cookie', {
    credentials: 'include',
  })

  const token = getCookieValue('XSRF-TOKEN')

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-XSRF-TOKEN': token,
      ...options.headers,
    },
  })
}

export default function UserPermissionAssignmentPage() {
  const { user } = useAuth()
  const { getCurrentCommunityId, hasPermission } = usePermissions()
  
  const [selectedCommunityId, setSelectedCommunityId] = useState<number>(1) // Default to community 1
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null)
  const [newRoleId, setNewRoleId] = useState('')
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [permissionsToRemove, setPermissionsToRemove] = useState<string[]>([])
  const [userDirectPermissions, setUserDirectPermissions] = useState<string[]>([])

  // Available roles
  const availableRoles = [
    { id: 1, role: 'Kurucu', description: 'Topluluğun kurucusu.' },
    { id: 2, role: 'Yönetici', description: 'Topluluk yöneticisi.' },
    { id: 3, role: 'Moderatör', description: 'İçerik moderatörü.' },
    { id: 4, role: 'Üye', description: 'Normal üye.' }
  ]

  // Available permissions organized by category
  const availablePermissions: { [key: string]: Permission[] } = {
    'Community Management': [
      { name: 'view_community', description: 'Topluluk görüntüleme' },
      { name: 'edit_community', description: 'Topluluk düzenleme' },
      { name: 'delete_community', description: 'Topluluk silme' },
    ],
    'Member Management': [
      { name: 'view_members', description: 'Üye görüntüleme' },
      { name: 'approve_members', description: 'Üye onaylama' },
      { name: 'reject_members', description: 'Üye reddetme' },
      { name: 'remove_members', description: 'Üye çıkarma' },
      { name: 'assign_roles', description: 'Rol atama' },
    ],
    'Event Management': [
      { name: 'view_events', description: 'Etkinlik görüntüleme' },
      { name: 'create_events', description: 'Etkinlik oluşturma' },
      { name: 'edit_events', description: 'Etkinlik düzenleme' },
      { name: 'delete_events', description: 'Etkinlik silme' },
    ],
    'Registration Management': [
      { name: 'manage_registrations', description: 'Kayıt yönetimi' },
      { name: 'view_registrations', description: 'Kayıt görüntüleme' },
      { name: 'approve_registrations', description: 'Kayıt onaylama' },
      { name: 'reject_registrations', description: 'Kayıt reddetme' },
    ],
    'Attendance Management': [
      { name: 'view_attendance', description: 'Katılım görüntüleme' },
      { name: 'manage_attendance', description: 'Katılım yönetimi' },
      { name: 'generate_codes', description: 'Kod oluşturma' },
    ],
    'Content & Communications': [
      { name: 'view_reports', description: 'Rapor görüntüleme' },
      { name: 'manage_gallery', description: 'Galeri yönetimi' },
      { name: 'moderate_content', description: 'İçerik moderasyonu' },
      { name: 'send_notifications', description: 'Bildirim gönderme' },
      { name: 'manage_announcements', description: 'Duyuru yönetimi' },
    ],
    'System': [
      { name: 'view_audit_logs', description: 'Denetim günlükleri görüntüleme' },
    ]
  }

  useEffect(() => {
    if (selectedCommunityId) {
      fetchMembers()
    }
  }, [selectedCommunityId])

  const fetchMembers = async () => {
    if (!hasPermission(selectedCommunityId, 'view_members')) {
      console.error('No permission to view members')
      return
    }

    setLoading(true)
    try {
      const response = await authenticatedFetch(`http://localhost:8000/api/communities/${selectedCommunityId}/members`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
      } else {
        console.error('Failed to fetch members:', response.status)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDirectPermissions = async (memberId: number) => {
    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}/direct-permissions`
      )
      if (response.ok) {
        const data = await response.json()
        setUserDirectPermissions(data.user.direct_permissions || [])
      } else {
        console.error('Failed to fetch user direct permissions')
        setUserDirectPermissions([])
      }
    } catch (error) {
      console.error('Error fetching user direct permissions:', error)
      setUserDirectPermissions([])
    }
  }

  const assignRole = async (memberId: number, roleId: number) => {
    if (!hasPermission(selectedCommunityId, 'assign_roles')) {
      alert('You do not have permission to assign roles')
      return
    }

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}/role`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role_id: roleId }),
        }
      )

      if (response.ok) {
        await fetchMembers() // Refresh the members list
        setIsRoleDialogOpen(false)
        setSelectedMember(null)
        alert('Role assigned successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to assign role: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error assigning role:', error)
      alert('Error assigning role')
    }
  }

  const assignPermissions = async (memberId: number, permissions: string[]) => {
    if (!hasPermission(selectedCommunityId, 'assign_roles')) {
      alert('You do not have permission to assign permissions')
      return
    }

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}/permissions`,
        {
          method: 'POST',
          body: JSON.stringify({ permissions }),
        }
      )

      if (response.ok) {
        await fetchMembers() // Refresh the members list
        await fetchUserDirectPermissions(memberId) // Refresh direct permissions
        alert('Permissions assigned successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to assign permissions: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error assigning permissions:', error)
      alert('Error assigning permissions')
    }
  }

  const removePermissions = async (memberId: number, permissions: string[]) => {
    if (!hasPermission(selectedCommunityId, 'assign_roles')) {
      alert('You do not have permission to remove permissions')
      return
    }

    try {
      const response = await authenticatedFetch(
        `http://localhost:8000/api/communities/${selectedCommunityId}/members/${memberId}/permissions`,
        {
          method: 'DELETE',
          body: JSON.stringify({ permissions }),
        }
      )

      if (response.ok) {
        await fetchMembers() // Refresh the members list
        await fetchUserDirectPermissions(memberId) // Refresh direct permissions
        alert('Permissions removed successfully!')
      } else {
        const errorData = await response.json()
        alert(`Failed to remove permissions: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error removing permissions:', error)
      alert('Error removing permissions')
    }
  }

  const handleOpenPermissionDialog = async (member: CommunityMember) => {
    setSelectedMember(member)
    await fetchUserDirectPermissions(member.id)
    setSelectedPermissions([])
    setPermissionsToRemove([])
    setIsPermissionDialogOpen(true)
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev.filter(p => p !== permission), permission])
      setPermissionsToRemove(prev => prev.filter(p => p !== permission))
    } else {
      setSelectedPermissions(prev => prev.filter(p => p !== permission))
      if (userDirectPermissions.includes(permission)) {
        setPermissionsToRemove(prev => [...prev.filter(p => p !== permission), permission])
      }
    }
  }

  const applyPermissionChanges = async () => {
    if (!selectedMember) return

    try {
      // First, assign new permissions
      if (selectedPermissions.length > 0) {
        await assignPermissions(selectedMember.id, selectedPermissions)
      }

      // Then, remove permissions
      if (permissionsToRemove.length > 0) {
        await removePermissions(selectedMember.id, permissionsToRemove)
      }

      setIsPermissionDialogOpen(false)
      setSelectedMember(null)
      setSelectedPermissions([])
      setPermissionsToRemove([])
    } catch (error) {
      console.error('Error applying permission changes:', error)
    }
  }

  const filteredMembers = members.filter(member =>
    member.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Kurucu': return 'bg-purple-100 text-purple-800'
      case 'Yönetici': return 'bg-blue-100 text-blue-800'
      case 'Moderatör': return 'bg-green-100 text-green-800'
      case 'Üye': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access user permission management.</p>
      </div>
    )
  }

  return (
    <RequirePermission communityId={selectedCommunityId} permission="view_members">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Permission Assignment</h1>
            <p className="text-gray-600">Assign roles and individual permissions to community members</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedCommunityId.toString()} onValueChange={(value) => setSelectedCommunityId(parseInt(value))}>
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

        <Card>
          <CardHeader>
            <CardTitle>Community Members</CardTitle>
            <CardDescription>
              Manage roles and permissions for members in Community {selectedCommunityId}
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
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>

            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {member.user.first_name[0]}{member.user.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{member.user.first_name} {member.user.last_name}</h3>
                      <p className="text-sm text-gray-600">{member.user.email}</p>
                    </div>
                    <Badge className={getRoleColor(member.role.role)}>
                      {member.role.role}
                    </Badge>
                    <Badge variant="outline">
                      {member.status}
                    </Badge>
                    {member.permissions && member.permissions.length > 0 && (
                      <Badge variant="secondary">
                        {member.permissions.length} permissions
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RequirePermission communityId={selectedCommunityId} permission="assign_roles">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member)
                          setIsRoleDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Change Role
                      </Button>
                    </RequirePermission>
                    
                    <RequirePermission communityId={selectedCommunityId} permission="assign_roles">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenPermissionDialog(member)}
                      >
                        <Key className="w-4 h-4 mr-1" />
                        Manage Permissions
                      </Button>
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

        {/* Role Assignment Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Member Role</DialogTitle>
              <DialogDescription>
                Assign a new role to {selectedMember?.user.first_name} {selectedMember?.user.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Role</Label>
                <p className="text-sm text-gray-600">{selectedMember?.role.role}</p>
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
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedMember && assignRole(selectedMember.id, parseInt(newRoleId))}
                disabled={!newRoleId}
              >
                Assign Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Permission Assignment Dialog */}
        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
              <DialogDescription>
                Assign or remove individual permissions for {selectedMember?.user.first_name} {selectedMember?.user.last_name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Current Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Current Status</h4>
                <div className="flex items-center space-x-4">
                  <Badge className={selectedMember ? getRoleColor(selectedMember.role.role) : ''}>
                    {selectedMember?.role.role}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Direct permissions: {userDirectPermissions.length}
                  </span>
                </div>
              </div>

              {/* Permission Categories */}
              <div className="space-y-4">
                <h4 className="font-medium">Available Permissions</h4>
                {Object.entries(availablePermissions).map(([category, permissions]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h5 className="font-medium mb-3 text-sm text-gray-700">{category}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => {
                        const isCurrentlyAssigned = userDirectPermissions.includes(permission.name)
                        const isSelected = selectedPermissions.includes(permission.name)
                        const willBeRemoved = permissionsToRemove.includes(permission.name)
                        const finalState = isCurrentlyAssigned ? !willBeRemoved : isSelected

                        return (
                          <div key={permission.name} className="flex items-start space-x-3">
                            <Checkbox
                              id={permission.name}
                              checked={finalState}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.name, checked as boolean)
                              }
                            />
                            <div className="flex-1">
                              <Label htmlFor={permission.name} className="text-sm font-medium">
                                {permission.name}
                              </Label>
                              <p className="text-xs text-gray-600">{permission.description}</p>
                              {isCurrentlyAssigned && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  Currently assigned
                                </Badge>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {(selectedPermissions.length > 0 || permissionsToRemove.length > 0) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Changes to apply:</h5>
                  {selectedPermissions.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-700">To add: </span>
                      <span className="text-sm">{selectedPermissions.join(', ')}</span>
                    </div>
                  )}
                  {permissionsToRemove.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-red-700">To remove: </span>
                      <span className="text-sm">{permissionsToRemove.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={applyPermissionChanges}
                disabled={selectedPermissions.length === 0 && permissionsToRemove.length === 0}
              >
                Apply Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequirePermission>
  )
}
