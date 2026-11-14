import ThemeToggle from './ThemeToggle';
import LumiLogo from './LumiLogo';

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  darkMode,
  onToggleDark,
  isOpen,
  onClose,
  user,
  onLogout,
  onEditProfile,
}) {
  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-40 w-[260px] flex flex-col
        bg-[#f0f0f0] dark:bg-[#171717] border-r border-gray-200/50 dark:border-white/5
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}
    >
      <div className="px-3 pt-3.5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <LumiLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 md:hidden transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {conversations.length === 0 && (
          <p className="px-3 py-8 text-xs text-gray-400 dark:text-gray-600 text-center">No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className={`
              group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-[13px] mb-0.5
              ${
                conv._id === activeId
                  ? 'bg-black/5 dark:bg-white/8 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-black/3 dark:hover:bg-white/5'
              }
            `}
            onClick={() => onSelect(conv._id)}
          >
            <span className="truncate flex-1">{conv.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv._id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-gray-200/50 dark:border-white/5 space-y-0.5">
        <ThemeToggle darkMode={darkMode} onToggle={onToggleDark} />

        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity"
              title="Edit profile"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate">{user.name}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
              </div>
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
