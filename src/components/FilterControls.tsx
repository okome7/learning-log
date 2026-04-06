import type { SortOrder } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faList } from "@fortawesome/free-solid-svg-icons";

type Props = {
  selectedTagCount: number;
  sort: SortOrder;
  onChangeSort: (s: SortOrder) => void;
  isFiltered: boolean;
  onClear: () => void;
  onOpenTagModal: () => void;
};

export function FilterControls({
  selectedTagCount,
  sort,
  onChangeSort,
  isFiltered,
  onClear,
  onOpenTagModal,
}: Props) {
  return (
    <div className="controls">
      <button type="button" className="select" onClick={onOpenTagModal}>
        <FontAwesomeIcon icon={faTag} className="icon" />
        <span style={{ fontWeight: 700 }}>タグを選択</span>
        {selectedTagCount > 0 && (
          <span style={{ marginLeft: 6, fontWeight: 800 }}>
            {selectedTagCount}
          </span>
        )}
      </button>

      <div className="select">
        <FontAwesomeIcon icon={faList} className="icon" />
        <select
          value={sort}
          onChange={(e) => onChangeSort(e.target.value as SortOrder)}
        >
          <option value="new">新しい順</option>
          <option value="old">古い順</option>
        </select>
      </div>

      {isFiltered && (
        <button type="button" className="select clearBtn" onClick={onClear}>
          <span className="clearMark">×</span>クリア
        </button>
      )}
    </div>
  );
}
