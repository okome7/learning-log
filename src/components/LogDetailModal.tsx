import { useEffect, useState } from "react";
import type { Log } from "../types";

type Props = {
  log: Log;
  onClose: () => void;
};

export function LogDetailModal({ log, onClose }: Props) {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const images = log.images ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (zoomSrc) setZoomSrc(null);
      else onClose();
    };

    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, zoomSrc]);

  return (
    <>
      <div className="modalOverlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <div className="modalTitleRow">
              <div className="modalTitle">学習ログ　詳細</div>
              <button
                type="button"
                className="modalClose"
                onClick={onClose}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="modalDivider" />
          </div>

          <div className="modalBody">
            <div className="modalLogTitle">{log.title}</div>
            <div className="modalDate">{log.date}</div>

            <div className="tags" style={{ marginTop: 6 }}>
              {log.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>

            <div className="modalSection">
              <div className="modalSectionTitle">内容</div>
              <div className="modalText">{log.content}</div>
            </div>

            {images.length > 0 && (
              <div className="modalSection">
                <div className="modalSectionTitle">画像</div>
                <div className="modalImages">
                  {images.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      className="modalImgWrap"
                      onClick={() => setZoomSrc(src)}
                      aria-label="画像を拡大"
                      title="クリックで拡大"
                    >
                      <img src={src} className="modalImg" alt="" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {zoomSrc && (
        <div className="zoomOverlay" onClick={() => setZoomSrc(null)}>
          <div className="zoomContent" onClick={(e) => e.stopPropagation()}>
            <button
              className="zoomClose"
              onClick={() => setZoomSrc(null)}
              aria-label="閉じる"
            >
              ×
            </button>
            <img src={zoomSrc} className="zoomImg" alt="" />
          </div>
        </div>
      )}
    </>
  );
}
