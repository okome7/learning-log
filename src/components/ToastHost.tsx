import type { Toast } from "../hooks/useToasts";

type Props = {
  toasts: Toast[];
  onClose: (id: string) => void; // useToasts の removeToast を渡す
};

export function ToastHost({ toasts, onClose }: Props) {
  return (
    <div
      className="toastHost"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toastCard ${t.closing ? "closing" : ""} toast-${t.tone ?? "default"}`}
        >
          <div className="toastMsg">{t.message}</div>

          <div className="toastActions">
            {t.actionLabel && t.onAction && (
              <button
                type="button"
                className="toastBtn toastBtnAction"
                onClick={() => {
                  t.onAction?.();
                  onClose(t.id); // ← これでclosing→消える
                }}
              >
                {t.actionLabel}
              </button>
            )}

            <button
              type="button"
              className="toastBtn"
              onClick={() => onClose(t.id)}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
