import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subValue, trend, trendUp, color }) => {
  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[var(--primary)] font-bold text-base">{title}</h3>
        <div className="text-[var(--text-secondary)]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </div>
      </div>

      <div className="text-3xl font-bold text-[var(--primary)] mb-2">{value !== undefined && value !== null ? value : '-'}</div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-[var(--text-secondary)]">Last Month</span>
        <span className={`font-bold ${trendUp ? 'text-[var(--accent)]' : 'text-red-500'}`}>
          {trend || '0%'}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
