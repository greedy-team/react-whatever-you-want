import { useEffect, useState, type KeyboardEvent } from "react";
import { getStationNames } from "../api/subwayStations";

const MAX_SUGGESTIONS = 8;

interface StationComboboxProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

// 지하철역 이름 자동완성 입력창.
// 네이티브 <datalist>는 위치를 CSS로 제어할 수 없어서 직접 구현했다.
function StationCombobox({
  id,
  value,
  onChange,
  placeholder,
  required,
}: StationComboboxProps) {
  const [allNames, setAllNames] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    getStationNames()
      .then(setAllNames)
      .catch(() => setAllNames([]));
  }, []);

  const trimmed = value.trim();
  const suggestions = trimmed
    ? allNames.filter((name) => name.includes(trimmed)).slice(0, MAX_SUGGESTIONS)
    : [];
  const showList = open && suggestions.length > 0;

  function selectSuggestion(name: string) {
    onChange(name);
    setOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="station-combobox">
      <input
        id={id}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          highlightedIndex >= 0 ? `${listboxId}-${highlightedIndex}` : undefined
        }
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul className="station-combobox-list" id={listboxId} role="listbox">
          {suggestions.map((name, i) => (
            <li
              key={name}
              id={`${listboxId}-${i}`}
              role="option"
              aria-selected={i === highlightedIndex}
              className={
                i === highlightedIndex ? "station-combobox-option-active" : undefined
              }
              // blur보다 먼저 발생하는 mousedown에서 선택해야, blur로 목록이 먼저 닫혀버리는 걸 막을 수 있다
              onMouseDown={(e) => {
                e.preventDefault();
                selectSuggestion(name);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StationCombobox;
