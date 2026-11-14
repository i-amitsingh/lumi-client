import { useEffect, useRef, useState, useCallback } from 'react';
import Message from './Message';
import WelcomeScreen from './WelcomeScreen';

export default function ChatArea({ messages, isStreaming, loading }) {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const isNearBottom = useRef(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 100;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    isNearBottom.current = nearBottom;
    setShowScrollBtn(!nearBottom && messages.length > 0);
  }, [messages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  useEffect(() => {
    if (isNearBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-200 dark:border-white/10 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex-1 overflow-y-auto relative" ref={scrollRef}>
      <div>
        {messages.map((msg, i) => (
          <Message
            key={msg._id || i}
            message={msg}
            isLast={i === messages.length - 1 && isStreaming}
          />
        ))}
      </div>
      <div ref={bottomRef} className="h-4" />

      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="sticky bottom-4 left-1/2 -translate-x-1/2 ml-[50%] w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#3a3a3a] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-black/30 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all hover:scale-105 z-10"
          title="Scroll to bottom"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}
