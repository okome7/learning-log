import type { Log } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtack,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { formatJP } from "../utils/date";

type Props = {
  log: Log;
  menuOpen: boolean;
  onOpenDetail: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onEdit: () => void;
  onTogglePinned: () => void;
  onDelete: () => void;
};

export function LogCard({
  log,
  menuOpen,
  onOpenDetail,
  onToggleMenu,
  onEdit,
  onTogglePinned,
  onDelete,
}: Props) {
  const images = log.images ?? [];

  const hasPin = log.pinned;

  return (
    <div
      className={`card clickable ${hasPin ? "hasPin" : ""}`}
      role="button"
      tabIndex={0}
      onClick={onOpenDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenDetail();
      }}
    >
      {/*  左 */}
      <div className="pinCol">
        {hasPin && <FontAwesomeIcon icon={faThumbtack} className="pinIcon" />}
      </div>

      {/*  真ん中*/}
      <div className="cardMain">
        <div className="cardTitle">{log.title}</div>

        <div className="tags">
          {log.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>

        <div className="cardText">{log.content}</div>

        {images.length > 0 && (
          <div className="thumbRow">
            {images.slice(0, 2).map((src) => (
              <img key={src} src={src} className="thumb" alt="" />
            ))}
            {images.length > 2 && (
              <div className="thumbMore">+{images.length - 2}</div>
            )}
          </div>
        )}
      </div>

      {/*  右 */}
      <div className="cardRight">
        <div className="cardDate">{formatJP(log.date)}</div>

        <div className="menuWrap" onMouseDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="menuBtn"
            aria-label="メニュー"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>

          {menuOpen && (
            <div
              className="menu"
              onClick={(e) => e.stopPropagation()}
              role="menu"
            >
              <button type="button" className="menuItem" onClick={onEdit}>
                編集
              </button>

              <button
                type="button"
                className="menuItem"
                onClick={onTogglePinned}
              >
                {hasPin ? "ピン留め解除" : "ピン留め"}
              </button>

              <button
                type="button"
                className="menuItem danger"
                onClick={onDelete}
              >
                削除
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
