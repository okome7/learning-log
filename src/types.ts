export type PeriodTab = "today" | "week" | "all"
export type SortOrder = "new" | "old"

export type Log = {
    id: string;
    title: string;
    content: string;
    tags: string[];
    pinned: boolean;
    images: string[];
}