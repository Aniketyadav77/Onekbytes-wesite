/**
 * Utility functions for handling authentication cleanup and recovery
 */

export const clearAllAuthStorage = () => {
  try {
    // Clear all Supabase-related items from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase') || key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear any session storage as well
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('supabase') || key.startsWith('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('Cleared all auth storage');
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};

export const isRefreshTokenError = (error: unknown): boolean => {
  const errorMessage = (error as { message?: string })?.message || '';
  return errorMessage.includes('refresh_token_not_found') || 
         errorMessage.includes('Invalid Refresh Token') ||
         errorMessage.includes('Refresh Token Not Found');
};

/**
 * Emergency recovery function - call this if you're stuck with auth errors
 * Usage: Add ?clearAuth=true to any URL to force clear auth state
 */
export const checkForAuthRecovery = () => {
  if (typeof window === 'undefined') return;
  
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('clearAuth') === 'true') {
    console.log('Emergency auth recovery triggered');
    clearAllAuthStorage();
    // Remove the query parameter and reload
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
    window.location.reload();
  }
};
