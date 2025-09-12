// src/ui/SearchBar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";

const CONTROL_H = 40;

const Box = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;
const Input = styled.input`
  height: ${CONTROL_H}px;
  width: 100%;
  padding: 10px 36px 10px 38px;
  border: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  outline: none;
  font-size: 14px;
  &::placeholder {
    color: var(--color-grey-400);
  }
`;
const IconL = styled(HiOutlineMagnifyingGlass)`
  position: absolute;
  left: 10px;
  width: 18px;
  height: 18px;
  color: var(--color-grey-400);
`;
const Clear = styled.button`
  position: absolute;
  right: 6px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  background: transparent;
  color: var(--color-grey-400);
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: var(--color-grey-50);
    color: var(--color-grey-700);
  }
`;

/**
 * Reusable search input with (optional) debounce and clear.
 * Props:
 *  - value: string
 *  - onChange: (string) => void
 *  - placeholder?: string
 *  - debounceMs?: number (default 0 = no debounce)
 *  - autoFocus?: boolean
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 0,
  autoFocus = false,
  "aria-label": ariaLabel = "Search",
}) {
  const [local, setLocal] = useState(value ?? "");
  const t = useRef(null);
  useEffect(() => setLocal(value ?? ""), [value]);

  useEffect(() => {
    if (debounceMs <= 0) return;
    clearTimeout(t.current);
    t.current = setTimeout(() => onChange?.(local), debounceMs);
    return () => clearTimeout(t.current);
  }, [local, debounceMs, onChange]);

  const emitNow = (v) => {
    setLocal(v);
    if (debounceMs <= 0) onChange?.(v);
  };

  return (
    <Box>
      <IconL />
      <Input
        value={local}
        onChange={(e) => emitNow(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
      />
      {local ? (
        <Clear onClick={() => emitNow("")} aria-label="Clear search">
          <HiOutlineXMark size={18} />
        </Clear>
      ) : null}
    </Box>
  );
}
