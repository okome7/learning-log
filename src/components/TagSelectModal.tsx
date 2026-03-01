import { useEffect, useMemo, useState } from "react";
const CREATED_TAGS_KEY = "learninglog_created_tags";

export default function TagSelectModal({
  allTags,
  initialSelected,
  onClose,
  onApply,
  onClear,
}: {
  allTags: string[];
  initialSelected: string[];
  onClose: () => void;
  onApply: (tags: string[]) => void;
  onClear: () => void;
}) {
  const [q, setQ] = useState("");
  const [local, setLocal] = useState<string[]>(initialSelected);
  const [created, setCreated] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CREATED_TAGS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((x) => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CREATED_TAGS_KEY, JSON.stringify(created));
    } catch {}
  }, [created]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const mergedTags = useMemo(() => {
    const set = new Set<string>([...allTags, ...created]);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ja"));
  }, [allTags, created]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mergedTags;
    return mergedTags.filter((t) => t.toLowerCase().includes(s));
  }, [mergedTags, q]);

  const toggle = (t: string) => {
    setLocal((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const inputName = q.trim();
  const canCreate = useMemo(() => {
    if (!inputName) return false;
    return !mergedTags.some((t) => t.toLowerCase() === inputName.toLowerCase());
  }, [inputName, mergedTags]);

  const createTag = () => {
    if (!canCreate) return;
    const name = inputName;

    setCreated((prev) => [...prev, name]);
    setLocal((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setQ("");
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="tagModal" onClick={(e) => e.stopPropagation()}>
        <div className="tagModalHeader">
          <div className="tagSearchRow">
            <input
              className="tagSearch"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="タグを検索（右の＋で追加）"
            />

            <button
              type="button"
              className="tagAddBtn"
              onClick={createTag}
              disabled={!canCreate}
              title={canCreate ? "タグを追加" : "追加できません"}
            >
              ＋追加
            </button>

            <button
              type="button"
              className="tagClearBtn"
              onClick={() => {
                setLocal([]);
                setQ("");
                onClear();
              }}
            >
              クリア
            </button>
          </div>
        </div>

        <div className="tagPickedRow">
          <span className="pickedBadge">選択中({local.length})</span>
        </div>

        <div className="tagList">
          {filtered.map((t) => {
            const checked = local.includes(t);
            return (
              <button
                type="button"
                key={t}
                className="tagListItem"
                onClick={() => toggle(t)}
              >
                <span className={`checkBox ${checked ? "on" : ""}`}>
                  {checked ? "✓" : ""}
                </span>
                <span className="tagName">{t}</span>
              </button>
            );
          })}
        </div>

        <div className="tagModalFooter">
          <button type="button" className="tagCancel" onClick={onClose}>
            キャンセル
          </button>
          <button
            type="button"
            className="tagApply"
            onClick={() => onApply(local)}
          >
            適用
          </button>
        </div>
      </div>
    </div>
  );
}
