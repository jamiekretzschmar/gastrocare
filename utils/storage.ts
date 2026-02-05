
export const safeLocalStorage = {
  getItem: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return fallback;
    }
  },

  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      // Handle QuotaExceededError or other storage errors
      console.error(`Error saving ${key} to localStorage. Storage might be full.`, e);
      alert("Warning: Could not save data. Your local storage might be full.");
      return false;
    }
  }
};
