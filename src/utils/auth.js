/**
 * Auth utility functions with automatic event dispatching
 * for real-time auth state synchronization
 */

/**
 * Set authentication token and notify the app
 * @param {string} token - The authentication token
 */
export const setAuthToken = (token) => {
    localStorage.setItem("token", token);
    // Dispatch custom event to notify components
    window.dispatchEvent(new Event("auth-change"));
};

/**
 * Remove authentication token and notify the app
 */
export const removeAuthToken = () => {
    localStorage.removeItem("token");
    // Dispatch custom event to notify components
    window.dispatchEvent(new Event("auth-change"));
};

/**
 * Get authentication token
 * @returns {string|null} The authentication token or null
 */
export const getAuthToken = () => {
    return localStorage.getItem("token");
};
