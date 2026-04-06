import { useEffect, useMemo, useState } from "react";
import type { Log } from "../types";
import { loadLogs, saveLogs } from "../storage";

export function useLogs() {
  const [logs, setLogs] = useState<Log[]>(() => loadLogs());

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  const togglePinned = (id: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, pinned: !l.pinned } : l)),
    );
  };

  const deleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const addLog = (newLog: Log) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const updateLog = (edited: Log) => {
    setLogs((prev) => prev.map((l) => (l.id === edited.id ? edited : l)));
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => l.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [logs]);

  const restoreLog = (log: Log, index: number) => {
    setLogs((prev) => {
      const next = [...prev];
      next.splice(index, 0, log);
      return next;
    });
  };

  return {
    logs,
    setLogs,
    addLog,
    updateLog,
    togglePinned,
    deleteLog,
    allTags,
    restoreLog,
  };
}
