import type { HistoryEntry } from '../types/aggregate';

const STORAGE_KEY = 'aggregateHistory';

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as HistoryEntry[];
    return arr;
  } catch (e) {
    console.error('Ошибка чтения истории из localStorage:', e);
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Ошибка записи истории в localStorage:', e);
  }
}

export function addHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const arr = loadHistory();
  arr.push(entry);
  saveHistory(arr);
  return arr;
}
