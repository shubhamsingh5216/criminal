import { ArrowUpRight, BarChart3, ShieldCheck, Star } from 'lucide-react';
import DashboardCard from '../components/ui/DashboardCard';
import ResultCard from '../components/ui/ResultCard';
import DataTable from '../components/ui/DataTable';
import { formatNumber } from '../utils/format';

const metrics = [
  { title: 'Total Criminals', value: '12,842', icon: <ShieldCheck className="h-5 w-5" />, trend: '+5.8% this week' },
  { title: 'Today’s Searches', value: '1,240', icon: <BarChart3 className="h-5 w-5" />, trend: '+12.6% compared to yesterday' },
  { title: 'Successful Matches', value: '516', icon: <ArrowUpRight className="h-5 w-5" />, trend: '+8.3% match rate' },
  { title: 'False Positives', value: '16', icon: <Star className="h-5 w-5" />, trend: '-3.1% review rate' },
];

const recentCriminals = [
  { name: 'Elena Ramirez', crime: 'Fraud', station: 'Metro Precinct', status: 'Under Investigation' },
  { name: 'Samuel Holt', crime: 'Armed Robbery', station: 'Northshore PD', status: 'Arrested' },
  { name: 'Dina Chen', crime: 'Cybercrime', station: 'Federal Task Force', status: 'Wanted' },
];

const recentSearches = [
  { suspect: 'Unknown Male', time: '2m ago', result: 'Match found' },
  { suspect: 'Maria Lopez', time: '12m ago', result: 'No match' },
  { suspect: 'Brandon Cole', time: '27m ago', result: 'Match found' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-4">
        {metrics.map((metric) => (
          <DashboardCard key={metric.title} title={metric.title} value={metric.value} icon={metric.icon} trend={metric.trend} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <ResultCard title="Database Status" status="Online">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-4">
              <p className="text-sm text-[#9CA3AF]">API Health</p>
              <p className="mt-3 text-2xl font-semibold text-white">99.97%</p>
            </div>
            <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-4">
              <p className="text-sm text-[#9CA3AF]">Investigation Timeline</p>
              <p className="mt-3 text-2xl font-semibold text-white">7 active cases</p>
            </div>
          </div>
        </ResultCard>

        <ResultCard title="System Health" status="Secure">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-4">
                <p className="text-sm text-[#9CA3AF]">Face Recognition</p>
                <p className="mt-2 text-lg font-semibold text-white">Online</p>
              </div>
              <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-4">
                <p className="text-sm text-[#9CA3AF]">Database</p>
                <p className="mt-2 text-lg font-semibold text-white">Connected</p>
              </div>
            </div>
            <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-4">
              <p className="text-sm text-[#9CA3AF]">Secure Connection</p>
              <p className="mt-2 text-lg font-semibold text-white">Active</p>
            </div>
          </div>
        </ResultCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ResultCard title="Recent Criminal Additions">
          <div className="space-y-3">
            {recentCriminals.map((criminal) => (
              <div key={criminal.name} className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{criminal.name}</p>
                    <p className="text-sm text-[#9CA3AF]">{criminal.crime}</p>
                  </div>
                  <span className="rounded-full bg-[#2563EB]/10 px-3 py-1 text-sm text-[#2563EB]">{criminal.status}</span>
                </div>
                <p className="mt-3 text-sm text-[#9CA3AF]">{criminal.station}</p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Recent Searches">
          <DataTable
            headers={['Suspect', 'Time', 'Result']}
            rows={recentSearches.map((search) => (
              <tr key={search.suspect} className="border-b border-[#1F2937] last:border-b-0">
                <td className="px-6 py-4 text-sm text-white">{search.suspect}</td>
                <td className="px-6 py-4 text-sm text-[#9CA3AF]">{search.time}</td>
                <td className="px-6 py-4 text-sm text-[#16A34A]">{search.result}</td>
              </tr>
            ))}
          />
        </ResultCard>
      </div>
    </div>
  );
}
