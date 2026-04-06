import { useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  open,
  title,
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);

    // モーダル中はスクロール禁止（任意）
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="dcOverlay"
      role="dialog"
      aria-modal="true"
      aria-label="削除の確認"
      onMouseDown={(e) => {
        // overlayクリックで閉じたい場合は有効化（誤クリックが怖ければ消してOK）
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="dcCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="dcHeader">
          <div className="dcTitle">削除の確認</div>
          <button
            type="button"
            className="dcClose"
            onClick={onCancel}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <div className="dcBody">
          <div className="dcMessage">
            「<span className="dcTarget">{title}</span>」を削除しますか？
          </div>
          <div className="dcNote">この操作は取り消せません。</div>
        </div>

        <div className="dcFooter">
          <button type="button" className="dcBtn dcBtnGhost" onClick={onCancel}>
            キャンセル
          </button>
          <button
            type="button"
            className="dcBtn dcBtnDanger"
            onClick={onConfirm}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
