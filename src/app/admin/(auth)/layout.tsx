import '../admin.css';
import { Check } from 'lucide-react';

const FEATURES = [
  'Data customer & status prospek per cabang',
  'Broadcast WhatsApp & Email ke customer',
  'Landing page mandiri untuk tiap cabang',
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root grid min-h-screen md:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-10 text-white md:flex lg:p-14">
        <div className="admin-grid-overlay pointer-events-none absolute inset-0" />
        <div className="admin-glow-orb pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full" />

        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-sm font-bold text-navy">
            A
          </span>
          <span className="text-sm font-semibold tracking-wide text-white/90">Adira CRM</span>
        </div>

        <div className="relative z-10 max-w-sm space-y-6">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
            Internal Dashboard
          </span>
          <h1 className="text-3xl font-bold leading-tight text-balance">
            Kelola cabang, customer, dan broadcast dalam satu tempat.
          </h1>
          <ul className="space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Check className="h-2.5 w-2.5" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} Adira Finance · Agen AXI
        </p>
      </div>

      <div className="flex items-center justify-center bg-muted/40 p-6 md:bg-background">
        {children}
      </div>
    </div>
  );
}
