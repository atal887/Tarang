import { useAppStore } from '../../store/appStore';
import { cn } from '../../lib/utils';
import { Beaker, Anchor } from 'lucide-react';

export function ModeToggle() {
  const { activeMode, setActiveMode } = useAppStore();

  return (
    <div className="flex bg-slate-200/50 p-1 rounded-lg border border-slate-200 backdrop-blur-sm shadow-inner">
      <button
        onClick={() => setActiveMode('Normal')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200",
          activeMode === 'Normal'
            ? "bg-white text-ocean-700 shadow-sm"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
        )}
      >
        <Anchor className="w-4 h-4" />
        <span className="hidden sm:inline">Normal</span>
      </button>
      <button
        onClick={() => setActiveMode('Research')}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200",
          activeMode === 'Research'
            ? "bg-ocean-600 text-white shadow-sm"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
        )}
      >
        <Beaker className="w-4 h-4" />
        <span className="hidden sm:inline">Research</span>
      </button>
    </div>
  );
}
