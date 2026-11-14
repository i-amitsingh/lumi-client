export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="welcome-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#F97316" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="url(#welcome-grad)" />
              <path
                d="M20 7l2.4 8a3.5 3.5 0 002.6 2.6L33 20l-8 2.4a3.5 3.5 0 00-2.6 2.6L20 33l-2.4-8a3.5 3.5 0 00-2.6-2.6L7 20l8-2.4a3.5 3.5 0 002.6-2.6L20 7z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1.5">
          How can I help you today?
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Ask me anything — I'm here to help.
        </p>
      </div>
    </div>
  );
}
