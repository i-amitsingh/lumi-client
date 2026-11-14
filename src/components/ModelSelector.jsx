import { useState, useRef, useEffect } from 'react';

export default function ModelSelector({ models, selected, onChange, compact }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = models.find((m) => m.id === selected);

  if (!compact) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <span className="font-medium">{current?.name || 'Select model'}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-60 bg-white dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-black/40 overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-gray-100 dark:border-white/5">
            <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Model</p>
          </div>
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onChange(m.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                m.id === selected ? 'bg-gray-50 dark:bg-white/5' : ''
              }`}
            >
              <div>
                <p className="text-[13px] font-medium text-gray-900 dark:text-gray-200">{m.name}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{m.provider}</p>
              </div>
              {m.id === selected && (
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
