import { CheckCircle2, ShieldCheck, Database, FileCode2 } from 'lucide-react';

export function ApiReference() {
  return (
    <div className="bg-zinc-900/40 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-sm p-4 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]" id="api-reference-card">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>

      <div className="flex items-center gap-2 pb-4 border-b border-white/10">
        <Database className="w-4 h-4 text-indigo-400" />
        <h2 className="text-base font-semibold text-white">API Architecture & Endpoint Specification</h2>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Endpoints Table */}
        <div className="border border-white/10 rounded-xl p-4 bg-black/30">
          <div className="text-xs font-semibold text-zinc-200 mb-3 flex items-center gap-1.5 font-mono">
            <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
            Route Mappings (<code className="text-indigo-400">/api/students</code>)
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold font-mono text-[10px]">GET</span>
                <span className="font-mono text-zinc-200">/api/students</span>
              </div>
              <span className="text-zinc-500 text-[11px] font-mono">List all (200)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold font-mono text-[10px]">GET</span>
                <span className="font-mono text-zinc-200">/api/students/:id</span>
              </div>
              <span className="text-zinc-500 text-[11px] font-mono">By ID (200/404/400)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold font-mono text-[10px]">POST</span>
                <span className="font-mono text-zinc-200">/api/students</span>
              </div>
              <span className="text-zinc-500 text-[11px] font-mono">Create (201/400)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold font-mono text-[10px]">PUT</span>
                <span className="font-mono text-zinc-200">/api/students/:id</span>
              </div>
              <span className="text-zinc-500 text-[11px] font-mono">Update (200/400/404)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/80 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold font-mono text-[10px]">DELETE</span>
                <span className="font-mono text-zinc-200">/api/students/:id</span>
              </div>
              <span className="text-zinc-500 text-[11px] font-mono">Delete (200/404/400)</span>
            </div>
          </div>
        </div>

        {/* Validation & Status Rules */}
        <div className="border border-white/10 rounded-xl p-4 bg-black/30">
          <div className="text-xs font-semibold text-zinc-200 mb-3 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Validation & Error Handling Contract
          </div>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-200">Name:</strong> Required, string, trimmed of surrounding whitespace.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-200">Email:</strong> Required, trimmed, converted to lowercase, verified against regex <code className="bg-black/60 border border-white/10 px-1 py-0.5 rounded font-mono text-[10px] text-zinc-300">/^[^\s@]+@[^\s@]+\.[^\s@]+$/</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-200">Course:</strong> Required, string, trimmed.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-200">Marks:</strong> Required numeric value strictly constrained between <code className="bg-black/60 border border-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-zinc-300">0</code> and <code className="bg-black/60 border border-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-zinc-300">100</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-200">Central Error Handler:</strong> Automatically transforms Mongoose <code className="text-indigo-400 font-mono">CastError</code> into 400 Bad Request and missing IDs into 404 Not Found.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
