"use client";

import React from 'react';
import { usePermissions } from '@/app/context/permissions-context';

interface RequirePermissionProps {
  communityId: number;
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  role?: 'Kurucu' | 'Yönetici' | 'Moderatör' | 'Üye';
}

interface RequireRoleProps {
  communityId: number;
  role: 'Kurucu' | 'Yönetici' | 'Moderatör' | 'Üye' | 'admin' | 'founder' | 'moderator';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequirePermission({ 
  communityId, 
  permission, 
  children, 
  fallback = null,
  role 
}: RequirePermissionProps) {
  const { hasPermission, getUserRole, loading } = usePermissions();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>;
  }

  const hasRequiredPermission = hasPermission(communityId, permission);
  const userRole = getUserRole(communityId);
  
  // If role is specified, check both permission and role
  if (role && userRole !== role) {
    return <>{fallback}</>;
  }

  if (!hasRequiredPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function RequireRole({ 
  communityId, 
  role, 
  children, 
  fallback = null 
}: RequireRoleProps) {
  const { getUserRole, isAdmin, isFounder, isModerator, loading } = usePermissions();

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>;
  }

  let hasRole = false;

  switch (role) {
    case 'Kurucu':
    case 'founder':
      hasRole = isFounder(communityId);
      break;
    case 'Yönetici':
    case 'admin':
      hasRole = isAdmin(communityId);
      break;
    case 'Moderatör':
    case 'moderator':
      hasRole = isModerator(communityId);
      break;
    case 'Üye':
      hasRole = getUserRole(communityId) === 'Üye';
      break;
    default:
      hasRole = getUserRole(communityId) === role;
  }

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface PermissionButtonProps {
  communityId: number;
  permission: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  role?: 'Kurucu' | 'Yönetici' | 'Moderatör' | 'Üye';
}

export function PermissionButton({ 
  communityId, 
  permission, 
  onClick, 
  children, 
  className = "",
  disabled = false,
  role 
}: PermissionButtonProps) {
  const { hasPermission, getUserRole } = usePermissions();

  const hasRequiredPermission = hasPermission(communityId, permission);
  const userRole = getUserRole(communityId);
  
  // Check both permission and role if specified
  const canPerformAction = hasRequiredPermission && (!role || userRole === role);

  if (!canPerformAction) {
    return null; // Don't render button if no permission
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

interface PermissionInfoProps {
  communityId: number;
  showRole?: boolean;
  showPermissions?: boolean;
  className?: string;
}

export function PermissionInfo({ 
  communityId, 
  showRole = true, 
  showPermissions = false,
  className = "" 
}: PermissionInfoProps) {
  const { getUserRole, userPermissions } = usePermissions();

  const role = getUserRole(communityId);
  const communityPermission = userPermissions.find(p => p.communityId === communityId);

  if (!role) {
    return null;
  }

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      {showRole && (
        <div>
          <span className="font-medium">Role:</span> {role}
        </div>
      )}
      {showPermissions && communityPermission && (
        <div className="mt-2">
          <span className="font-medium">Permissions:</span>
          <ul className="list-disc list-inside mt-1">
            {communityPermission.permissions.slice(0, 5).map(permission => (
              <li key={permission} className="text-xs">{permission}</li>
            ))}
            {communityPermission.permissions.length > 5 && (
              <li className="text-xs">... and {communityPermission.permissions.length - 5} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
