import { X } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  explanation: React.ReactNode;
  methodology?: React.ReactNode;
  children: React.ReactNode;
}

export function ChartModal({ isOpen, onClose, title, subtitle, explanation, methodology, children }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-5xl max-h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
            {subtitle && <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{subtitle}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">
          
          {/* Chart Area */}
          <div className="flex-1 min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100 p-4">
            {children}
          </div>

          {/* Context Area */}
          <div className="w-full md:w-80 shrink-0 space-y-6">
            
            <section>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">
                What this shows
              </h4>
              <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                {explanation}
              </div>
            </section>

            {methodology && (
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Technical Methodology
                </h4>
                <div className="text-xs text-slate-500 leading-relaxed">
                  {methodology}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
