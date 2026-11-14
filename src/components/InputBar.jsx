import { useState, useRef, useEffect } from 'react';
import ModelSelector from './ModelSelector';

export default function InputBar({
  onSend,
  isStreaming,
  onStop,
  models,
  selectedModel,
  onModelChange,
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isStreaming && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isStreaming]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-gradient-to-t from-[#f7f7f8] via-[#f7f7f8] to-transparent dark:from-[#212121] dark:via-[#212121] dark:to-transparent px-4 pb-4 pt-3">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end bg-white dark:bg-[#2f2f2f] rounded-2xl border border-gray-200 dark:border-white/10 focus-within:border-gray-300 dark:focus-within:border-white/20 transition-colors shadow-sm dark:shadow-lg dark:shadow-black/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message Lumi..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm leading-relaxed max-h-[200px] px-4 py-3.5"
            disabled={isStreaming}
          />

          <div className="flex items-center gap-1 pr-3 pb-3">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="p-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-80 transition-opacity"
                title="Stop generating"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className={`p-2 rounded-lg transition-all ${
                  input.trim()
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-80'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[11px] text-gray-400 dark:text-gray-600">
            Lumi can make mistakes. Verify important info.
          </span>
          {models.length > 0 && (
            <ModelSelector
              models={models}
              selected={selectedModel}
              onChange={onModelChange}
              compact
            />
          )}
        </div>
      </div>
    </div>
  );
}
