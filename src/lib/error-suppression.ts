// Error suppression utilities for development
// This helps reduce noise from browser extensions and development tools

export const suppressConsoleErrors = () => {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return;
  }

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;

  // List of error patterns to suppress
  const suppressPatterns = [
    /WebSocket connection to 'ws:\/\/localhost:\d+\/' failed/,
    /Unchecked runtime\.lastError/,
    /The message port closed before a response was received/,
    /inject\.bundle\.js/,
    /Failed to load resource.*404/
  ];

  // Override console.error
  console.error = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };

  // Override console.warn
  console.warn = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = suppressPatterns.some(pattern => pattern.test(message));
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };
};

// Initialize error suppression in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  suppressConsoleErrors();
}
