import { useState, useEffect, useCallback } from 'react';
import {
  Server,
  FolderTree,
  FileCode2,
  Database,
  Code2,
  Activity,
  Sparkles,
} from 'lucide-react';
import { StudentRecord, HttpMethod } from './types';
import { StudentTable } from './components/StudentTable';
import { EndpointTester } from './components/EndpointTester';
import { ApiReference } from './components/ApiReference';

export default function App() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverHealth, setServerHealth] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [activeMethod, setActiveMethod] = useState<HttpMethod>('GET');
  const [elapsedTime, setElapsedTime] = useState('48:12');

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const json = await res.json();
        setStudents(json.data || []);
        setServerHealth('healthy');
      } else {
        setServerHealth('error');
      }
    } catch {
      setServerHealth('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setServerHealth('healthy');
      }
    } catch {
      setServerHealth('error');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    fetchStudents();
  }, [checkHealth, fetchStudents]);

  // Simulation timer for 60-min coding test vibe
  useEffect(() => {
    let seconds = 48 * 60 + 12;
    const interval = setInterval(() => {
      if (seconds > 0) {
        seconds -= 1;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        setElapsedTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleSelectForEdit = (_student: StudentRecord) => {
    setActiveMethod('PUT');
  };

  const handleSelectForView = (_id: string) => {
    setActiveMethod('GET');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#e4e4e7] font-sans selection:bg-indigo-500/30 overflow-x-hidden" id="student-api-app">
      {/* Immersive Glass Header */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-black/40 border-b border-white/10 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] shrink-0">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
                STUDENT API
              </h1>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                REST API
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">NODEJS_EXPRESS_MONGODB_STUDENT_API</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Server Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 shadow-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                serverHealth === 'healthy'
                  ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  : serverHealth === 'checking'
                  ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse'
                  : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
              }`}
            />
            <span
              className={`text-xs font-medium ${
                serverHealth === 'healthy'
                  ? 'text-emerald-400'
                  : serverHealth === 'checking'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {serverHealth === 'healthy' ? 'Server: Active' : serverHealth === 'checking' ? 'Connecting...' : 'Server Offline'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Test Timer:</span>
            <span className="text-white font-mono font-semibold">{elapsedTime}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Project Structure Sidebar (Desktop / Tablet) */}
        <aside className="hidden lg:flex w-64 bg-black/20 border-r border-white/5 flex-col shrink-0">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-indigo-400" /> Project Tree
            </span>
            <span className="text-[10px] font-mono text-zinc-500">60-min Clean</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li className="flex items-center gap-2 text-indigo-400 font-semibold">
                <FolderTree className="w-3.5 h-3.5" /> server/
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-300">
                <FolderTree className="w-3.5 h-3.5 text-zinc-500" /> config/
              </li>
              <li className="ml-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-orange-400" /> db.ts
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-300">
                <FolderTree className="w-3.5 h-3.5 text-zinc-500" /> controllers/
              </li>
              <li className="ml-8 flex items-center gap-2 text-zinc-100 font-medium">
                <FileCode2 className="w-3.5 h-3.5 text-orange-400" /> studentController.ts
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-300">
                <FolderTree className="w-3.5 h-3.5 text-zinc-500" /> middleware/
              </li>
              <li className="ml-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-orange-400" /> validateStudent.ts
              </li>
              <li className="ml-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-orange-400" /> errorHandler.ts
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-300">
                <FolderTree className="w-3.5 h-3.5 text-zinc-500" /> models/
              </li>
              <li className="ml-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-orange-400" /> Student.ts
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-300">
                <FolderTree className="w-3.5 h-3.5 text-zinc-500" /> routes/
              </li>
              <li className="ml-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-orange-400" /> studentRoutes.ts
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-300">
                <FileCode2 className="w-3.5 h-3.5 text-orange-400" /> server.ts
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-500">
                <FileCode2 className="w-3.5 h-3.5 text-zinc-500" /> .env.example
              </li>
              <li className="ml-4 flex items-center gap-2 text-zinc-500">
                <FileCode2 className="w-3.5 h-3.5 text-zinc-500" /> README.md
              </li>
            </ul>
          </div>

          {/* Sidebar Task Box */}
          <div className="p-4 bg-zinc-950/60 border-t border-white/5">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.05)]">
              <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Active Machine Test
              </div>
              <p className="text-xs text-white mt-1 font-medium">Question 2: Student REST API</p>
              <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-zinc-400">
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10">5 Endpoints</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10">Mongoose</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Workspace */}
        <section className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Hero Banner with Indigo Glow */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-7 bg-indigo-500 rounded-full shadow-[0_0_12px_#6366f1]"></span>
              Student REST API Console
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl">
              Node.js + Express.js + Mongoose student management endpoints designed with clean, modular architecture, validation middleware, and centralized error handling.
            </p>
          </div>

          {/* Interactive Endpoint Console */}
          <EndpointTester
            students={students}
            activeMethod={activeMethod}
            setActiveMethod={setActiveMethod}
            onExecuteSuccess={fetchStudents}
          />

          {/* Live Student Records Table */}
          <StudentTable
            students={students}
            isLoading={isLoading}
            onRefresh={fetchStudents}
            onSelectForEdit={handleSelectForEdit}
            onSelectForView={handleSelectForView}
            onDelete={handleDelete}
          />

          {/* API Reference & Architecture */}
          <ApiReference />
        </section>
      </div>

      {/* Immersive Terminal Footer */}
      <footer className="h-8 bg-black/70 border-t border-white/10 px-4 sm:px-6 flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono z-20">
        <div className="flex items-center gap-4">
          <span className="text-zinc-400">UTF-8</span>
          <span className="hidden sm:inline text-zinc-400">Node.js Express v4.21</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
            Mongoose Schema Loaded
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-indigo-400 font-semibold">REST API READY</span>
          <span className="text-zinc-400">Port 3000</span>
        </div>
      </footer>
    </div>
  );
}
