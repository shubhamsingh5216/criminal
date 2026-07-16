import type { ReactNode } from 'react';

interface DataTableProps {
  headers: string[];
  rows: ReactNode[];
}

export default function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#1F2937] bg-[#111827]/95 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <table className="min-w-full border-separate border-spacing-0">
        <thead className="bg-[#111827]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-[#1F2937] px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.24em] text-[#9CA3AF]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
