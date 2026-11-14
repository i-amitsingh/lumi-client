import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-[100dvh] bg-[#f7f7f8] dark:bg-[#212121] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 dark:border-white/10 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-[100dvh] bg-[#f7f7f8] dark:bg-[#212121] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 dark:border-white/10 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;
  return children;
}

function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('lumi-theme');
      if (stored) return stored === 'dark';
    } catch {}
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem('lumi-theme', darkMode ? 'dark' : 'light'); } catch {}
  }, [darkMode]);

  return [darkMode, setDarkMode];
}

export default function App() {
  const [darkMode, setDarkMode] = useTheme();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
              </AuthRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Chat darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster
          position="top-center"
          toastOptions={{
            className: '!bg-gray-800 !text-gray-100 !text-sm',
            duration: 3000,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
