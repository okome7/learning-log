import { useMemo } from "react";
import type { Log, PeriodTab, SortOrder } from "../types";
import { startOfWeekISO, todayISO } from "../utils/date";

type Args = {
  logs: Log[];
  tab: PeriodTab;
  query: string;
  sort: SortOrder;
  selectedTags: string[];
  pickedDate: string | null;
};

export function useLogView({
  logs,
  tab,
  query,
  sort,
  selectedTags,
  pickedDate,
}: Args) {
  const counts = useMemo(() => {
    const t0 = todayISO();
    const w0 = startOfWeekISO();
    return {
      today: logs.filter((l) => l.date === t0).length,
      week: logs.filter((l) => l.date >= w0 && l.date <= t0).length,
      all: logs.length,
    };
  }, [logs]);

  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    const t0 = todayISO();
    const w0 = startOfWeekISO();

    const inPeriod = (l: Log) => {
      if (pickedDate) return l.date === pickedDate;
      if (tab === "today") return l.date === t0;
      if (tab === "week") return l.date >= w0 && l.date <= t0;
      return true;
    };

    const matchQuery = (l: Log) => {
      if (!q) return true;
      return (l.title + "\n" + l.content).toLowerCase().includes(q);
    };

    const matchTags = (l: Log) => {
      if (selectedTags.length === 0) return true;
      return selectedTags.every((t) => l.tags.includes(t));
    };

    const sortFn = (a: Log, b: Log) =>
      sort === "new" ? (a.date < b.date ? 1 : -1) : a.date > b.date ? 1 : -1;

    const pinned = logs
      .filter((l) => l.pinned)
      .filter(inPeriod)
      .filter(matchQuery)
      .filter(matchTags);

    const normal = logs
      .filter((l) => !l.pinned)
      .filter(inPeriod)
      .filter(matchQuery)
      .filter(matchTags)
      .sort(sortFn);

    return { pinned, normal };
  }, [logs, tab, query, sort, selectedTags, pickedDate]);

  const isFiltered =
    query !== "" || pickedDate !== null || selectedTags.length > 0;

  return { counts, view, isFiltered };
}
