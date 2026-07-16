import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export default function DashboardCard({ title, value, icon, trend, color = 'bg-[#2563EB]' }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-[12px] border border-[#1F2937] bg-[#111827]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#9CA3AF] uppercase tracking-[0.28em]">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
        </div>
        <div className={`${color} inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-[#2563EB]/20`}>
          {icon}
        </div>
      </div>
      {trend && <p className="mt-4 text-sm text-[#9CA3AF]">{trend}</p>}
    </motion.div>
  );
}
