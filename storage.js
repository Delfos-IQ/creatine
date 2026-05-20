const Storage = {
  getWater() {
    return parseInt(localStorage.getItem(WATER_STORAGE_KEY) || '0', 10);
  },
  setWater(value) {
    localStorage.setItem(WATER_STORAGE_KEY, String(value));
  },
  clearWater() {
    localStorage.setItem(WATER_STORAGE_KEY, '0');
  },
  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },
  setHistory(history) {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  },
  clearHistory() {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }
};