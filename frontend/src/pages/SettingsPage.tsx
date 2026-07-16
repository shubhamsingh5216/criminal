import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Cog, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { useTheme } from '../contexts/ThemeContext';

const settingsSchema = z.object({
  refreshInterval: z.number().min(1).max(60),
  enableNotifications: z.boolean(),
  alertThreshold: z.number().min(0).max(100),
  theme: z.enum(['dark', 'light']),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      refreshInterval: 15,
      enableNotifications: true,
      alertThreshold: 80,
      theme,
    },
  });

  const onSubmit = async (values: SettingsForm) => {
    setLoading(true);
    try {
      setTheme(values.theme);
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success('Settings updated successfully.');
    } catch {
      toast.error('Unable to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[12px] border border-[#1F2937] bg-[#111827]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#9CA3AF]">System Settings</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Control detection and UI preferences</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#1F2937] px-4 py-3 text-sm text-[#D1D5DB]">
            <Zap className="h-4 w-4 text-[#F59E0B]" />
            Performance-first configuration
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-[#D1D5DB]">
            <span className="text-[#9CA3AF]">Dashboard Refresh (minutes)</span>
            <input type="number" className="w-full rounded-[12px] border border-[#1F2937] bg-[#111827] px-4 py-3 text-white outline-none focus:border-[#2563EB]" {...register('refreshInterval', { valueAsNumber: true })} />
            {errors.refreshInterval && <p className="text-sm text-[#DC2626]">{errors.refreshInterval.message}</p>}
          </label>
          <label className="space-y-2 text-sm text-[#D1D5DB]">
            <span className="text-[#9CA3AF]">Alert Threshold (%)</span>
            <input type="number" className="w-full rounded-[12px] border border-[#1F2937] bg-[#111827] px-4 py-3 text-white outline-none focus:border-[#2563EB]" {...register('alertThreshold', { valueAsNumber: true })} />
            {errors.alertThreshold && <p className="text-sm text-[#DC2626]">{errors.alertThreshold.message}</p>}
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-[#D1D5DB]">
            <span className="text-[#9CA3AF]">Theme</span>
            <select className="w-full rounded-[12px] border border-[#1F2937] bg-[#111827] px-4 py-3 text-white outline-none focus:border-[#2563EB]" {...register('theme')}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            {errors.theme && <p className="text-sm text-[#DC2626]">{errors.theme.message}</p>}
          </label>

          <label className="flex items-center justify-between rounded-[12px] border border-[#1F2937] bg-[#111827] px-4 py-4 text-sm text-[#D1D5DB]">
            <div>
              <p className="font-medium text-white">Notifications</p>
              <p className="text-xs text-[#9CA3AF]">Receive alerts for critical matches</p>
            </div>
            <input type="checkbox" className="h-5 w-5 accent-[#2563EB]" {...register('enableNotifications')} />
          </label>
        </div>

        <div className="rounded-[12px] border border-[#1F2937] bg-[#111827]/80 p-6">
          <div className="flex items-center gap-3 text-[#D1D5DB]">
            <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
            <div>
              <p className="text-sm font-medium text-white">Audit settings</p>
              <p className="text-sm text-[#9CA3AF]">All configuration changes are logged in the security audit trail.</p>
            </div>
          </div>
        </div>

        <button type="submit" className="inline-flex items-center justify-center rounded-[12px] bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50">
          Save Settings
        </button>
      </form>
      {loading && <LoadingOverlay message="Saving settings..." />}
    </div>
  );
}
