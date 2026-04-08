import type { Log } from "../types";
import { LogDetailModal } from "./LogDetailModal";
import { LogFormModal } from "./LogFormModal";
import TagSelectModal from "./TagSelectModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type Props = {
  selectedLog: Log | null;
  onCloseDetail: () => void;

  isAddOpen: boolean;
  onCloseAdd: () => void;
  onSaveAdd: (log: Log) => void;

  editingLog: Log | null;
  onCloseEdit: () => void;
  onSaveEdit: (log: Log) => void;

  isTagOpen: boolean;
  allTags: string[];
  selectedTags: string[];
  onCloseTag: () => void;
  onApplyTags: (tags: string[]) => void;
  onClearTags: () => void;

  deletingLog: Log | null;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
};

export function AppModals({
  selectedLog,
  onCloseDetail,

  isAddOpen,
  onCloseAdd,
  onSaveAdd,

  editingLog,
  onCloseEdit,
  onSaveEdit,

  isTagOpen,
  allTags,
  selectedTags,
  onCloseTag,
  onApplyTags,
  onClearTags,

  deletingLog,
  onCancelDelete,
  onConfirmDelete,
}: Props) {
  return (
    <>
      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={onCloseDetail} />
      )}

      {isAddOpen && (
        <LogFormModal
          mode="add"
          allTags={allTags}
          onClose={onCloseAdd}
          onSave={onSaveAdd}
        />
      )}

      {editingLog && (
        <LogFormModal
          mode="edit"
          initial={editingLog}
          allTags={allTags}
          onClose={onCloseEdit}
          onSave={onSaveEdit}
        />
      )}

      {isTagOpen && (
        <TagSelectModal
          allTags={allTags}
          initialSelected={selectedTags}
          onClose={onCloseTag}
          onApply={onApplyTags}
          onClear={onClearTags}
        />
      )}

      <DeleteConfirmModal
        open={!!deletingLog}
        title={deletingLog?.title ?? ""}
        onCancel={onCancelDelete}
        onConfirm={() => deletingLog && onConfirmDelete(deletingLog.id)}
      />
    </>
  );
}
