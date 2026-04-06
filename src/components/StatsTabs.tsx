import type { PeriodTab } from "../types";

type Counts = { today: number; week: number; all: number };

type Props = {
  tab: PeriodTab;
  counts: Counts;
  onChangeTab: (tab: PeriodTab) => void;
};

export function StatsTabs({ tab, counts, onChangeTab }: Props) {
  return (
    <div className="stats">
      <button
        type="button"
        className={`statBtn ${tab === "today" ? "active" : ""}`}
        onClick={() => onChangeTab("today")}
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
        onClick={() => onChangeTab("week")}
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
        onClick={() => onChangeTab("all")}
      >
        <div className="label">全て</div>
        <div className="numRow">
          <span className="value">{counts.all}</span>
          <span className="unit">件</span>
        </div>
      </button>
    </div>
  );
}
