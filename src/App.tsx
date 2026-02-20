import { useEffect, useMemo, useState } from "react";
import type { Log, PeriodTab, SortOrder } from "./types";
import { loadLogs, saveLogs } from "./storage";
import { todayISO, startOfWeekISO } from "./utils/date";

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

  const counts = useMemo(() => {
    const t0 = todayISO();
    const w0 = startOfWeekISO();
    return {
      today: logs.filter((l) => l.date === t0).length,
      week: logs.filter((l) => l.date >= w0 && l.date <= t0).length,
      all: logs.length,
    };
  }, [logs]);

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
      </main>
    </div>
  );
}
