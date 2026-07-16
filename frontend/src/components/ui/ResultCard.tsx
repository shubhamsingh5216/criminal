import { motion } from 'framer-motion';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  status?: string;
}

export default function ResultCard({ title, children, status }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-[12px] border border-[#1F2937] bg-[#111827]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#9CA3AF]">{title}</p>
        </div>
        {status && <span className="rounded-full bg-[#111827] px-3 py-1 text-sm text-[#9CA3AF]">{status}</span>}
      </div>
      {children}
    </motion.div>
  );
}
