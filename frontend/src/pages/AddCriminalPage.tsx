import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Camera, Loader2 } from 'lucide-react';
import UploadZone from '../components/ui/UploadZone';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { addCriminal } from '../services/api';

const criminalSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  case_info: z.string().min(8, 'Case info must be at least 8 characters'),
});

type CriminalFormData = z.infer<typeof criminalSchema>;

export default function AddCriminalPage() {
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [leftPreview, setLeftPreview] = useState<string | null>(null);
  const [rightPreview, setRightPreview] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CriminalFormData>({
    resolver: zodResolver(criminalSchema),
    defaultValues: {
      name: '',
      case_info: '',
    },
  });

  const onSubmit: SubmitHandler<CriminalFormData> = async (values) => {
    if (!frontFile || !leftFile || !rightFile) {
      toast.error('All three images are required.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('case_info', values.case_info);
    formData.append('image_front', frontFile);
    formData.append('image_left', leftFile);
    formData.append('image_right', rightFile);

    try {
      await addCriminal(formData);
      toast.success('Criminal record added successfully.');
      reset();
      setFrontFile(null);
      setLeftFile(null);
      setRightFile(null);
      setFrontPreview(null);
      setLeftPreview(null);
      setRightPreview(null);
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  const validateImage = (file: File | null, setter: (src: string | null) => void, setFile: (file: File | null) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    if (file.size > 5_000_000) {
      toast.error('File size must be below 5MB.');
      return;
    }
    setFile(file);
    setter(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[12px] border border-[#1F2937] bg-[#111827]/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#9CA3AF]">Add Criminal</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Register a new suspect profile</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[#1F2937] px-4 py-3 text-sm text-[#D1D5DB]">
            <Camera className="h-4 w-4 text-[#2563EB]" />
            Upload three face angles for best accuracy
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <label className="space-y-2 text-sm text-[#D1D5DB]">
            <span className="text-[#9CA3AF]">Full Name</span>
            <input
              className="w-full rounded-[12px] border border-[#1F2937] bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-[#2563EB]"
              placeholder="Enter suspect name"
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-[#DC2626]">{errors.name.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-[#D1D5DB]">
            <span className="text-[#9CA3AF]">Case Info</span>
            <textarea
              className="w-full rounded-[12px] border border-[#1F2937] bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-[#2563EB]"
              rows={4}
              placeholder="Add case details, crime type, location, and other notes"
              {...register('case_info')}
            />
            {errors.case_info && <p className="text-sm text-[#DC2626]">{errors.case_info.message}</p>}
          </label>

          <div className="grid gap-6 lg:grid-cols-3">
            <UploadZone
              label="Front Face"
              preview={frontPreview}
              onFileChange={(file) => validateImage(file, setFrontPreview, setFrontFile)}
            />
            <UploadZone
              label="Left Face"
              preview={leftPreview}
              onFileChange={(file) => validateImage(file, setLeftPreview, setLeftFile)}
            />
            <UploadZone
              label="Right Face"
              preview={rightPreview}
              onFileChange={(file) => validateImage(file, setRightPreview, setRightFile)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-[12px] bg-[#2563EB] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              'Submit Criminal Record'
            )}
          </button>
        </form>
      </div>
      {loading && <LoadingOverlay message="Registering suspect profile..." />}
    </div>
  );
}
