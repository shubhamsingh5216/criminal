import { useCallback, useState } from 'react';
import { Camera, UploadCloud } from 'lucide-react';

interface UploadZoneProps {
  label: string;
  accept?: string;
  onFileChange: (file: File | null) => void;
  preview?: string | null;
}

export default function UploadZone({ label, accept = 'image/*', onFileChange, preview }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files?.[0] ?? null;
      onFileChange(file?.type.startsWith('image/') ? file : null);
    },
    [onFileChange]
  );

  return (
    <label className={`group block rounded-[12px] border border-[#1F2937] bg-[#111827]/90 p-5 transition ${dragActive ? 'border-[#2563EB] bg-[#1F2937]' : ''}`}>
      <div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDrop={handleDrop}
        className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-center"
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#111827] text-[#2563EB] shadow-[0_20px_60px_rgba(37,99,235,0.12)]">
          <UploadCloud className="h-8 w-8" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{label}</p>
          <p className="mt-2 text-sm text-[#9CA3AF]">Drag & drop or browse to upload</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 px-4 py-2 text-sm text-[#2563EB]">
          <Camera className="h-4 w-4" />
          Upload image
        </div>
        <input type="file" accept={accept} className="hidden" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
      </div>
      {preview && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827]/80">
          <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
        </div>
      )}
    </label>
  );
}
