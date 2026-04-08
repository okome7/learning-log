import type { Log } from "../types";
import { LogCard } from "./LogCard";

type Props = {
  title: string;
  logs: Log[];
  emptyText?: string;
  style?: React.CSSProperties;

  menuOpenId: string | null;
  onSetMenuOpenId: (id: string | null) => void;

  onOpenDetail: (log: Log) => void;
  onEdit: (log: Log) => void;
  onTogglePinned: (id: string) => void;
  onDelete: (id: string) => void;
};

export function LogSection({
  title,
  logs,
  emptyText,
  style,
  menuOpenId,
  onSetMenuOpenId,
  onOpenDetail,
  onEdit,
  onTogglePinned,
  onDelete,
}: Props) {
  return (
    <>
      <div className="sectionTitle" style={style}>
        {title}
      </div>

      <div className="cardList">
        {logs.map((l) => (
          <LogCard
            key={l.id}
            log={l}
            menuOpen={menuOpenId === l.id}
            onOpenDetail={() => onOpenDetail(l)}
            onToggleMenu={() =>
              onSetMenuOpenId(menuOpenId === l.id ? null : l.id)
            }
            onCloseMenu={() => onSetMenuOpenId(null)}
            onEdit={() => onEdit(l)}
            onTogglePinned={() => onTogglePinned(l.id)}
            onDelete={() => onDelete(l.id)}
          />
        ))}

        {logs.length === 0 && emptyText && (
          <div style={{ color: "#666" }}>{emptyText}</div>
        )}
      </div>
    </>
  );
}
