import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden bg-[#0d0d0d] border border-white/5">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 text-gray-500 text-xs">
        <span className="font-medium">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.8125rem',
          lineHeight: '1.6',
          background: '#0d0d0d',
          padding: '1rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function LumiAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 mt-0.5">
      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.5 5.1a3 3 0 002.2 2.2L21 10.8l-5.3 1.5a3 3 0 00-2.2 2.2L12 19.8l-1.5-5.3a3 3 0 00-2.2-2.2L3 10.8l5.3-1.5a3 3 0 002.2-2.2L12 2z" />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-[#3a3a3a] flex items-center justify-center shrink-0 mt-0.5">
      <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    </div>
  );
}

export default function Message({ message, isLast }) {
  const isUser = message.role === 'user';

  return (
    <div className="py-4 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="flex gap-3">
          {isUser ? <UserAvatar /> : <LumiAvatar />}

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1">
              {isUser ? 'You' : 'Lumi'}
            </p>

            {isUser ? (
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-7 text-[15px]">
                {message.content}
              </p>
            ) : (
              <div className="message-content text-gray-800 dark:text-gray-200 leading-7 text-[15px]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      if (!inline && match) {
                        return <CodeBlock language={match[1]}>{children}</CodeBlock>;
                      }
                      if (!inline) {
                        return <CodeBlock>{children}</CodeBlock>;
                      }
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-[13px] font-mono text-amber-600 dark:text-amber-400"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    p({ children }) {
                      return <p className="mb-3 last:mb-0">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-2 border-amber-400/50 pl-4 my-3 text-gray-500 dark:text-gray-400 italic">
                          {children}
                        </blockquote>
                      );
                    },
                    a({ href, children }) {
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 underline decoration-amber-400/30 hover:decoration-amber-400">
                          {children}
                        </a>
                      );
                    },
                    strong({ children }) {
                      return <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>;
                    },
                  }}
                >
                  {message.content || ' '}
                </ReactMarkdown>
                {isLast && (
                  <span className="inline-block w-1.5 h-4 bg-amber-500 cursor-blink rounded-sm ml-0.5 align-middle" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
