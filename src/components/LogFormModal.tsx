import { useEffect, useRef, useState } from "react";
import type { Log } from "../types";
import { todayISO } from "../utils/date";
import { filesToDataURLs } from "../utils/files";
import TagSelectModal from "./TagSelectModal";

type Props = {
  mode: "add" | "edit";
  initial?: Log;
  allTags: string[];
  onClose: () => void;
  onSave: (log: Log) => void;
};

export function LogFormModal({
  mode,
  initial,
  allTags,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

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

  const removeTag = (t: string) => {
    setTags((prev) => prev.filter((x) => x !== t));
  };

  const onPickImages = () => fileRef.current?.click();

  const onFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;

    const files = Array.from(list);
    const MAX = 6;
    const remaining = Math.max(0, MAX - images.length);
    const take = files.slice(0, remaining);

    const urls = await filesToDataURLs(take);
    setImages((prev) => [...prev, ...urls]);

    e.target.value = "";
  };

  const removeImage = (src: string) => {
    setImages((prev) => prev.filter((x) => x !== src));
  };

  const canSave =
    title.trim().length > 0 &&
    date.trim().length > 0 &&
    content.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;

    const base: Log =
      mode === "edit" && initial
        ? initial
        : ({
            id: crypto.randomUUID(),
            pinned: false,
          } as Log);

    onSave({
      ...base,
      title: title.trim(),
      date,
      content: content.trim(),
      tags,
      images,
    } as Log);
  };

  return (
    <>
      <div className="modalOverlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <div className="modalTitleRow">
              <div className="modalTitle">
                {mode === "add" ? "学習ログを追加" : "学習ログを編集"}
              </div>
              <button
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
            <div className="formGroup">
              <div className="formLabel">
                タイトル <span className="required">*</span>
              </div>
              <input
                className="textInput"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="学習内容を一言で"
              />
            </div>

            <div className="formGroup">
              <div className="formLabel">
                日付 <span className="required">*</span>
              </div>
              <input
                className="textInput"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <div className="formLabel">
                内容 <span className="required">*</span>
              </div>
              <textarea
                className="textArea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`・何をしたか\n・つまづいた点\n・どう解決したか\n・次にやること`}
              />
            </div>

            <div className="formGroup">
              <div className="formLabel">タグ</div>

              <div className="tagRow">
                <button
                  type="button"
                  className="tagAddCircle"
                  onClick={() => setIsTagOpen(true)}
                  aria-label="タグを追加"
                  title="タグを追加"
                >
                  +
                </button>

                {tags.map((t) => (
                  <button type="button" key={t} className="tagPill">
                    {t}{" "}
                    <span
                      className="tagX"
                      onClick={() => removeTag(t)}
                      title="クリックで削除"
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="fromGroup">
              <div className="formLabel">画像</div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={onFilesChange}
              />

              <div className="imageArea">
                <button
                  type="button"
                  className="imageAddBtn"
                  onClick={onPickImages}
                >
                  ＋ 画像を追加
                </button>

                {images.length > 0 && (
                  <div className="imageGrid">
                    {images.map((src) => (
                      <div key={src} className="imageItem">
                        <img
                          src={src}
                          className="imagePreview"
                          alt=""
                          onClick={() => setZoomSrc(src)}
                        />
                        <button
                          type="button"
                          className="imageRemove"
                          onClick={() => removeImage(src)}
                          aria-label="画像を削除"
                          title="削除"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modalFooter">
            <button
              className="saveBtn"
              onClick={handleSave}
              disabled={!canSave}
            >
              保存する
            </button>
          </div>
        </div>
      </div>

      {isTagOpen && (
        <TagSelectModal
          allTags={allTags}
          initialSelected={tags}
          onClose={() => setIsTagOpen(false)}
          onApply={(next) => {
            setTags(next);
            setIsTagOpen(false);
          }}
          onClear={() => setTags([])}
        />
      )}

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
