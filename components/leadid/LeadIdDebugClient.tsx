'use client';

import { useLeadId } from '@/components/leadid/LeadIdProvider';

export function LeadIdDebugClient() {
  const { debug, reInit, token, tokenValid } = useLeadId();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-300">LeadID Debug</p>
            <h1 className="mt-2 text-3xl font-black">Jornaya token diagnostics</h1>
          </div>
          <button
            type="button"
            onClick={() => reInit('debug-page-manual')}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-900"
          >
            ReInit Jornaya
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Script loaded</p>
            <p className="mt-2 text-2xl font-black">{debug.scriptLoaded ? 'Yes' : 'No'}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Token valid</p>
            <p className="mt-2 text-2xl font-black">{tokenValid ? 'Yes' : 'No'}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">LeadiD object</p>
            <p className="mt-2 text-2xl font-black">{debug.jornayaAvailable ? 'Available' : 'Missing'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current token</p>
          <p className="mt-3 break-all font-mono text-sm text-teal-200">{token || '-'}</p>
        </div>

        <pre className="mt-6 overflow-auto rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-xs text-slate-200">
          {JSON.stringify(debug, null, 2)}
        </pre>
      </div>
    </main>
  );
}
