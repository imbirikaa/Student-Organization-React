'use client'

import { useAuth } from '@/app/context/auth-context'
import { usePermissions } from '@/app/context/permissions-context'
import { RequirePermission } from '@/components/RequirePermission'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Shield, Key, FileText, Calendar, CheckSquare, Settings, BarChart3, Eye } from 'lucide-react'
import Link from 'next/link'

interface AdminFeature {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  permission: string
  communitySpecific: boolean
}

export default function AdminNavigationPage() {
  const { user } = useAuth()
  const { getCurrentCommunityId, hasPermission } = usePermissions()
  
  const currentCommunityId = getCurrentCommunityId()

  const adminFeatures: AdminFeature[] = [
    {
      title: 'Community Applications',
      description: 'Review and manage community membership applications',
      href: '/admin/community-applications',
      icon: <Users className="w-6 h-6" />,
      permission: 'view_members',
      communitySpecific: true
    },
    {
      title: 'Role Management',
      description: 'Manage community roles and their basic permissions',
      href: '/admin/role-management',
      icon: <Shield className="w-6 h-6" />,
      permission: 'assign_roles',
      communitySpecific: true
    },
    {
      title: 'Role & Permission Management',
      description: 'Comprehensive role and permission management for communities',
      href: '/admin/role-permission-management',
      icon: <Settings className="w-6 h-6" />,
      permission: 'view_members',
      communitySpecific: true
    },
    {
      title: 'User Permission Assignment',
      description: 'Assign individual permissions to users beyond their roles',
      href: '/admin/user-permission-assignment',
      icon: <Key className="w-6 h-6" />,
      permission: 'assign_roles',
      communitySpecific: true
    },
    {
      title: 'User Permissions Viewer',
      description: 'View detailed permissions for any user in the system',
      href: '/admin/user-permissions',
      icon: <Eye className="w-6 h-6" />,
      permission: 'view_members',
      communitySpecific: true
    },
    {
      title: 'Event Registrations',
      description: 'Manage event registrations and approvals',
      href: '/admin/event-registrations',
      icon: <Calendar className="w-6 h-6" />,
      permission: 'view_registrations',
      communitySpecific: true
    },
    {
      title: 'Attendance Check-in',
      description: 'Manage event attendance and generate attendance codes',
      href: '/admin/attendance-check-in',
      icon: <CheckSquare className="w-6 h-6" />,
      permission: 'manage_attendance',
      communitySpecific: true
    },
    {
      title: 'Audit Logs',
      description: 'View system audit logs and activity history',
      href: '/admin/audit-logs',
      icon: <FileText className="w-6 h-6" />,
      permission: 'view_audit_logs',
      communitySpecific: true
    },
    {
      title: 'System Dashboard',
      description: 'View system-wide statistics and overview',
      href: '/admin',
      icon: <BarChart3 className="w-6 h-6" />,
      permission: 'view_community',
      communitySpecific: false
    }
  ]

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to access admin features.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600">
          Access all administrative functions and management tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature) => {          const hasAccess = feature.communitySpecific 
            ? (currentCommunityId ? hasPermission(currentCommunityId, feature.permission) : false)
            : true // For system-wide features, we'll check permissions on the page itself

          if (!hasAccess) {
            return null // Don't show features the user can't access
          }

          return (
            <Card key={feature.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    {feature.communitySpecific && (
                      <span className="text-xs text-gray-500">
                        Community-specific
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {feature.description}
                </CardDescription>
                <Link href={feature.href}>
                  <Button className="w-full">
                    Access Feature
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {currentCommunityId && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Current Community Context:</strong> Community {currentCommunityId}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Community-specific features will operate within this context.
          </p>
        </div>
      )}
    </div>
  )
}
