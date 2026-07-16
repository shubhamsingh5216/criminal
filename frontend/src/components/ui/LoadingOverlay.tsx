import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  message: string;
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center rounded-[12px] bg-[#111827]/90 text-white"
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#2563EB]/20 border-t-[#2563EB]" />
        <p className="text-lg font-semibold">{message}</p>
        <p className="text-sm text-[#9CA3AF]">Please wait while the system completes the scan.</p>
      </div>
    </motion.div>
  );
}
