import { useCallback, useRef, useState } from "react";

export type ToastTone = "default" | "success" | "danger";

export type Toast = {
  id: string;
  message: string;
  tone?: ToastTone;
  durationMs?: number; // 0なら自動で消さない
  actionLabel?: string;
  onAction?: () => void;

  // 追加：closingアニメ用
  closing?: boolean;
};

const CLOSE_ANIM_MS = 180;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 自動で消す用タイマー
  const timers = useRef(new Map<string, number>());
  // closing後に実際に消す用タイマー
  const closeTimers = useRef(new Map<string, number>());

  const reallyRemove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const ct = closeTimers.current.get(id);
    if (ct) {
      window.clearTimeout(ct);
      closeTimers.current.delete(id);
    }
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      // 自動タイマーは止める
      const timer = timers.current.get(id);
      if (timer) {
        window.clearTimeout(timer);
        timers.current.delete(id);
      }

      // すでにclosingなら何もしない（二重実行防止）
      let alreadyClosing = false;
      setToasts((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          if (t.closing) {
            alreadyClosing = true;
            return t;
          }
          return { ...t, closing: true };
        }),
      );
      if (alreadyClosing) return;

      // closingアニメ後に実際に消す
      const ct = window.setTimeout(() => {
        reallyRemove(id);
      }, CLOSE_ANIM_MS);

      closeTimers.current.set(id, ct);
    },
    [reallyRemove],
  );

  const pushToast = useCallback(
    (toast: Omit<Toast, "id" | "closing">) => {
      const id = crypto.randomUUID();
      const t: Toast = {
        id,
        tone: "default",
        durationMs: 2600,
        ...toast,
        closing: false,
      };

      setToasts((prev) => [t, ...prev].slice(0, 3)); // 最大3つ

      const dur = t.durationMs ?? 0;
      if (dur > 0) {
        // dur経過したら removeToast を呼ぶ（＝closing → toastOut → 消える）
        const timer = window.setTimeout(() => removeToast(id), dur);
        timers.current.set(id, timer);
      }

      return id;
    },
    [removeToast],
  );

  const clearAll = useCallback(() => {
    // いったん全部タイマー止める
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();

    closeTimers.current.forEach((timer) => window.clearTimeout(timer));
    closeTimers.current.clear();

    setToasts([]);
  }, []);

  return { toasts, pushToast, removeToast, clearAll };
}
