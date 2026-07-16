import { useEffect, useState } from 'react';

const API_BASE = '/api';

export default function CriminalForm({ setResult, setToast }) {
  const [formState, setFormState] = useState({ name: '', case_info: '' });
  const [files, setFiles] = useState({ front: null, left: null, right: null });
  const [previews, setPreviews] = useState({ front: null, left: null, right: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileChange = (side, file) => {
    setFiles((prev) => ({ ...prev, [side]: file }));
    setPreviews((prev) => {
      if (prev[side]) URL.revokeObjectURL(prev[side]);
      return { ...prev, [side]: file ? URL.createObjectURL(file) : null };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setToast('Adding criminal record...');

    const formData = new FormData();
    formData.append('name', formState.name);
    formData.append('case_info', formState.case_info);
    formData.append('image_front', files.front);
    formData.append('image_left', files.left);
    formData.append('image_right', files.right);

    try {
      const response = await fetch(`${API_BASE}/criminals/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      setToast(response.ok ? 'Criminal added successfully' : 'Failed to add criminal');
    } catch (error) {
      setResult({ error: 'Unable to connect with server.' });
      setToast('Server request failed');
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <h2 className="text-3xl font-semibold text-slate-900">Add a criminal record</h2>
        <p className="mt-3 text-slate-600">Submit three facial angles so the matching engine can build a reliable profile.</p>

        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Full name</span>
              <input
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="Enter suspect name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-600">Case summary</span>
              <textarea
                required
                rows="5"
                value={formState.case_info}
                onChange={(e) => setFormState({ ...formState, case_info: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="Add context for the criminal profile"
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {['Front', 'Left', 'Right'].map((label) => {
              const side = label.toLowerCase();
              return (
                <label
                  key={label}
                  className="block rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 transition hover:border-slate-300"
                >
                  <span className="block text-sm font-medium">{label} angle</span>
                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(side, e.target.files?.[0] || null)}
                    className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-900"
                  />
                  {previews[side] ? (
                    <img
                      src={previews[side]}
                      alt={`${label} preview`}
                      className="mt-4 h-40 w-full rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="mt-4 flex h-40 items-center justify-center rounded-3xl bg-white text-sm text-slate-500 shadow-sm">
                      Upload {label.toLowerCase()} photo
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-8 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving record...' : 'Save criminal profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
