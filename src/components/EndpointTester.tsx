import { useState } from 'react';
import { Play, Copy, Check, Terminal, Sparkles } from 'lucide-react';
import { HttpMethod, TestResult, StudentRecord } from '../types';

interface EndpointTesterProps {
  students: StudentRecord[];
  activeMethod: HttpMethod;
  setActiveMethod: (m: HttpMethod) => void;
  onExecuteSuccess: () => void;
}

export function EndpointTester({
  students,
  activeMethod,
  setActiveMethod,
  onExecuteSuccess,
}: EndpointTesterProps) {
  // Parameters
  const [selectedId, setSelectedId] = useState<string>(students[0]?.id || '');
  const [customId, setCustomId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: 'Meera Sengupta',
    email: 'meera.sengupta@example.com',
    course: 'Cybersecurity',
    marks: '89',
  });

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);

  const getEffectiveId = () => customId.trim() || selectedId || (students[0]?.id ?? '');

  const getUrl = () => {
    if (activeMethod === 'GET' && !selectedId && !customId) {
      return '/api/students';
    }
    if (activeMethod === 'POST') {
      return '/api/students';
    }
    return `/api/students/${getEffectiveId() || ':id'}`;
  };

  const getCurlCommand = () => {
    const origin = window.location.origin;
    const url = `${origin}${getUrl()}`;

    if (activeMethod === 'GET') {
      return `curl -X GET "${url}"`;
    }
    if (activeMethod === 'DELETE') {
      return `curl -X DELETE "${url}"`;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      course: formData.course,
      marks: formData.marks === '' ? '' : Number(formData.marks),
    };

    return `curl -X ${activeMethod} "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(
      payload,
      null,
      2
    )}'`;
  };

  const executeRequest = async () => {
    setIsLoading(true);
    const start = performance.now();
    const url = getUrl();

    let options: RequestInit = {
      method: activeMethod,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (activeMethod === 'POST' || activeMethod === 'PUT') {
      const payload: Record<string, any> = {
        name: formData.name,
        email: formData.email,
        course: formData.course,
      };

      // Allow testing empty / invalid values
      if (formData.marks === '') {
        payload.marks = '';
      } else {
        const num = Number(formData.marks);
        payload.marks = isNaN(num) ? formData.marks : num;
      }

      options.body = JSON.stringify(payload);
    }

    try {
      const response = await fetch(url, options);
      const end = performance.now();
      const data = await response.json().catch(() => ({ raw: 'Non-JSON response' }));

      setLastResult({
        status: response.status,
        statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
        timeMs: Math.round(end - start),
        data,
        method: activeMethod,
        endpoint: url,
      });

      if (response.ok) {
        onExecuteSuccess();
      }
    } catch (err: any) {
      const end = performance.now();
      setLastResult({
        status: 500,
        statusText: 'Network Error',
        timeMs: Math.round(end - start),
        data: { success: false, error: err.message || 'Failed to fetch' },
        method: activeMethod,
        endpoint: url,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Preset Scenarios for testing validations
  const loadScenario = (type: string) => {
    if (type === 'valid-post') {
      setActiveMethod('POST');
      setFormData({
        name: 'Kabir Das',
        email: 'kabir.das@example.com',
        course: 'Cloud Computing',
        marks: '91',
      });
    } else if (type === 'missing-name') {
      setActiveMethod('POST');
      setFormData({
        name: '',
        email: 'test@example.com',
        course: 'Data Science',
        marks: '75',
      });
    } else if (type === 'invalid-email') {
      setActiveMethod('POST');
      setFormData({
        name: 'Alex Rivera',
        email: 'invalid-email-address',
        course: 'Web Development',
        marks: '80',
      });
    } else if (type === 'invalid-marks') {
      setActiveMethod('POST');
      setFormData({
        name: 'Nina Patel',
        email: 'nina@example.com',
        course: 'Software Engineering',
        marks: '145',
      });
    } else if (type === 'non-existing-id') {
      setActiveMethod('GET');
      setCustomId('64f1a2b3c4d5e6f7a8b9c999');
    } else if (type === 'malformed-id') {
      setActiveMethod('GET');
      setCustomId('not-a-valid-id');
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]';
    if (status >= 400 && status < 500) return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]';
  };

  return (
    <div className="bg-zinc-900/40 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-sm p-4 sm:p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]" id="api-tester-card">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Interactive Endpoint Console
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test request/response cycles, validation rules, status codes, and error middleware.
          </p>
        </div>

        {/* HTTP Method Switcher */}
        <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl gap-1 self-start sm:self-auto">
          {(['GET', 'POST', 'PUT', 'DELETE'] as HttpMethod[]).map((method) => {
            const isActive = activeMethod === method;
            return (
              <button
                key={method}
                onClick={() => {
                  setActiveMethod(method);
                  if (method === 'GET' && !customId && !selectedId && students.length > 0) {
                    setSelectedId(students[0].id);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  isActive
                    ? method === 'GET'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.25)]'
                      : method === 'POST'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                      : method === 'PUT'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.25)]'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                }`}
                id={`method-btn-${method.toLowerCase()}`}
              >
                {method}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Scenarios */}
      <div className="py-3 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
        <span className="text-zinc-400 font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Presets:
        </span>
        <button
          onClick={() => loadScenario('valid-post')}
          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 hover:border-indigo-500/30 whitespace-nowrap transition-colors"
        >
          Valid Create (201)
        </button>
        <button
          onClick={() => loadScenario('missing-name')}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 whitespace-nowrap transition-colors"
        >
          Missing Name (400)
        </button>
        <button
          onClick={() => loadScenario('invalid-email')}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 whitespace-nowrap transition-colors"
        >
          Bad Email (400)
        </button>
        <button
          onClick={() => loadScenario('invalid-marks')}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 whitespace-nowrap transition-colors"
        >
          Marks &gt; 100 (400)
        </button>
        <button
          onClick={() => loadScenario('non-existing-id')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 whitespace-nowrap transition-colors"
        >
          Non-existing ID (404)
        </button>
        <button
          onClick={() => loadScenario('malformed-id')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 whitespace-nowrap transition-colors"
        >
          Malformed ID (400)
        </button>
      </div>

      {/* Target URL Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-zinc-300 overflow-x-auto">
          <span
            className={`font-bold mr-2 px-2 py-0.5 rounded text-[10px] ${
              activeMethod === 'GET'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : activeMethod === 'POST'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : activeMethod === 'PUT'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {activeMethod}
          </span>
          <span className="text-zinc-500">/api/students</span>
          {(activeMethod === 'GET' && (selectedId || customId)) ||
          activeMethod === 'PUT' ||
          activeMethod === 'DELETE' ? (
            <span className="text-indigo-400 font-semibold">/{getEffectiveId()}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCurl}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 rounded-xl transition-colors"
            title="Copy cURL command"
            id="copy-curl-btn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'cURL'}</span>
          </button>

          <button
            onClick={executeRequest}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.35)]"
            id="execute-request-btn"
          >
            <Play className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Executing...' : 'Execute'}</span>
          </button>
        </div>
      </div>

      {/* Target Parameters for ID-based routes */}
      {(activeMethod === 'GET' || activeMethod === 'PUT' || activeMethod === 'DELETE') && (
        <div className="mt-4 p-3.5 bg-black/30 rounded-xl border border-white/5">
          <div className="text-xs font-semibold text-zinc-300 mb-2 font-mono">Target Student ID (:id parameter):</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">Select from existing records:</label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setCustomId('');
                }}
                className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-lg font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- {activeMethod === 'GET' ? 'None (Fetch all students)' : 'Select ID'} --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">Or enter custom/test ID:</label>
              <input
                type="text"
                placeholder="e.g. 64f1a2b3c4d5e6f7a8b9c0d1 or invalid-id"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-lg font-mono text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Request Body Editor for POST and PUT */}
      {(activeMethod === 'POST' || activeMethod === 'PUT') && (
        <div className="mt-4 p-3.5 bg-black/30 rounded-xl border border-white/5">
          <div className="text-xs font-semibold text-zinc-300 mb-2 font-mono">
            Request Body (JSON Payload):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">
                Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">
                Email <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">
                Course <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="Course Name"
                className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 text-[11px]">
                Marks (0 - 100) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                placeholder="e.g. 85"
                className="w-full px-3 py-2 bg-zinc-900/90 border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Response Box */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-300 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Response Inspector
          </span>
          {lastResult && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-mono font-bold ${getStatusColor(
                  lastResult.status
                )}`}
              >
                {lastResult.status} {lastResult.statusText}
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">{lastResult.timeMs}ms</span>
            </div>
          )}
        </div>

        <div className="bg-black/60 text-zinc-300 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-72 border border-white/10 shadow-inner">
          {lastResult ? (
            <pre className="leading-relaxed">{JSON.stringify(lastResult.data, null, 2)}</pre>
          ) : (
            <span className="text-zinc-600">
              Click &quot;Execute&quot; to invoke the Express endpoint and inspect the live JSON response payload.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
