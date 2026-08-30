'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Building2, FileText, Send, Landmark, MapPin, UserCog, ShieldCheck } from 'lucide-react';
import type { PermissionKey } from '@/lib/rbac-constants';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/customers', label: 'Customer', icon: Users },
  { href: '/admin/branches', label: 'Cabang', icon: Building2 },
  { href: '/admin/landing-pages', label: 'Landing Page', icon: FileText },
  { href: '/admin/broadcasts', label: 'Broadcast', icon: Send },
];

const adminLinks: Array<{ href: string; label: string; icon: typeof Landmark; permission: PermissionKey }> = [
  { href: '/admin/companies', label: 'Companies', icon: Landmark, permission: 'platform.manage_companies' },
  { href: '/admin/regions', label: 'Regions', icon: MapPin, permission: 'company.manage_regions' },
  { href: '/admin/users', label: 'Users', icon: UserCog, permission: 'company.manage_users' },
  { href: '/admin/roles', label: 'Roles', icon: ShieldCheck, permission: 'company.manage_roles' },
];

export function SidebarNav({ permissions }: { permissions: string[] | undefined }) {
  const pathname = usePathname();
  const visibleAdminLinks = adminLinks.filter((link) => permissions?.includes(link.permission));

  const renderLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Landmark }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
          active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
        )}
      >
        <span
          className={cn(
            'absolute inset-y-1 left-0 w-0.5 rounded-full bg-gold transition-opacity',
            active ? 'opacity-100' : 'opacity-0'
          )}
        />
        <Icon className={cn('h-4 w-4', active ? 'text-gold' : 'text-white/50 group-hover:text-white/80')} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-1.5 px-4 py-3">
      {links.map(renderLink)}

      {visibleAdminLinks.length > 0 && (
        <>
          <p className="mt-4 px-3.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
            Administration
          </p>
          {visibleAdminLinks.map(renderLink)}
        </>
      )}
    </nav>
  );
}
