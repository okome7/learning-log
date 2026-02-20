import type { Log } from "./types";

const KEY = "learning_logs_v1";

export const loadLogs = (): Log[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed as Log[]) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveLogs = (logs: Log[]) => {
  localStorage.setItem(KEY, JSON.stringify(logs));
};
