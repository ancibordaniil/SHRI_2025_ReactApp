import { create } from 'zustand';
import type { HistoryEntry } from '../types/aggregate';
import { loadHistory, addHistoryEntry } from '../utils/historyStorage';

interface HistoryState {
  history: HistoryEntry[];
  load: () => void;
  add: (entry: HistoryEntry) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  load: () => {
    const arr = loadHistory();
    set({ history: arr });
  },
  add: (entry: HistoryEntry) => {
    const updated = addHistoryEntry(entry);
    set({ history: updated });
  },
  clear: () => {
    localStorage.removeItem('aggregateHistory');
    set({ history: [] });
  },
}));
