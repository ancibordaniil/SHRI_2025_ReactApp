import type { AggregateResponse, HistoryEntry } from '../types/aggregate';

export function dayOfYearToDateString(dayOfYear: number): string {

  const year = new Date().getFullYear();
  const date = new Date(year, 0, dayOfYear - 1);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function buildHistoryEntry(
  response: AggregateResponse,
  fileName: string,
  success: boolean
): HistoryEntry {
  const {
    total_spend_galactic,
    rows_affected,
    less_spent_at,
    big_spent_at,
    less_spent_value,
    big_spent_value,
    average_spend_galactic,
    big_spent_civ,
    less_spent_civ,
  } = response;

  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    fileName,
    generatedAt: getCurrentTimestamp(),
    success,
    totalSpendGalactic: total_spend_galactic,
    rowsAffected: rows_affected,
    lessSpentDate: dayOfYearToDateString(less_spent_at),
    bigSpentDate: dayOfYearToDateString(big_spent_at),
    lessSpentValue: less_spent_value,
    bigSpentValue: big_spent_value,
    averageSpendGalactic: Math.round(average_spend_galactic),
    bigSpentCiv: big_spent_civ,
    lessSpentCiv: less_spent_civ,
  };
}
