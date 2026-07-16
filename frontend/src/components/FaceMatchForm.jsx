import { useEffect, useRef, useState } from 'react';

const API_BASE = '/api';
const PHASES = [
  { threshold: 20, label: 'Analyzing image quality' },
  { threshold: 45, label: 'Detecting facial landmarks' },
  { threshold: 75, label: 'Matching against watchlist' },
  { threshold: 100, label: 'Finalizing confidence score' },
];

export default function FaceMatchForm({ setResult, setToast }) {
  const [file, setFile] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Upload image to begin scanning');
  const [stage, setStage] = useState('Waiting for image');
  const scanInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (uploadedPreview) {
        URL.revokeObjectURL(uploadedPreview);
      }
      if (scanInterval.current) {
        clearInterval(scanInterval.current);
      }
    };
  }, [uploadedPreview]);

  const getPhaseLabel = (progress) => {
    return PHASES.find((phase) => progress <= phase.threshold)?.label || 'Completing scan';
  };

  const startScan = () => {
    setScanProgress(6);
    setScanMessage('Validating image');
    setStage('Validating image');

    scanInterval.current = setInterval(() => {
      setScanProgress((value) => {
        const next = Math.min(100, value + Math.floor(Math.random() * 12) + 5);
        const nextStage = getPhaseLabel(next);
        setScanMessage(nextStage);
        setStage(nextStage);

        if (next >= 100 && scanInterval.current) {
          clearInterval(scanInterval.current);
          scanInterval.current = null;
        }

        return next;
      });
    }, 220);
  };

  const stopScan = () => {
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setLoading(true);
    setScanProgress(0);
    setScanMessage('Starting scan');
    setStage('Starting scan');
    startScan();
    setToast('Matching face...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/check-face/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      stopScan();
      setScanProgress(100);
      setScanMessage(response.ok ? 'Match complete' : 'No match found');
      setStage(response.ok ? 'Match confirmed' : 'No match found');
      setResult({ ...data, uploadedImage: uploadedPreview });
      setToast(response.ok ? 'Match result received' : 'No match found');
    } catch (error) {
      stopScan();
      setScanProgress(100);
      setScanMessage('Connection failed');
      setStage('Connection issue');
      setResult({ error: 'Unable to connect with server.' });
      setToast('Server request failed');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null;
    if (uploadedPreview) {
      URL.revokeObjectURL(uploadedPreview);
    }
    setFile(selected);
    setUploadedPreview(selected ? URL.createObjectURL(selected) : null);
    setScanProgress(0);
    setScanMessage('Ready to scan the uploaded image');
    setStage('Image ready');
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Upload and match a suspect photo</h2>
            <p className="mt-3 text-slate-600">Choose a clear image with a front-facing pose. The system will compare it to stored criminal profiles and surface the best match.</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">Secure photo scan</div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-900 transition hover:border-slate-300">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium">Upload photo</span>
              <span className="text-xs uppercase tracking-[0.35em] text-slate-500">JPEG, PNG</span>
            </div>
            <input
              required
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-4 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-900"
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Preview</p>
              <div className="mt-4 min-h-[18rem] overflow-hidden rounded-3xl bg-white shadow-sm">
                {uploadedPreview ? (
                  <img src={uploadedPreview} alt="Uploaded preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-slate-500">
                    <div>
                      <p className="font-medium text-slate-700">No image selected</p>
                      <p className="mt-2 text-xs text-slate-500">Select a clear face photo to begin.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Scan progress</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-slate-700">{scanMessage}</p>
              </div>

              <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Workflow</p>
                <ul className="space-y-3 text-sm leading-6 text-slate-700">
                  {['Image uploaded', 'Landmarks detected', 'Record comparison', 'Confidence verified'].map((item, index) => {
                    const stepCompleted = scanProgress >= (index + 1) * 25;
                    return (
                      <li key={item} className="flex items-center gap-3">
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${stepCompleted ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600' : 'border-slate-300 text-slate-400'}`}>
                          {stepCompleted ? '✓' : index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Current status</p>
                <p className="mt-3 text-base font-medium text-slate-900">{stage}</p>
                <p className="mt-2 text-sm text-slate-600">Use high resolution images for the best match accuracy.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Scanning...' : 'Find Match'}
          </button>
        </form>
      </div>
    </div>
  );
}
