import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import InputBar from '../components/InputBar';
import ConfirmDialog from '../components/ConfirmDialog';
import ProfileModal from '../components/ProfileModal';

export default function Chat({ darkMode, onToggleDark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(user?.preferredModel || 'baidu/ernie-5.5-flash-preview:free');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [models, setModels] = useState([]);
  const abortRef = useRef(null);
  const skipNextLoad = useRef(false);

  useEffect(() => {
    api.conversations.list().then(setConversations).catch(() => {});
    api.chat.models().then(setModels).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    if (skipNextLoad.current) {
      skipNextLoad.current = false;
      return;
    }
    setLoadingConversation(true);
    api.conversations
      .get(activeId)
      .then((conv) => {
        setMessages(conv.messages || []);
        if (conv.model) setSelectedModel(conv.model);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingConversation(false));
  }, [activeId]);

  const handleNewChat = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setSidebarOpen(false);
  }, []);

  const handleDeleteChat = useCallback(
    async (id) => {
      try {
        await api.conversations.delete(id);
        setConversations((prev) => prev.filter((c) => c._id !== id));
        if (activeId === id) {
          setActiveId(null);
          setMessages([]);
        }
      } catch {
        // ignore
      }
    },
    [activeId]
  );

  const handleSelectChat = useCallback((id) => {
    setActiveId(id);
    setSidebarOpen(false);
  }, []);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const handleLogout = useCallback(async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleSend = useCallback(
    async (content) => {
      if (isStreaming) return;

      let conversationId = activeId;

      if (!conversationId) {
        try {
          const conv = await api.conversations.create({ model: selectedModel });
          setConversations((prev) => [conv, ...prev]);
          skipNextLoad.current = true;
          setActiveId(conv._id);
          conversationId = conv._id;
        } catch {
          return;
        }
      }

      setMessages((prev) => [...prev, { role: 'user', content, _id: 'temp-user-' + Date.now() }]);

      const assistantTempId = 'temp-assistant-' + Date.now();
      setMessages((prev) => [...prev, { role: 'assistant', content: '', _id: assistantTempId }]);

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await api.chat.send(conversationId, content, selectedModel);

        if (!response.ok) {
          const err = await response.json();
          setMessages((prev) =>
            prev.map((m) => (m._id === assistantTempId ? { ...m, content: `Error: ${err.error}` } : m))
          );
          setIsStreaming(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                fullContent += `\n\nError: ${parsed.error}`;
              } else if (parsed.content) {
                fullContent += parsed.content;
              }
              if (parsed.conversationTitle) {
                setConversations((prev) =>
                  prev.map((c) => (c._id === conversationId ? { ...c, title: parsed.conversationTitle } : c))
                );
              }

              setMessages((prev) =>
                prev.map((m) => (m._id === assistantTempId ? { ...m, content: fullContent } : m))
              );
            } catch {
              // skip
            }
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setMessages((prev) =>
            prev.map((m) => (m._id === assistantTempId ? { ...m, content: m.content || `Error: ${err.message}` } : m))
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [activeId, isStreaming, selectedModel]
  );

  return (
    <>
      <div className="flex h-[100dvh] bg-[#f7f7f8] dark:bg-[#212121] text-gray-900 dark:text-gray-100">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-[2px]" onClick={() => setSidebarOpen(false)} />
        )}

        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelectChat}
          onNew={handleNewChat}
          onDelete={handleDeleteChat}
          darkMode={darkMode}
          onToggleDark={onToggleDark}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
          onLogout={() => setShowLogoutConfirm(true)}
          onEditProfile={() => setShowProfile(true)}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 h-12 border-b border-gray-200/50 dark:border-white/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/8 md:hidden transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <span className="text-[13px] font-medium text-gray-500 dark:text-gray-500">
                {conversations.find((c) => c._id === activeId)?.title || 'New Chat'}
              </span>
            </div>
          </header>

          <ChatArea messages={messages} isStreaming={isStreaming} loading={loadingConversation} />
          <InputBar
            onSend={handleSend}
            isStreaming={isStreaming}
            onStop={handleStop}
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Sign out"
        message="Are you sure you want to sign out of your account?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}
