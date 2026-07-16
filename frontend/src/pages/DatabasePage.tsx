import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, ShieldCheck } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import { fetchCriminals } from '../services/api';

export default function DatabasePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['criminals'],
    queryFn: fetchCriminals,
  });

  const records = useMemo(() => data ?? [], [data]);

  const headers = ['Name', 'Case Info', 'Added On'];
  const rows = records.map((record) => (
    <tr key={record.id ?? record.name} className="border-b border-[#1F2937] last:border-b-0">
      <td className="px-6 py-4 text-sm text-white">{record.name}</td>
      <td className="px-6 py-4 text-sm text-[#9CA3AF]">{record.case_info}</td>
      <td className="px-6 py-4 text-sm text-[#9CA3AF]">
        {record.created_at ? new Date(record.created_at).toLocaleDateString() : '—'}
      </td>
    </tr>
  ));

  return (
    <div className="space-y-8">
      <div className="rounded-[12px] border border-[#1F2937] bg-[#111827]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#9CA3AF]">Criminal Database</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Manage records with live analytics</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#1F2937] px-4 py-3 text-sm text-[#D1D5DB]">
            <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
            Secure records audit trail
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-12 text-center text-[#D1D5DB]">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#2563EB]" />
          <p className="mt-4 text-lg font-medium">Loading criminal records...</p>
        </div>
      ) : error ? (
        <div className="rounded-[12px] border border-[#DC2626] bg-[#4B1F1F]/80 p-8 text-center text-[#FECACA]">
          <p className="text-xl font-semibold">Unable to load database</p>
          <p className="mt-2">{error instanceof Error ? error.message : 'Please check your network or contact the team.'}</p>
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-12 text-center text-[#D1D5DB]">
          <p className="text-xl font-semibold">No criminal records found</p>
          <p className="mt-2">Add a criminal profile to populate the database.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#9CA3AF]">Total Records</p>
              <p className="text-3xl font-semibold text-white">{records.length}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm text-[#D1D5DB]">
              <Search className="h-4 w-4 text-[#2563EB]" />
              Live query powered by React Query
            </div>
          </div>
          <DataTable headers={headers} rows={rows} />
        </div>
      )}
    </div>
  );
}
