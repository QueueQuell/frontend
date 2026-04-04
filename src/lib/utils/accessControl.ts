/**
 * Access Control System
 *
 * This module provides role-based access control (RBAC) for the application.
 * It defines role hierarchy, permission maps, and utility functions for checking access.
 *
 * Role Scope:
 * - SuperAdmin: SaaS-level admin with complete unrestricted access to everything
 * - All other roles: Organisation-level roles with access scoped to their organisation
 */

// ============================================================================
// Role Type Definitions
// ============================================================================

export type UserRole =
  | "User"
  | "Admin"
  | "Manager"
  | "SuperAdmin"
  | "Owner"
  | "DeliveryPersonnel"
  | "Chef"
  | "Waiter"
  | "Staff";

// ============================================================================
// Role Scope Types
// ============================================================================

/**
 * Defines the scope of a role
 */
export enum RoleScope {
  /** SaaS-level admin with complete system access */
  SAAS_ADMIN = "saas",
  /** Organisation-level role with access within their organisation */
  ORGANISATION = "organisation",
}

/**
 * Maps each role to its scope
 */
export const ROLE_SCOPE: Record<UserRole, RoleScope> = {
  Staff: RoleScope.ORGANISATION,
  Waiter: RoleScope.ORGANISATION,
  Chef: RoleScope.ORGANISATION,
  DeliveryPersonnel: RoleScope.ORGANISATION,
  User: RoleScope.ORGANISATION,
  Manager: RoleScope.ORGANISATION,
  Admin: RoleScope.ORGANISATION,
  Owner: RoleScope.ORGANISATION,
  SuperAdmin: RoleScope.SAAS_ADMIN,
};

// ============================================================================
// Access Level Enum
// ============================================================================

/**
 * Access levels define the hierarchy of roles within an organisation.
 * Higher number = more access within the organisation.
 * A role can access anything at its level or below.
 */
export enum AccessLevel {
  Staff = 1,
  Waiter = 2,
  Chef = 3,
  DeliveryPersonnel = 4,
  User = 5,
  Manager = 6,
  Admin = 7,
  Owner = 8,
  // SuperAdmin has SAAS scope and bypasses all level checks
  SuperAdmin = 100,
}

// ============================================================================
// Feature/Module Definitions
// ============================================================================

export type FeatureKey =
  | "dashboard"
  | "menu_items"
  | "menu_categories"
  | "orders"
  | "inventory"
  | "payments"
  | "customers"
  | "suppliers"
  | "qr_management"
  | "administrator"
  | "users"
  | "organisations";

export type ActionType = "create" | "read" | "update" | "delete";

// ============================================================================
// Role Hierarchy Map
// ============================================================================

/**
 * Maps each role to its access level
 */
export const ROLE_ACCESS_LEVEL: Record<UserRole, AccessLevel> = {
  Staff: AccessLevel.Staff,
  Waiter: AccessLevel.Waiter,
  Chef: AccessLevel.Chef,
  DeliveryPersonnel: AccessLevel.DeliveryPersonnel,
  User: AccessLevel.User,
  Manager: AccessLevel.Manager,
  Admin: AccessLevel.Admin,
  SuperAdmin: AccessLevel.SuperAdmin,
  Owner: AccessLevel.Owner,
};

/**
 * Admin roles that have full system access
 */
export const ADMIN_ROLES: UserRole[] = ["SuperAdmin", "Owner", "Admin"];

// ============================================================================
// Feature Access Map
// ============================================================================

/**
 * Defines which roles can access which features
 * Each feature can have different access levels for different actions
 */
export const FEATURE_ACCESS_MAP: Record<
  FeatureKey,
  Partial<Record<ActionType, AccessLevel>>
> = {
  // Dashboard - accessible by all authenticated users
  dashboard: {
    read: AccessLevel.Staff,
  },

  // Menu Items Management
  menu_items: {
    read: AccessLevel.Staff,
    create: AccessLevel.Manager,
    update: AccessLevel.Manager,
    delete: AccessLevel.Admin,
  },

  // Menu Categories Management
  menu_categories: {
    read: AccessLevel.Staff,
    create: AccessLevel.Manager,
    update: AccessLevel.Manager,
    delete: AccessLevel.Admin,
  },

  // Orders Management
  orders: {
    read: AccessLevel.Staff,
    create: AccessLevel.Staff,
    update: AccessLevel.Waiter,
    delete: AccessLevel.Manager,
  },

  // Inventory Management
  inventory: {
    read: AccessLevel.Chef,
    create: AccessLevel.Chef,
    update: AccessLevel.Chef,
    delete: AccessLevel.Manager,
  },

  // Payments Management
  payments: {
    read: AccessLevel.Waiter,
    create: AccessLevel.Waiter,
    update: AccessLevel.Manager,
    delete: AccessLevel.Admin,
  },

  // Customers Management
  customers: {
    read: AccessLevel.Waiter,
    create: AccessLevel.Waiter,
    update: AccessLevel.Manager,
    delete: AccessLevel.Admin,
  },

  // Suppliers Management
  suppliers: {
    read: AccessLevel.Chef,
    create: AccessLevel.Manager,
    update: AccessLevel.Manager,
    delete: AccessLevel.Admin,
  },

  // QR Management
  qr_management: {
    read: AccessLevel.Manager,
    create: AccessLevel.Manager,
    update: AccessLevel.Manager,
    delete: AccessLevel.Admin,
  },

  // Administrator Section (users, organisations)
  administrator: {
    read: AccessLevel.Admin,
    create: AccessLevel.SuperAdmin,
    update: AccessLevel.SuperAdmin,
    delete: AccessLevel.SuperAdmin,
  },

  // Users Management
  users: {
    read: AccessLevel.Manager,
    create: AccessLevel.Admin,
    update: AccessLevel.Admin,
    delete: AccessLevel.SuperAdmin,
  },

  // Organisations Management
  organisations: {
    read: AccessLevel.Admin,
    create: AccessLevel.SuperAdmin,
    update: AccessLevel.SuperAdmin,
    delete: AccessLevel.SuperAdmin,
  },
};

// ============================================================================
// Sidebar Feature Mapping
// ============================================================================

/**
 * Maps sidebar sections to features for access control
 */
export const SIDEBAR_FEATURE_MAP: Record<string, FeatureKey> = {
  home: "dashboard",
  items: "menu_items",
  orders: "inventory", // Using inventory as fallback, orders has its own
  inventory: "inventory",
  payments: "payments",
  customers: "customers",
  suppliers: "suppliers",
  qr: "qr_management",
  administrator: "administrator",
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if a role has SaaS-level access (SuperAdmin)
 * SuperAdmin has unrestricted access to everything
 */
export function isSuperAdmin(role: string | undefined): boolean {
  if (!role) return false;
  return role.toUpperCase() === "SUPERADMIN";
}

/**
 * Check if a role has organisation-level access
 */
export function isOrganisationRole(role: string | undefined): boolean {
  if (!role) return false;
  const scope = ROLE_SCOPE[role.toUpperCase() as UserRole];
  return scope === RoleScope.ORGANISATION;
}

/**
 * Get the scope of a role
 */
export function getRoleScope(role: string | undefined): RoleScope | null {
  if (!role) return null;
  return ROLE_SCOPE[role.toUpperCase() as UserRole] || null;
}

/**
 * Check if a role has access to a feature with a specific action
 * SuperAdmin (SaaS) has unrestricted access to everything
 * Organisation roles have access based on their access level
 */
export function canPerformAction(
  role: UserRole | string | undefined,
  feature: FeatureKey,
  action: ActionType,
): boolean {
  if (!role) return false;

  // SuperAdmin has unrestricted access to everything
  if (isSuperAdmin(role)) return true;

  const normalizedRole = role.toUpperCase() as UserRole;
  const userLevel = ROLE_ACCESS_LEVEL[normalizedRole];

  if (userLevel === undefined) return false;

  const requiredLevel = FEATURE_ACCESS_MAP[feature]?.[action];

  if (requiredLevel === undefined) {
    // If no specific level defined, check if user level exists (has some access)
    return userLevel >= AccessLevel.User;
  }

  return userLevel >= requiredLevel;
}

/**
 * Check if a role meets the minimum access level requirement
 * SuperAdmin (SaaS) bypasses all level checks
 */
export function hasAccess(
  role: UserRole | string | undefined,
  requiredRole: UserRole | AccessLevel,
): boolean {
  if (!role) return false;

  // SuperAdmin has unrestricted access
  if (isSuperAdmin(role)) return true;

  const normalizedRole = role.toUpperCase() as UserRole;
  const userLevel = ROLE_ACCESS_LEVEL[normalizedRole];

  if (userLevel === undefined) return false;

  // If requiredRole is a number (AccessLevel), compare directly
  if (typeof requiredRole === "number") {
    return userLevel >= requiredRole;
  }

  // If requiredRole is a string (role name), convert to level and compare
  const requiredLevel = ROLE_ACCESS_LEVEL[requiredRole];
  return userLevel >= requiredLevel;
}

/**
 * Check if a role is an admin role (organisation-level admin)
 * Note: Use isSuperAdmin() to check for SaaS-level admin
 */
export function isAdminRole(role: string | undefined): boolean {
  if (!role) return false;
  // ADMIN and OWNER are organisation-level admin roles
  // SuperAdmin is handled separately as SaaS-level
  const upperRole = role.toUpperCase();
  return upperRole === "ADMIN" || upperRole === "OWNER";
}

/**
 * Get all features accessible by a role
 * SuperAdmin sees all features
 */
export function getAccessibleFeatures(
  role: UserRole | string | undefined,
): FeatureKey[] {
  if (!role) return [];

  // SuperAdmin has access to everything
  if (isSuperAdmin(role)) {
    return Object.keys(FEATURE_ACCESS_MAP) as FeatureKey[];
  }

  const normalizedRole = role.toUpperCase() as UserRole;
  const userLevel = ROLE_ACCESS_LEVEL[normalizedRole];

  if (userLevel === undefined) return [];

  // Check each feature
  const features: FeatureKey[] = [];
  for (const [feature, actions] of Object.entries(FEATURE_ACCESS_MAP)) {
    // If user has any action on this feature, include it
    const minActionLevel = Math.min(
      ...Object.values(actions).filter(
        (level): level is number => typeof level === "number",
      ),
    );

    if (userLevel >= minActionLevel) {
      features.push(feature as FeatureKey);
    }
  }

  return features;
}

/**
 * Check if user can access a specific sidebar item
 */
export function canAccessSidebarItem(
  role: UserRole | string | undefined,
  itemKey: string,
  isAdminOnly?: boolean,
): boolean {
  // Admin-only items require admin role
  if (isAdminOnly) {
    return isAdminRole(role);
  }

  // Map sidebar key to feature
  const feature = SIDEBAR_FEATURE_MAP[itemKey];
  if (!feature) return true; // Allow if no specific requirement

  return canPerformAction(role, feature, "read");
}

/**
 * Get role display name
 */
export function getRoleDisplayName(
  role: UserRole | string | undefined,
): string {
  if (!role) return "Unknown";

  const displayNames: Record<string, string> = {
    USER: "User",
    ADMIN: "Admin",
    MANAGER: "Manager",
    SuperAdmin: "Super Admin",
    OWNER: "Owner",
    DELIVERY_PERSONNEL: "Delivery Personnel",
    CHEF: "Chef",
    WAITER: "Waiter",
    STAFF: "Staff",
  };

  return displayNames[role.toUpperCase()] || role;
}

/**
 * Get role hierarchy array (ordered from lowest to highest)
 */
export function getRoleHierarchy(): UserRole[] {
  return [
    "Staff",
    "Waiter",
    "Chef",
    "DeliveryPersonnel",
    "User",
    "Manager",
    "Admin",
    "SuperAdmin",
    "Owner",
  ];
}

// ============================================================================
// Default Exports
// ============================================================================

export default {
  canPerformAction,
  hasAccess,
  isAdminRole,
  isSuperAdmin,
  isOrganisationRole,
  getRoleScope,
  getAccessibleFeatures,
  canAccessSidebarItem,
  getRoleDisplayName,
  getRoleHierarchy,
  ROLE_ACCESS_LEVEL,
  ROLE_SCOPE,
  ADMIN_ROLES,
  FEATURE_ACCESS_MAP,
  AccessLevel,
  RoleScope,
};
