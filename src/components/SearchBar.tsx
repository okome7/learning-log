import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

type Props = {
  query: string;
  onChangeQuery: (q: string) => void;
  pickedDate: string | null;
  onChangePickedDate: (d: string | null) => void;
  onAfterPickDate?: () => void; // 例: setTab("all")したいとき
};

export function SearchBar({
  query,
  onChangeQuery,
  pickedDate,
  onChangePickedDate,
  onAfterPickDate,
}: Props) {
  const dateRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    const el = dateRef.current as any;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else dateRef.current?.click();
  };

  return (
    <div className="bar">
      <div className="search">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
        <input
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="タイトル・内容で検索"
        />
      </div>

      <div className="calendarWrap" onClick={openPicker}>
        <FontAwesomeIcon icon={faCalendar} className="calendarIcon" />
        <input
          ref={dateRef}
          type="date"
          className="calendarHit"
          value={pickedDate ?? ""}
          onChange={(e) => {
            onChangePickedDate(e.target.value || null);
            onAfterPickDate?.();
          }}
          aria-label="日付で絞り込み"
        />
      </div>
    </div>
  );
}
