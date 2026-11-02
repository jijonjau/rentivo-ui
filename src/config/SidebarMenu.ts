import {
  Home,
  Users,
  House,
  CreditCard,
  ShieldCheck,
  Settings,
  CircleHelp,
  type LucideIcon,
  Building2,
} from 'lucide-react';

export type UserRole = 'SUPER_ADMIN' | 'AGENCY' | 'LANDLORD' | 'TENANT';

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarMenu: Record<UserRole, SidebarItem[]> = {
  SUPER_ADMIN: [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Agencies', href: '/dashboard/agencies', icon: Building2 },
    // { label: "Landlords", href: "/dashboard/landlords", icon: Users },
    { label: 'Users', href: '/dashboard/users', icon: Users },
    { label: 'Properties', href: '/dashboard/properties', icon: House },
    { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { label: 'Roles', href: '/dashboard/roles', icon: ShieldCheck },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Help', href: '/dashboard/help', icon: CircleHelp },
  ],

  AGENCY: [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Employees', href: '/dashboard/employees', icon: Users },
    { label: 'Properties', href: '/dashboard/properties', icon: House },
    { label: 'Roles', href: '/dashboard/roles', icon: ShieldCheck },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Help', href: '/dashboard/help', icon: CircleHelp },
  ],

  LANDLORD: [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Properties', href: '/dashboard/properties', icon: House },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Help', href: '/dashboard/help', icon: CircleHelp },
  ],

  TENANT: [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'My House', href: '/dashboard/my-house', icon: House },
    { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Help', href: '/dashboard/help', icon: CircleHelp },
  ],
};
