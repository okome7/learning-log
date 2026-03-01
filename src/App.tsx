import { useEffect, useState, useRef } from "react";
import type { Log, PeriodTab, SortOrder } from "./types";
import { LogCard } from "./components/LogCard";
import { LogDetailModal } from "./components/LogDetailModal";
import { LogFormModal } from "./components/LogFormModal";
import TagSelectModal from "./components/TagSelectModal";
import { useLogs } from "./hooks/useLogs";
import { useLogView } from "./hooks/useLogView";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTag,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function App() {
  const { logs, addLog, updateLog, togglePinned, deleteLog, allTags } =
    useLogs();

  const [tab, setTab] = useState<PeriodTab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("new");

  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [editingLog, setEditingLog] = useState<Log | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

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

  const handleDelete = (id: string) => {
    const deleted = deleteLog(id);
    if (!deleted) return;
    if (selectedLog?.id === id) setSelectedLog(null);
    if (editingLog?.id === id) setEditingLog(null);
    if (menuOpenId === id) setMenuOpenId(null);
  };

  return (
    <div>
      <header className="header">
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          学習ログ ダッシュボード
        </div>
      </header>

      <main className="container">
        {/* 統計タブ（今日 / 今週 / 全て を切り替えるボタン群） */}
        <div className="stats">
          <button
            type="button"
            className={`statBtn ${tab === "today" ? "active" : ""}`}
            onClick={() => setTab("today")}
          >
            <div className="label">今日</div>
            <div className="numRow">
              <span className="value">{counts.today}</span>
              <span className="unit">件</span>
            </div>
          </button>

          <button
            type="button"
            className={`statBtn ${tab === "week" ? "active" : ""}`}
            onClick={() => setTab("week")}
          >
            <div className="label">今週</div>
            <div className="numRow">
              <span className="value">{counts.week}</span>
              <span className="unit">件</span>
            </div>
          </button>

          <button
            type="button"
            className={`statBtn ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            <div className="label">全て</div>
            <div className="numRow">
              <span className="value">{counts.all}</span>
              <span className="unit">件</span>
            </div>
          </button>
        </div>

        {/* 検索欄 */}
        <div className="bar">
          <div className="search">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="タイトル・内容で検索"
            />
          </div>

          <div
            className="calendarWrap"
            onClick={() => {
              const el = dateRef.current as any;
              if (!el) return;

              if (typeof el.showPicker === "function") el.showPicker();
              else dateRef.current?.click();
            }}
          >
            <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />

            <input
              ref={dateRef}
              type="date"
              className="calendarHit"
              value={pickedDate ?? ""}
              onChange={(e) => {
                setPickedDate(e.target.value || null);
                setTab("all");
              }}
              aria-label="日付で絞り込み"
            />
          </div>
        </div>

        {/* フィルター操作（タグ選択・並び替え・クリア） */}
        <div className="controls">
          <button
            type="button"
            className="select"
            onClick={() => setIsTagOpen(true)}
          >
            <FontAwesomeIcon icon={faTag} className="icon" />
            <span style={{ fontWeight: 700 }}>タグを選択</span>
            {selectedTags.length > 0 && (
              <span style={{ marginLeft: 6, fontWeight: 800 }}>
                {selectedTags.length}
              </span>
            )}
          </button>

          <div className="select">
            <FontAwesomeIcon icon={faList} className="icon" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
            >
              <option value="new">新しい順</option>
              <option value="old">古い順</option>
            </select>
          </div>

          {isFiltered && (
            <button
              type="button"
              className="select clearBtn"
              onClick={clearFilters}
            >
              <span className="clearMark">×</span>クリア
            </button>
          )}
        </div>

        {/* ピン留めログ */}
        {view.pinned.length > 0 && (
          <>
            <div className="sectionTitle">ピン留めログ</div>
            <div className="cardList">
              {view.pinned.map((l) => (
                <LogCard
                  key={l.id}
                  log={l}
                  menuOpen={menuOpenId === l.id}
                  onOpenDetail={() => setSelectedLog(l)}
                  onToggleMenu={() =>
                    setMenuOpenId((prev) => (prev === l.id ? null : l.id))
                  }
                  onCloseMenu={() => setMenuOpenId(null)}
                  onEdit={() => {
                    setEditingLog(l);
                    setMenuOpenId(null);
                  }}
                  onTogglePinned={() => {
                    togglePinned(l.id);
                    setMenuOpenId(null);
                  }}
                  onDelete={() => {
                    handleDelete(l.id);
                    setMenuOpenId(null);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* 通常ログ */}
        <div className="sectionTitle" style={{ marginTop: 18 }}>
          通常ログ
        </div>
        <div className="cardList">
          {view.normal.map((l) => (
            <LogCard
              key={l.id}
              log={l}
              menuOpen={menuOpenId === l.id}
              onOpenDetail={() => setSelectedLog(l)}
              onToggleMenu={() =>
                setMenuOpenId((prev) => (prev === l.id ? null : l.id))
              }
              onCloseMenu={() => setMenuOpenId(null)}
              onEdit={() => {
                setEditingLog(l);
                setMenuOpenId(null);
              }}
              onTogglePinned={() => {
                togglePinned(l.id);
                setMenuOpenId(null);
              }}
              onDelete={() => {
                deleteLog(l.id);
                setMenuOpenId(null);
              }}
            />
          ))}
          {view.normal.length === 0 && (
            <div style={{ color: "#666" }}>ログがありません</div>
          )}
        </div>
      </main>

      {/* 詳細ログ */}
      {selectedLog && (
        <LogDetailModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}

      {/* 追加ボタン */}
      <button className="fab" onClick={() => setIsAddOpen(true)}>
        +
      </button>

      {/* 追加モーダル */}
      {isAddOpen && (
        <LogFormModal
          mode="add"
          allTags={allTags}
          onClose={() => setIsAddOpen(false)}
          onSave={(newLog) => {
            addLog(newLog);
            setIsAddOpen(false);
          }}
        />
      )}
      {editingLog && (
        <LogFormModal
          mode="edit"
          initial={editingLog}
          allTags={allTags}
          onClose={() => setEditingLog(null)}
          onSave={(edited) => {
            updateLog(edited);
            setEditingLog(null);
          }}
        />
      )}

      {isTagOpen && (
        <TagSelectModal
          allTags={allTags}
          initialSelected={selectedTags}
          onClose={() => setIsTagOpen(false)}
          onApply={(next) => {
            setSelectedTags(next);
            setIsTagOpen(false);
          }}
          onClear={() => setSelectedTags([])}
        />
      )}
    </div>
  );
}
