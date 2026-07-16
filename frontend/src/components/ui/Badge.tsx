interface BadgeProps {
  value: string;
}

export default function Badge({ value }: BadgeProps) {
  return <span className="rounded-full bg-[#2563EB]/15 px-3 py-1 text-sm text-[#2563EB]">{value}</span>;
}
