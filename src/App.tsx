import { useEffect, useMemo, useState } from "react";
import type { Log, PeriodTab, SortOrder } from "./types";
import { loadLogs, saveLogs } from "./storage";
import { todayISO, startOfWeekISO } from "./utils/date";
import { LogCard } from "./components/LogCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faTag,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

const seedLogs = (): Log[] => [
  {
    id: crypto.randomUUID(),
    title: "Reactで学習ログアプリのUIを作成",
    date: "2026-02-18",
    tags: ["React", "TypeScript"],
    content:
      "ダッシュボード画面のレイアウトを作成し、検索バーと期間タブを配置した。",
    images: [],
    pinned: true,
  },
  {
    id: crypto.randomUUID(),
    title: "サブネットマスクの計算問題を演習",
    date: "2026-02-19",
    tags: ["応用情報", "ネットワーク"],
    content: "2進数への変換手順を覚えて、ホスト数を求める問題を何問か解いた。",
    images: [],
    pinned: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Todoの完了切替機能を実装",
    date: "2026-02-20",
    tags: ["React"],
    content: "チェックボックスで状態を更新し、UIに反映されるようにした。",
    images: [],
    pinned: false,
  },
];

export default function App() {
  const [logs, setLogs] = useState<Log[]>(() => {
    const loaded = loadLogs();
    return loaded.length > 0 ? loaded : seedLogs();
  });

  const [tab, setTab] = useState<PeriodTab>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("new");

  // タブ選択モーダル
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 三点メニュー
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // モーダル
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [editingLog, setEditingLog] = useState<Log | null>(null);

  // 統計タブの件数を計算
  const counts = useMemo(() => {
    const t0 = todayISO();
    const w0 = startOfWeekISO();
    return {
      today: logs.filter((l) => l.date === t0).length,
      week: logs.filter((l) => l.date >= w0 && l.date <= t0).length,
      all: logs.length,
    };
  }, [logs]);

  // ログ表示用のデータを計算
  const view = useMemo(() => {
    const q = query.trim().toLowerCase();
    const t0 = todayISO();
    const w0 = startOfWeekISO();

    const inPeriod = (l: Log) => {
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
  }, [logs, tab, query, sort, selectedTags]);

  // メニュー外クリックで閉じる
  useEffect(() => {
    if (!menuOpenId) return;
    const onDown = () => setMenuOpenId(null);
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menuOpenId]);

  const togglePinned = (id: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, pinned: !l.pinned } : l)),
    );
  };

  const deleteLog = (id: string) => {
    const ok = confirm("このログを削除しますか？");
    if (!ok) return;
    setLogs((prev) => prev.filter((l) => l.id !== id));
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
              <span className="numRow">
                <span className="value">{counts.today}</span>
                <span className="unit">件</span>
              </span>
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
          <FontAwesomeIcon icon={faCalendar} className="icon" />
        </div>

        {/* タグを選択 */}
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
                    deleteLog(l.id);
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
    </div>
  );
}
