import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center gap-2.5 md:hidden">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-sm font-bold text-gold">
          A
        </span>
        <span className="text-sm font-semibold tracking-wide text-foreground">Adira CRM</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_2px_16px_rgba(10,17,40,0.08)] sm:p-10">
        <div className="mb-6 space-y-1.5">
          <h1 className="text-xl font-bold text-foreground">Masuk ke Dashboard</h1>
          <p className="text-sm text-muted-foreground">Gunakan akun staff/admin untuk mengelola CRM.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
