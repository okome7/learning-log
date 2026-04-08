import { useEffect, useState } from "react";
import type { Log, PeriodTab, SortOrder } from "./types";
import { useLogs } from "./hooks/useLogs";
import { useLogView } from "./hooks/useLogView";
import { useToasts } from "./hooks/useToasts";
import { StatsTabs } from "./components/StatsTabs";
import { SearchBar } from "./components/SearchBar";
import { FilterControls } from "./components/FilterControls";
import { LogSection } from "./components/LogSection";
import { AppModals } from "./components/AppModals";
import { ToastHost } from "./components/ToastHost";

export default function App() {
  const {
    logs,
    addLog,
    updateLog,
    togglePinned,
    deleteLog,
    allTags,
    restoreLog,
  } = useLogs();

  const [tab, setTab] = useState<PeriodTab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("new");

  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [editingLog, setEditingLog] = useState<Log | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [deletingLog, setDeletingLog] = useState<Log | null>(null);

  const [pickedDate, setPickedDate] = useState<string | null>(null);

  const { toasts, pushToast, removeToast } = useToasts();

  const { counts, view, isFiltered } = useLogView({
    logs,
    tab,
    query,
    sort,
    selectedTags,
    pickedDate,
  });

  useEffect(() => {
    if (!menuOpenId) return;
    const onDown = () => setMenuOpenId(null);
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menuOpenId]);

  const clearFilters = () => {
    setQuery("");
    setPickedDate(null);
    setSelectedTags([]);
  };

  const handleDeleteConfirmed = (id: string) => {
    const idx = logs.findIndex((l) => l.id === id);
    const removed = logs[idx];
    deleteLog(id);

    if (selectedLog?.id === id) setSelectedLog(null);
    if (editingLog?.id === id) setEditingLog(null);
    if (menuOpenId === id) setMenuOpenId(null);
    setDeletingLog(null);

    pushToast({
      message: "ログを削除しました",
      tone: "danger",
      durationMs: 5000,
      actionLabel: "元に戻す",
      onAction: () => {
        restoreLog(removed, idx);
      },
    });
  };

  const requestDelete = (id: string) => {
    const target = logs.find((l) => l.id === id);
    if (!target) return;
    setDeletingLog(target);
    setMenuOpenId(null);
  };

  return (
    <div>
      <header className="header">
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          学習ログ ダッシュボード
        </div>
      </header>

      <main className="container">
        <StatsTabs tab={tab} counts={counts} onChangeTab={setTab} />

        <SearchBar
          query={query}
          onChangeQuery={setQuery}
          pickedDate={pickedDate}
          onChangePickedDate={setPickedDate}
          onAfterPickDate={() => setTab("all")}
        />

        <FilterControls
          selectedTagCount={selectedTags.length}
          sort={sort}
          onChangeSort={setSort}
          isFiltered={isFiltered}
          onClear={clearFilters}
          onOpenTagModal={() => setIsTagOpen(true)}
        />

        {view.pinned.length > 0 && (
          <LogSection
            title="ピン留めログ"
            logs={view.pinned}
            menuOpenId={menuOpenId}
            onSetMenuOpenId={setMenuOpenId}
            onOpenDetail={(log) => setSelectedLog(log)}
            onEdit={(log) => {
              setEditingLog(log);
              setMenuOpenId(null);
            }}
            onTogglePinned={(id) => {
              togglePinned(id);
              setMenuOpenId(null);
            }}
            onDelete={(id) => requestDelete(id)}
          />
        )}

        <LogSection
          title="通常ログ"
          logs={view.normal}
          emptyText="ログがありません"
          style={{ marginTop: 18 }}
          menuOpenId={menuOpenId}
          onSetMenuOpenId={setMenuOpenId}
          onOpenDetail={(log) => setSelectedLog(log)}
          onEdit={(log) => {
            setEditingLog(log);
            setMenuOpenId(null);
          }}
          onTogglePinned={(id) => {
            togglePinned(id);
            setMenuOpenId(null);
          }}
          onDelete={(id) => requestDelete(id)}
        />
      </main>

      <button className="fab" onClick={() => setIsAddOpen(true)}>
        +
      </button>

      <AppModals
        selectedLog={selectedLog}
        onCloseDetail={() => setSelectedLog(null)}
        isAddOpen={isAddOpen}
        onCloseAdd={() => setIsAddOpen(false)}
        onSaveAdd={(newLog) => {
          addLog(newLog);
          setIsAddOpen(false);
          pushToast({ message: "ログを保存しました", tone: "success" });
        }}
        editingLog={editingLog}
        onCloseEdit={() => setEditingLog(null)}
        onSaveEdit={(edited) => {
          updateLog(edited);
          setEditingLog(null);
          pushToast({ message: "変更を保存しました", tone: "success" });
        }}
        isTagOpen={isTagOpen}
        allTags={allTags}
        selectedTags={selectedTags}
        onCloseTag={() => setIsTagOpen(false)}
        onApplyTags={(next) => {
          setSelectedTags(next);
          setIsTagOpen(false);
        }}
        onClearTags={() => setSelectedTags([])}
        deletingLog={deletingLog}
        onCancelDelete={() => setDeletingLog(null)}
        onConfirmDelete={(id) => handleDeleteConfirmed(id)}
      />

      <ToastHost toasts={toasts} onClose={removeToast} />
    </div>
  );
}
