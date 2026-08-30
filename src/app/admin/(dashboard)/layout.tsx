import '../admin.css';
import { getCurrentUser } from '@/lib/auth/dal';
import { logout } from '@/lib/auth/actions';
import { SidebarNav } from '@/components/admin/sidebar-nav';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="admin-root grid min-h-screen grid-cols-[260px_minmax(0,1fr)]">
      <aside className="relative flex flex-col overflow-hidden bg-navy">
        <div className="admin-grid-overlay pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative z-10 flex items-center gap-3 border-b border-white/10 px-5 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-sm font-bold text-navy">
            A
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">Adira CRM</span>
        </div>
        <div className="relative z-10 flex-1 py-2">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-8 py-4 shadow-[0_1px_0_rgba(10,17,40,0.04)]">
          <div className="text-sm text-muted-foreground">
            Masuk sebagai <span className="font-medium text-foreground">{user.name}</span>{' '}
            <span className="ml-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {user.role}
            </span>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Keluar
            </Button>
          </form>
        </header>
        <main className="flex-1 bg-muted/20 p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
