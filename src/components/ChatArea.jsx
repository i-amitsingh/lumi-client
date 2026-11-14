import { useEffect, useRef } from 'react';
import Message from './Message';
import WelcomeScreen from './WelcomeScreen';

export default function ChatArea({ messages, isStreaming, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex-1 overflow-y-auto">
      <div>
        {messages.map((msg, i) => (
          <Message key={msg._id || i} message={msg} isLast={i === messages.length - 1 && isStreaming} />
        ))}
      </div>
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
