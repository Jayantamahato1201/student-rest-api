import { useState } from 'react';
import { RefreshCw, Trash2, Edit3, UserCheck, AlertCircle } from 'lucide-react';
import { StudentRecord } from '../types';

interface StudentTableProps {
  students: StudentRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectForEdit: (student: StudentRecord) => void;
  onSelectForView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function StudentTable({
  students,
  isLoading,
  onRefresh,
  onSelectForEdit,
  onSelectForView,
  onDelete,
}: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.includes(searchTerm)
  );

  const getMarksBadge = (marks: number) => {
    if (marks >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]';
    if (marks >= 60) return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.15)]';
    if (marks >= 40) return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]';
  };

  return (
    <div className="bg-zinc-900/40 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.3)]" id="student-records-card">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>

      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Current Student Records</h2>
            <span className="px-2.5 py-0.5 text-xs font-mono font-medium bg-zinc-900 text-zinc-300 border border-white/10 rounded-full">
              {students.length} total
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Live database records fetched from <code className="text-indigo-400 font-mono">/api/students</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search name, email, course, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs px-3 py-2 bg-zinc-900/90 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-60"
          />
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-indigo-500/30 rounded-xl transition-colors disabled:opacity-50"
            id="refresh-students-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {students.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
            <p className="text-sm text-zinc-400">No student records found in database.</p>
            <p className="text-xs text-zinc-500 mt-1">Use the POST endpoint tester above to insert a new student.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-sm">
            No students match &quot;{searchTerm}&quot;.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Marks</th>
                <th className="py-3 px-4">Database ID</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{student.name}</div>
                    <div className="text-zinc-500 text-[11px] font-mono">{student.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-800/80 text-zinc-300 border border-white/5 font-mono text-xs">
                      {student.course}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-mono font-semibold ${getMarksBadge(
                        student.marks
                      )}`}
                    >
                      {student.marks} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                    <span title={student.id} className="bg-black/50 px-2 py-0.5 rounded border border-white/10">
                      {student.id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectForView(student.id)}
                        className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title="Test GET /:id"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onSelectForEdit(student)}
                        className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                        title="Load into PUT form"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(student.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Test DELETE /:id"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
