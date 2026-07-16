import { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Bell, CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';
import useCurrentTime from '../hooks/useCurrentTime';

const sidebarItems = [
  { label: 'Dashboard', href: '/', icon: Cpu },
  { label: 'Add Criminal', href: '/add-criminal', icon: ShieldCheck },
  { label: 'Face Matching', href: '/match-criminal', icon: CheckCircle2 },
  { label: 'Database', href: '/database', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Bell },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const time = useCurrentTime();

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-[#1F2937] bg-[#111827] px-6 py-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] ring-1 ring-[#2563EB]/20">
              CF
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.36em] text-[#9CA3AF]">System</p>
              <h1 className="text-xl font-semibold text-white">Criminal Face Recognition</h1>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                      isActive
                        ? 'bg-[#2563EB]/15 text-white shadow-[0_20px_60px_rgba(37,99,235,0.12)]'
                        : 'text-[#D1D5DB] hover:bg-[#1F2937] hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-[#1F2937] bg-[#111827]/40 p-5 text-sm text-[#9CA3AF] shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
            <p className="uppercase tracking-[0.28em] text-[#6B7280]">System Status</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3">
                <span>Secure Connection</span>
                <span className="text-[#16A34A]">Online</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3">
                <span>AI Detection</span>
                <span className="text-[#2563EB]">Enabled</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3">
                <span>Database</span>
                <span className="text-[#16A34A]">Connected</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-[#1F2937] bg-[#0B1220]/90 px-8 py-5 backdrop-blur-xl">
            <div>
              <p className="text-sm text-[#9CA3AF]">AI Powered Criminal Identification Platform</p>
              <h2 className="text-xl font-semibold text-white">Command Center</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#D1D5DB]">
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(time)}
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-[#D1D5DB]">
                Officer: Shubham
              </div>
              <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-[#111827] p-3 text-[#D1D5DB] transition hover:bg-[#1F2937]">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </header>

          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
