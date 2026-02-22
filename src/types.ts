export type PeriodTab = "today" | "week" | "all";
export type SortOrder = "new" | "old";

export type Log = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  images?: string[];
  pinned: boolean;
};
