interface StatusChipProps {
  label: string;
  variant?: 'success' | 'danger' | 'warning' | 'primary';
}

const variantStyles: Record<NonNullable<StatusChipProps['variant']>, string> = {
  success: 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/25',
  danger: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/25',
  warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25',
  primary: 'bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/25',
};

export default function StatusChip({ label, variant = 'primary' }: StatusChipProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${variantStyles[variant]}`}>{label}</span>;
}
