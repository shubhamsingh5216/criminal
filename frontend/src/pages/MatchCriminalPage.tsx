import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Camera, CircleDashed, Loader2, Radar, Search } from 'lucide-react';
import UploadZone from '../components/ui/UploadZone';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { matchCriminal } from '../services/api';
import { MatchResult } from '../types/api';

const matchSchema = z.object({
  suspect_image: z.instanceof(File).optional(),
});

type MatchForm = z.infer<typeof matchSchema>;

export default function MatchCriminalPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const { handleSubmit } = useForm<MatchForm>({ resolver: zodResolver(matchSchema) });

  const onFileChange = (selected: File | null) => {
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }
    if (selected.size > 5_000_000) {
      toast.error('Image must be smaller than 5MB.');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const onSubmit = async () => {
    if (!file) {
      toast.error('Please upload a suspect image first.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await matchCriminal(formData);
      setResult(response);
    } catch (error) {
      toast.error(String(error));
      setResult({ message: 'No match found' });
    } finally {
      setLoading(false);
    }
  };

  const matchFound = useMemo(() => !!result?.criminal, [result]);

  return (
    <div className="space-y-8">
      <div className="rounded-[12px] border border-[#1F2937] bg-[#111827]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#9CA3AF]">Face Matching</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Analyze a suspect image</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#1F2937] px-4 py-3 text-sm text-[#D1D5DB]">
            <Radar className="h-4 w-4 text-[#2563EB]" />
            AI scanning enabled
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <UploadZone label="Upload suspect image" preview={preview} onFileChange={onFileChange} />
            <button
              type="button"
              onClick={onSubmit}
              className="inline-flex items-center justify-center rounded-[12px] bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                'Analyze Face'
              )}
            </button>
          </div>

          <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#9CA3AF]">Progress</p>
            <div className="mt-6 space-y-4">
              {['Analyzing facial landmarks...', 'Extracting embeddings...', 'Searching database...', 'Comparing vectors...', 'Finding nearest match...'].map((step, index) => (
                <div key={step} className="rounded-2xl bg-[#111827] p-4">
                  <div className="flex items-center justify-between gap-4 text-sm text-[#D1D5DB]">
                    <span>{step}</span>
                    <span>{Math.min(100, (index + 1) * 20)}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1F2937]">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="rounded-[12px] border border-[#1F2937] bg-[#111827]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            {matchFound ? (
              <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-[#9CA3AF]">Matched Criminal</p>
                  <img src={result.criminal?.image} alt="Matched criminal" className="mt-6 h-72 w-full rounded-[12px] object-cover" />
                  <div className="mt-6 space-y-4 text-[#D1D5DB]">
                    <p className="text-2xl font-semibold text-white">{result.criminal?.name}</p>
                    <p className="text-sm text-[#9CA3AF]">{result.criminal?.case_info || 'No case details available.'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-6 space-y-3 text-[#D1D5DB]">
                    <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
                      <span>Name</span>
                      <span>{result.criminal?.name}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4 text-sm text-[#9CA3AF]">
                      <span>Case Info</span>
                      <span className="text-right">{result.criminal?.case_info ?? 'N/A'}</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <button className="rounded-[12px] bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">Print Report</button>
                    <button className="rounded-[12px] bg-[#111827] border border-[#1F2937] px-4 py-3 text-sm font-semibold text-[#D1D5DB] hover:bg-[#1F2937]">View Full Details</button>
                    <button className="rounded-[12px] bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D]">Download Result</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[12px] border border-[#1F2937] bg-[#0F172A]/80 p-10 text-center text-[#D1D5DB]">
                <CircleDashed className="mx-auto h-16 w-16 text-[#2563EB]" />
                <p className="mt-6 text-2xl font-semibold text-white">No Criminal Match Found</p>
                <p className="mt-3 text-sm text-[#9CA3AF]">The image was analyzed, but no criminal records matched your search.</p>
                <button className="mt-6 rounded-[12px] bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Try Another Image</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {loading && <LoadingOverlay message="Searching criminal database..." />}
    </div>
  );
}
