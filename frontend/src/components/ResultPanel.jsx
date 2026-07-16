export default function ResultPanel({ result }) {
  if (!result) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/90 p-8 text-slate-400 shadow-xl shadow-slate-950/10">
        <p className="text-base leading-7">No results yet. Submit a photo to see the uploaded image and matched criminal profile side by side.</p>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="mt-8 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-100 shadow-xl shadow-slate-950/10">
        <h3 className="text-lg font-semibold text-white">Unable to complete scan</h3>
        <p className="mt-3 text-sm leading-7 text-slate-200">{result.error}</p>
      </div>
    );
  }

  const hasMatch = result.criminal != null;
  const confidence = result.confidence ? Number(result.confidence) : null;

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Result overview</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{hasMatch ? 'Match identified' : 'No match found'}</h3>
        </div>
        <div className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${hasMatch ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
          {hasMatch ? 'Match detected' : 'No match'}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Uploaded image</p>
          {result.uploadedImage ? (
            <img src={result.uploadedImage} alt="Uploaded suspect" className="mt-4 h-64 w-full rounded-3xl object-cover" />
          ) : (
            <div className="mt-4 h-64 rounded-3xl bg-slate-100 grid place-items-center text-slate-500">Uploaded image will appear here</div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Matched image</p>
          {hasMatch && result.criminal?.image ? (
            <img src={result.criminal.image} alt={result.criminal.name} className="mt-4 h-64 w-full rounded-3xl object-cover" />
          ) : (
            <div className="mt-4 h-64 rounded-3xl bg-slate-100 grid place-items-center text-slate-500">
              {hasMatch ? 'Matched image unavailable' : 'No match image available'}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Match summary</p>
          <div className="mt-4 space-y-4 text-slate-700">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Status</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{result.message || (hasMatch ? 'Match found' : 'No match found')}</p>
            </div>
            {confidence !== null && (
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Confidence</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{Math.round(confidence * 100)}%</p>
              </div>
            )}
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Notes</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{hasMatch ? 'Review the matched criminal profile and confirm identity.' : 'No profile exceeded the threshold. Try a different image or add a new record.'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Details</p>
          <div className="mt-4 space-y-4 text-slate-700">
            <div>
              <p className="text-sm text-slate-500">Matched profile</p>
              <p className="mt-2 text-base font-medium text-slate-900">{result.criminal?.name || 'No matched record'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Case info</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{result.criminal?.case_info || 'No case details available for this result.'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Action</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{hasMatch ? 'Proceed with verification and alert relevant teams.' : 'Upload another image or add a new criminal profile.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
