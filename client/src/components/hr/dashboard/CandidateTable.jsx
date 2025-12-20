import React from 'react';
import { Calendar, ChevronDown, MoreHorizontal, User } from 'lucide-react';

const CandidateTable = ({ candidates = [] }) => {
  // const candidates = [ ... ] hardcoded removed

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[var(--primary)] font-bold text-base">Recent Candidates</h3>
        <div className="text-[var(--text-secondary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-xs text-[var(--primary)] font-bold bg-[var(--bg-primary)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
          <Calendar className="w-3 h-3" />
          <span>Last 7 Days</span>
          <ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" />
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-1 text-xs font-bold text-[var(--primary)] bg-[var(--bg-primary)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
            All Candidates <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] border-y border-[var(--border)]">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Applied Date</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {candidates.map((candidate, index) => (
              <tr key={index} className="hover:bg-[var(--bg-primary)] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] font-bold text-xs">
                      {candidate.name.charAt(0)}
                    </div>
                    <span className="font-bold text-[var(--primary)]">{candidate.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-[var(--text-secondary)]">{candidate.role}</td>
                <td className="px-4 py-4 font-medium text-[var(--text-secondary)]">{candidate.date}</td>
                <td className="px-4 py-4 font-bold text-[var(--primary)]">{candidate.stage}</td>
                <td className="px-4 py-4">
                  <span className={`flex items-center gap-1.5 font-bold text-xs ${candidate.statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${candidate.statusColor.replace('text', 'bg')}`}></span>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="text-[var(--text-secondary)] hover:text-[var(--primary)]">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateTable;
