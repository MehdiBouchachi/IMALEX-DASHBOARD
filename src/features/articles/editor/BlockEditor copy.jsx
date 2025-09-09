// src/features/articles/editor/BlockEditor.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import Textarea from "../../../ui/Textarea";
import Button from "../../../ui/Button";
import Checkbox from "../../../ui/Checkbox";
import FileInput from "../../../ui/FileInput";

/* ======================== styles ======================== */
const Wrap = styled.div`
  width: min(1280px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 12px;
`;

const Bar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;
const SelectionBar = styled.div`
  display: ${(p) => (p.$show ? "flex" : "none")};
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  border: 1px solid var(--color-grey-200);
  background: color-mix(
    in oklab,
    var(--color-indigo-50) 80%,
    var(--color-grey-0)
  );
  color: var(--color-grey-800);
  border-radius: 12px;
  padding: 8px 10px;
  box-shadow: var(--shadow-sm);
`;

/* Accordion section (H2 + its children) */
const SectionCard = styled.section`
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;
const SectionHeader = styled.header`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px dashed var(--color-grey-200);
  background: linear-gradient(
    180deg,
    color-mix(in oklab, var(--color-grey-0) 98%, transparent),
    transparent
  );
`;
const Caret = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: var(--color-grey-600);
  &:hover {
    background: var(--color-grey-50);
  }
`;
const SectionTitle = styled.div`
  min-width: 0;
  font-weight: 700;
  color: var(--color-grey-900);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const SectionMeta = styled.div`
  font-size: 12px;
  color: var(--color-grey-600);
`;

/* Block row */
const BlockRow = styled.div`
  position: relative;
  border-top: 1px dashed var(--color-grey-200);
  background: var(--color-grey-0);
  &:first-child {
    border-top: none;
  }

  outline: ${(p) =>
    p.$selected
      ? "2px solid color-mix(in oklab, var(--color-brand-600) 35%, transparent)"
      : "none"};
  outline-offset: -2px;

  /* group rail + drop hints */
  box-shadow: ${(p) =>
      p.$dropBefore ? "inset 0 3px 0 0 var(--color-brand-600)" : "none"},
    ${(p) =>
      p.$dropAfter ? "inset 0 -3px 0 0 var(--color-brand-600)" : "none"},
    ${(p) => (p.$groupColor ? `inset 3px 0 0 0 ${p.$groupColor}` : "none")};

  &:hover .blk-toolbar,
  &:focus-within .blk-toolbar {
    opacity: 1;
  }
`;
const RowInner = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: start;
  padding: 10px 12px;
`;
const Handle = styled.div`
  cursor: grab;
  user-select: none;
  color: var(--color-grey-600);
  padding: 6px 6px;
  border-radius: 8px;
  &:hover {
    background: var(--color-grey-50);
  }
`;
const TypeSmall = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-grey-600);
  margin-bottom: 6px;
`;
const Toolbar = styled.div`
  opacity: 0;
  transition: opacity 0.15s;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  & > * {
    min-width: 0;
  }
`;

/* ✨ group chip — uses only your new --group-* tokens */
const GroupPill = styled.span`
  --g: ${(p) => p.$c || "var(--group-a)"};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--g) 55%, var(--color-grey-200));
  background: linear-gradient(
      180deg,
      color-mix(in oklab, var(--color-grey-0) 94%, transparent),
      transparent
    ),
    radial-gradient(
      120% 120% at -10% -30%,
      color-mix(in oklab, var(--g) 20%, transparent),
      transparent 60%
    );
  color: color-mix(in oklab, var(--g) 70%, var(--color-grey-900));
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--g) 12%, transparent);
  &::before {
    content: "⛓";
    font-size: 12px;
    opacity: 0.9;
  }
`;

/* “+ Add” controls */
const AddGap = styled.div`
  display: grid;
  place-items: center;
  padding: 8px 0;
  background: var(--color-grey-0);
`;
const AddStrip = styled.button`
  appearance: none;
  border: 1px dashed var(--color-grey-300);
  background: var(--color-grey-50);
  color: var(--color-grey-700);
  border-radius: 999px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    background: var(--color-grey-100);
  }
`;
const AddMenu = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--color-grey-200);
  border-radius: 12px;
  background: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  width: min(560px, 92%);
`;
const MenuButton = styled.button`
  appearance: none;
  border: 1px solid var(--color-grey-200);
  border-radius: 10px;
  background: var(--color-grey-0);
  padding: 8px;
  text-align: left;
  cursor: pointer;
  color: var(--color-grey-700);
  font-size: 13px;
  &:hover {
    background: var(--color-grey-50);
  }
`;

/* ✨ floating selection toolbar + count bubble */
const FloatBar = styled.div`
  position: fixed;
  z-index: 50;
  top: ${(p) => p.$top || 0}px;
  left: ${(p) => p.$left || 0}px;
  transform: translate(-50%, -100%);
  display: ${(p) => (p.$show ? "flex" : "none")};
  gap: 6px;
  align-items: center;
  padding: 6px;
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
  color: var(--color-grey-900);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  backdrop-filter: saturate(120%) blur(6px);
`;
const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 22px;
  padding: 0 8px;
  font-weight: 700;
  font-size: 12px;
  background: color-mix(
    in oklab,
    var(--color-indigo-50) 80%,
    var(--color-grey-0)
  );
  color: var(--color-grey-900);
  border: 1px solid var(--color-grey-200);
  border-radius: 999px;
`;
const FloatCount = styled.div`
  position: fixed;
  z-index: 49;
  top: ${(p) => p.$top || 0}px;
  left: ${(p) => p.$left || 0}px;
  transform: translate(-50%, calc(-100% - 10px));
  display: ${(p) => (p.$show ? "inline-flex" : "none")};
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 8px;
  border: 1px solid var(--color-grey-200);
  background: color-mix(
    in oklab,
    var(--color-indigo-50) 80%,
    var(--color-grey-0)
  );
  color: var(--color-grey-900);
  font-weight: 700;
  font-size: 12px;
  border-radius: 999px;
  box-shadow: var(--shadow-sm);
`;

/* ======================== helpers/constants ======================== */
const TYPES = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "img", label: "Image" },
  { value: "ul", label: "Bulleted list" },
  { value: "ol", label: "Numbered list" },
  { value: "blockquote", label: "Quote" },
  { value: "callout", label: "Callout" },
  { value: "code", label: "Code" },
];
const CALLOUT_VARIANTS = [
  { value: "tip", label: "Tip" },
  { value: "note", label: "Note" },
  { value: "warn", label: "Warning" },
  { value: "danger", label: "Danger" },
];

const QUICK_CHOICES = [
  "p",
  "h3",
  "img",
  "ul",
  "ol",
  "blockquote",
  "callout",
  "code",
  "h2",
];

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const shapeFor = (t) => {
  if (t === "ul" || t === "ol") return { id: uid(), t, x: [""] };
  if (t === "img") return { id: uid(), t, src: "", alt: "", cap: "" };
  if (t === "blockquote")
    return {
      id: uid(),
      t,
      x: "",
      cite: "",
      role: "",
      avatar: "",
      href: "",
      pull: false,
    };
  if (t === "callout") return { id: uid(), t, v: "tip", x: "" };
  if (t === "code") return { id: uid(), t, x: "" };
  if (t === "h2" || t === "h3") return { id: uid(), t, x: "" };
  return { id: uid(), t: "p", x: "" };
};

export const blocksToPlainText = (blocks = []) =>
  blocks
    .map((b) => {
      if (!b) return "";
      if (b.t === "ul" || b.t === "ol") return (b.x || []).join(" ");
      if (b.t === "img") return [b.alt, b.cap].filter(Boolean).join(" ");
      if (b.t === "blockquote")
        return [b.x, b.cite, b.role].filter(Boolean).join(" ");
      return String(b.x || "");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

/* map group id -> one of the theme tokens */
const GROUP_VARS = [
  "--group-a",
  "--group-b",
  "--group-c",
  "--group-d",
  "--group-e",
  "--group-f",
];
const groupColorVar = (gid) => {
  if (!gid) return null;
  let acc = 0;
  for (let i = 0; i < gid.length; i++)
    acc = (acc * 31 + gid.charCodeAt(i)) % 997;
  const idx = acc % GROUP_VARS.length;
  return `var(${GROUP_VARS[idx]})`;
};

const dropAfter = (e, el) => {
  const rect = el.getBoundingClientRect();
  const mid = rect.top + rect.height / 2;
  return e.clientY >= mid;
};
const contiguousRuns = (indices) => {
  const arr = [...indices].sort((a, b) => a - b);
  if (!arr.length) return [];
  const runs = [];
  let start = arr[0],
    prev = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === prev + 1) prev = arr[i];
    else {
      runs.push([start, prev]);
      start = arr[i];
      prev = arr[i];
    }
  }
  runs.push([start, prev]);
  return runs;
};

/* ======================== main editor ======================== */
export default function BlockEditor({ value = [], onChange }) {
  const blocks = useMemo(
    () => value.map((b) => (b.id ? b : { ...b, id: uid() })),
    [value]
  );
  const setBlocks = (next) => onChange?.(next);

  /* selection */
  const [selection, setSelection] = useState([]);
  const [anchorIdx, setAnchorIdx] = useState(null);
  const isSelected = (i) => selection.includes(i);
  const clearSelection = () => {
    setSelection([]);
    setAnchorIdx(null);
  };

  const selectSingle = (i) => {
    setSelection([i]);
    setAnchorIdx(i);
  };
  const toggleSingle = (i) => {
    setSelection((prev) =>
      prev.includes(i)
        ? prev.filter((x) => x !== i)
        : [...prev, i].sort((a, b) => a - b)
    );
    setAnchorIdx(i);
  };
  const selectRangeTo = (i) => {
    const a = anchorIdx == null ? i : anchorIdx;
    const [lo, hi] = [Math.min(a, i), Math.max(a, i)];
    setSelection(Array.from({ length: hi - lo + 1 }, (_, k) => lo + k));
  };

  /* grouping (editor-only) */
  const groupRunBoundsAt = (i) => {
    const gid = blocks[i]?.groupId;
    if (!gid) return [i, i];
    let s = i,
      e = i;
    while (s - 1 >= 0 && blocks[s - 1]?.groupId === gid) s--;
    while (e + 1 < blocks.length && blocks[e + 1]?.groupId === gid) e++;
    return [s, e];
  };

  const groupSelection = () => {
    if (!selection.length) return;
    if (selection.some((i) => blocks[i]?.t === "h2")) {
      alert("You can’t group Section headings (H2).");
      return;
    }
    const runs = contiguousRuns(selection);
    const next = [...blocks];
    runs.forEach(([s, e]) => {
      const gid = uid();
      for (let i = s; i <= e; i++) next[i] = { ...next[i], groupId: gid };
    });
    setBlocks(next);
  };

  const ungroupSelection = () => {
    if (!selection.length) return;
    const next = [...blocks];
    selection.forEach((i) => {
      const clone = { ...next[i] };
      delete clone.groupId;
      next[i] = clone;
    });
    setBlocks(next);
    clearSelection();
  };

  /* DnD */
  const [dropHint, setDropHint] = useState({ idx: null, after: false });

  const handleDragStart = (startIdx, e) => {
    let drag = [];
    if (selection.length && selection.includes(startIdx))
      drag = [...selection].sort((a, b) => a - b);
    else if (blocks[startIdx]?.groupId) {
      const [s, ee] = groupRunBoundsAt(startIdx);
      drag = Array.from({ length: ee - s + 1 }, (_, k) => s + k);
    } else drag = [startIdx];
    e.dataTransfer.setData("text/plain", JSON.stringify(drag));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (idx, e) => {
    e.preventDefault();
    setDropHint({ idx, after: dropAfter(e, e.currentTarget) });
  };

  const handleDrop = (idx, e) => {
    e.preventDefault();
    const after = dropAfter(e, e.currentTarget);
    let moving = [];
    try {
      moving = JSON.parse(e.dataTransfer.getData("text/plain"));
    } catch {
      /* ignore */
    }
    if (!Array.isArray(moving) || moving.length === 0) {
      setDropHint({ idx: null, after: false });
      return;
    }

    const first = moving[0],
      last = moving[moving.length - 1];
    if (
      (!after && idx >= first && idx <= last) ||
      (after && idx >= first && idx < last)
    ) {
      setDropHint({ idx: null, after: false });
      return;
    }

    const to = after ? idx + 1 : idx;
    const removed = new Set(moving);
    const picked = blocks.filter((_, i) => removed.has(i));
    let rest = blocks.filter((_, i) => !removed.has(i));
    const removedBefore = moving.filter((i) => i < to).length;
    const insertAt = Math.max(0, Math.min(rest.length, to - removedBefore));
    const next = [
      ...rest.slice(0, insertAt),
      ...picked,
      ...rest.slice(insertAt),
    ];
    setBlocks(next);
    setSelection(Array.from({ length: picked.length }, (_, k) => insertAt + k));
    setAnchorIdx(insertAt);
    setDropHint({ idx: null, after: false });
  };

  /* mutations */
  const update = (i, patch) => {
    const next = [...blocks];
    next[i] = { ...next[i], ...patch };
    setBlocks(next);
  };
  const updateType = (i, newT) => {
    const prev = blocks[i];
    const shaped = shapeFor(newT);
    const next = { ...shaped, id: prev.id, groupId: prev.groupId };
    const copy = [...blocks];
    copy[i] = next;
    setBlocks(copy);
  };
  const remove = (i) => {
    setBlocks(blocks.filter((_, k) => k !== i));
    clearSelection();
  };
  const insertAfter = (i, t) => {
    const next = [...blocks];
    next.splice(i + 1, 0, shapeFor(t));
    setBlocks(next);
  };
  const insertAt = (i, t) => {
    const next = [...blocks];
    next.splice(i, 0, shapeFor(t));
    setBlocks(next);
  };
  const addSection = () => setBlocks([...blocks, shapeFor("h2")]);

  /* keyboard move — respects groups even with no selection */
  const onKeyMove = (i, e) => {
    if (!e.altKey) return;
    const dir = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
    if (!dir) return;
    e.preventDefault();
    let group = selection.length ? [...selection].sort((a, b) => a - b) : null;
    if (!group) {
      const gid = blocks[i]?.groupId;
      if (gid) {
        const [s, ee] = groupRunBoundsAt(i);
        group = Array.from({ length: ee - s + 1 }, (_, k) => s + k);
      } else group = [i];
    }
    const first = group[0],
      last = group[group.length - 1];
    const toBefore = dir < 0 ? first - 1 : last + 1;
    if (toBefore < 0 || toBefore > blocks.length - 1) return;

    const removedSet = new Set(group);
    const picked = blocks.filter((_, idx) => removedSet.has(idx));
    let rest = blocks.filter((_, idx) => !removedSet.has(idx));
    let insertAtIdx = dir < 0 ? first - 1 : last + 1 - group.length;
    insertAtIdx = Math.max(0, Math.min(rest.length, insertAtIdx));
    const next = [
      ...rest.slice(0, insertAtIdx),
      ...picked,
      ...rest.slice(insertAtIdx),
    ];
    setBlocks(next);
    setSelection(
      Array.from({ length: group.length }, (_, k) => insertAtIdx + k)
    );
    setAnchorIdx(insertAtIdx);
  };

  /* move selection to top/bottom */
  const moveSelectionTo = (pos) => {
    let idxs = selection.length
      ? [...selection].sort((a, b) => a - b)
      : anchorIdx != null
      ? (() => {
          const gid = blocks[anchorIdx]?.groupId;
          if (gid) {
            const [s, ee] = groupRunBoundsAt(anchorIdx);
            return Array.from({ length: ee - s + 1 }, (_, k) => s + k);
          }
          return [anchorIdx];
        })()
      : [];
    if (!idxs.length) return;
    const removed = new Set(idxs);
    const picked = blocks.filter((_, i) => removed.has(i));
    let rest = blocks.filter((_, i) => !removed.has(i));
    const insertAt = pos === "top" ? 0 : rest.length;
    const next = [
      ...rest.slice(0, insertAt),
      ...picked,
      ...rest.slice(insertAt),
    ];
    setBlocks(next);
    setSelection(Array.from({ length: picked.length }, (_, k) => insertAt + k));
    setAnchorIdx(insertAt);
  };

  /* sections (accordion) */
  const sections = useMemo(() => {
    const res = [];
    let cur = { h2: null, items: [], startIdx: 0, endIdx: -1 };
    blocks.forEach((b, i) => {
      if (b.t === "h2") {
        if (cur.h2 || cur.items.length) res.push({ ...cur });
        cur = { h2: b, items: [], startIdx: i, endIdx: i };
      } else {
        cur.items.push({ block: b, idx: i });
        cur.endIdx = i;
      }
    });
    res.push({ ...cur });
    if (!res.length || (res.length === 1 && !res[0].h2))
      return [
        {
          h2: null,
          items: blocks.map((b, i) => ({ block: b, idx: i })),
          startIdx: 0,
          endIdx: blocks.length - 1,
        },
      ];
    return res;
  }, [blocks]);

  const [openMap, setOpenMap] = useState({});
  useEffect(() => {
    const next = { ...openMap };
    sections.forEach((s, k) => {
      const key = sectionKey(s, k);
      if (!(key in next)) next[key] = true;
    });
    setOpenMap(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.length]);
  const toggleSection = (key) => setOpenMap((m) => ({ ...m, [key]: !m[key] }));

  /* selection now ONLY via handle */
  const onHandleMouseDown = (i, e) => {
    // selection logic (shift/ctrl/meta supported) is bound to the handle
    if (e.shiftKey) return selectRangeTo(i);
    if (e.metaKey || e.ctrlKey) return toggleSingle(i);

    const gid = blocks[i]?.groupId;
    if (gid) {
      const [s, ee] = groupRunBoundsAt(i);
      setSelection(Array.from({ length: ee - s + 1 }, (_, k) => s + k));
      setAnchorIdx(s);
    } else {
      selectSingle(i);
    }
  };

  /* inline +Add menus */
  const [openAdder, setOpenAdder] = useState(null);

  /* floating UI position */
  const rowRefs = useRef({});
  const [floatPos, setFloatPos] = useState(null);
  const recomputeFloat = () => {
    if (!selection.length) {
      setFloatPos(null);
      return;
    }
    let rect = null;
    selection.forEach((i) => {
      const el = rowRefs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      rect = rect
        ? {
            top: Math.min(rect.top, r.top),
            left: Math.min(rect.left, r.left),
            right: Math.max(rect.right, r.right),
            bottom: Math.max(rect.bottom, r.bottom),
          }
        : { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
    });
    if (!rect) {
      setFloatPos(null);
      return;
    }
    const top = Math.max(60, rect.top + window.scrollY - 8);
    const left = (rect.left + rect.right) / 2 + window.scrollX;
    setFloatPos({ top, left });
  };
  useEffect(() => {
    recomputeFloat();
  }, [selection, openMap, blocks.length]);
  useEffect(() => {
    const onScroll = () => recomputeFloat();
    const onResize = () => recomputeFloat();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* shortcuts: Cmd/Ctrl+G group • Cmd/Ctrl+Shift+G ungroup • Esc clear */
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "g" && !e.shiftKey) {
        e.preventDefault();
        groupSelection();
      } else if (mod && e.key.toLowerCase() === "g" && e.shiftKey) {
        e.preventDefault();
        ungroupSelection();
      } else if (e.key === "Escape") {
        e.preventDefault();
        clearSelection();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, blocks]);

  return (
    <Wrap>
      {/* top bar (optional now) */}
      <Bar>
        <Button onClick={addSection}>+ Add section</Button>
        <Button
          variation="secondary"
          onClick={() =>
            setOpenMap(
              Object.fromEntries(
                sections.map((s, k) => [sectionKey(s, k), true])
              )
            )
          }
        >
          Expand all
        </Button>
        <Button
          variation="secondary"
          onClick={() =>
            setOpenMap(
              Object.fromEntries(
                sections.map((s, k) => [sectionKey(s, k), false])
              )
            )
          }
        >
          Collapse all
        </Button>

        <SelectionBar $show={selection.length > 0}>
          <strong>{selection.length}</strong> selected
          <Button size="small" onClick={groupSelection}>
            Group
          </Button>
          <Button size="small" variation="secondary" onClick={ungroupSelection}>
            Ungroup
          </Button>
          <Button
            size="small"
            variation="secondary"
            onClick={() => moveSelectionTo("top")}
          >
            Move to top
          </Button>
          <Button
            size="small"
            variation="secondary"
            onClick={() => moveSelectionTo("bottom")}
          >
            Move to bottom
          </Button>
          <Button size="small" variation="secondary" onClick={clearSelection}>
            Clear
          </Button>
        </SelectionBar>
      </Bar>

      {/* floating selection bar + bubble */}
      <FloatBar $show={!!floatPos} $top={floatPos?.top} $left={floatPos?.left}>
        <CountBadge>{selection.length}</CountBadge>
        <Button size="small" onClick={groupSelection}>
          Group
        </Button>
        <Button size="small" variation="secondary" onClick={ungroupSelection}>
          Ungroup
        </Button>
        <Button
          size="small"
          variation="secondary"
          onClick={() => moveSelectionTo("top")}
          title="Move to top"
        >
          ⤒
        </Button>
        <Button
          size="small"
          variation="secondary"
          onClick={() => moveSelectionTo("bottom")}
          title="Move to bottom"
        >
          ⤓
        </Button>
        <Button size="small" variation="secondary" onClick={clearSelection}>
          ✕
        </Button>
      </FloatBar>
      <FloatCount
        $show={!!floatPos}
        $top={floatPos?.top}
        $left={floatPos?.left}
      >
        {selection.length}
      </FloatCount>

      {/* sections */}
      {sections.map((s, k) => {
        const key = sectionKey(s, k);
        const isOpen = !!openMap[key];
        const title = s.h2?.x?.trim() || "Body";
        const count = (s.h2 ? 1 : 0) + s.items.length;

        return (
          <SectionCard key={key}>
            <SectionHeader>
              <Caret
                onClick={() => toggleSection(key)}
                aria-expanded={isOpen}
                title={isOpen ? "Collapse" : "Expand"}
              >
                {isOpen ? "▾" : "▸"}
              </Caret>
              <SectionTitle title={title}>
                {title}
                <span
                  style={{
                    marginLeft: 8,
                    fontWeight: 400,
                    color: "var(--color-grey-600)",
                    fontSize: 12,
                  }}
                >
                  {count} block{count === 1 ? "" : "s"}
                </span>
              </SectionTitle>
              <SectionMeta>
                {s.startIdx + 1}–{s.endIdx + 1}
              </SectionMeta>
            </SectionHeader>

            {isOpen && (
              <div>
                {/* H2 row */}
                {s.h2 && (
                  <>
                    <EditableRow
                      idx={s.startIdx}
                      block={blocks[s.startIdx]}
                      selected={isSelected(s.startIdx)}
                      dropHint={dropHint}
                      onKeyMove={onKeyMove}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onHandleMouseDown={onHandleMouseDown}
                      update={update}
                      updateType={updateType}
                      remove={remove}
                      setRowRef={(el) => (rowRefs.current[s.startIdx] = el)}
                    />
                    <InlineAdder
                      token={`slot-${s.startIdx}`}
                      onPick={(t) => insertAfter(s.startIdx, t)}
                    />
                  </>
                )}

                {/* children */}
                {s.items.map(({ block, idx }) => (
                  <React.Fragment key={block.id}>
                    <EditableRow
                      idx={idx}
                      block={block}
                      selected={isSelected(idx)}
                      dropHint={dropHint}
                      onKeyMove={onKeyMove}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onHandleMouseDown={onHandleMouseDown}
                      update={update}
                      updateType={updateType}
                      remove={remove}
                      setRowRef={(el) => (rowRefs.current[idx] = el)}
                    />
                    <InlineAdder
                      token={`slot-${idx}`}
                      onPick={(t) => insertAfter(idx, t)}
                    />
                  </React.Fragment>
                ))}

                {/* trailing adder */}
                <InlineAdder
                  token={`${key}-end`}
                  onPick={(t) => insertAt(s.endIdx + 1, t)}
                />
              </div>
            )}
          </SectionCard>
        );
      })}
    </Wrap>
  );
}

/* ======================== row editor ======================== */
function EditableRow({
  idx,
  block,
  selected,
  dropHint,
  onKeyMove,
  onDragStart,
  onDragOver,
  onDrop,
  onHandleMouseDown,
  update,
  updateType,
  remove,
  setRowRef,
}) {
  const color = groupColorVar(block.groupId);
  const showBefore = dropHint.idx === idx && !dropHint.after;
  const showAfter = dropHint.idx === idx && dropHint.after;

  return (
    <BlockRow
      ref={setRowRef}
      $selected={selected}
      $groupColor={color}
      $dropBefore={showBefore}
      $dropAfter={showAfter}
      onDragOver={(e) => onDragOver(idx, e)}
      onDrop={(e) => onDrop(idx, e)}
      // NOTE: no onMouseDown here — selection is ONLY via handle
    >
      <RowInner onKeyDown={(e) => onKeyMove(idx, e)}>
        <Handle
          title="Drag to reorder"
          draggable
          onMouseDown={(e) => onHandleMouseDown(idx, e)}
          onDragStart={(e) => onDragStart(idx, e)}
        >
          ⋮⋮
        </Handle>

        <div>
          <TypeSmall>
            <Select
              id={`type-${block.id}`}
              value={block.t}
              onChange={(e) => updateType(idx, e.target.value)}
              options={TYPES}
            />
            {block.groupId && <GroupPill $c={color}>grouped</GroupPill>}
          </TypeSmall>

          {(() => {
            switch (block.t) {
              case "p":
                return (
                  <Textarea
                    rows={3}
                    placeholder="Write text… (supports **bold**, _italic_, `code`, [link])"
                    value={block.x || ""}
                    onChange={(e) => update(idx, { x: e.target.value })}
                  />
                );
              case "h2":
                return (
                  <Input
                    placeholder="Section title…"
                    value={block.x || ""}
                    onChange={(e) => update(idx, { x: e.target.value })}
                  />
                );
              case "h3":
                return (
                  <Input
                    placeholder="Sub-section title…"
                    value={block.x || ""}
                    onChange={(e) => update(idx, { x: e.target.value })}
                  />
                );
              case "blockquote":
                return (
                  <>
                    <Textarea
                      rows={3}
                      placeholder="Quote text…"
                      value={block.x || ""}
                      onChange={(e) => update(idx, { x: e.target.value })}
                    />
                    <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                      <Input
                        placeholder="Cited person or source…"
                        value={block.cite || ""}
                        onChange={(e) => update(idx, { cite: e.target.value })}
                      />
                      <Input
                        placeholder="Role (optional)…"
                        value={block.role || ""}
                        onChange={(e) => update(idx, { role: e.target.value })}
                      />
                      <Input
                        placeholder="Link (optional)…"
                        value={block.href || ""}
                        onChange={(e) => update(idx, { href: e.target.value })}
                      />
                      <Input
                        placeholder="Avatar URL (optional)…"
                        value={block.avatar || ""}
                        onChange={(e) =>
                          update(idx, { avatar: e.target.value })
                        }
                      />
                      <div>
                        <Checkbox
                          id={`pull-${block.id}`}
                          checked={!!block.pull}
                          onChange={(e) =>
                            update(idx, { pull: e.target.checked })
                          }
                        >
                          pull quote style
                        </Checkbox>
                      </div>
                    </div>
                  </>
                );
              case "callout":
                return (
                  <>
                    <div style={{ maxWidth: 240, marginBottom: 8 }}>
                      <Select
                        id={`callout-${block.id}`}
                        value={block.v || "tip"}
                        onChange={(e) => update(idx, { v: e.target.value })}
                        options={CALLOUT_VARIANTS}
                      />
                    </div>
                    <Textarea
                      rows={3}
                      placeholder="Explain the note/tip/warning…"
                      value={block.x || ""}
                      onChange={(e) => update(idx, { x: e.target.value })}
                    />
                  </>
                );
              case "code":
                return (
                  <Textarea
                    rows={6}
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                    placeholder="Paste code…"
                    value={block.x || ""}
                    onChange={(e) => update(idx, { x: e.target.value })}
                  />
                );
              case "img":
                return (
                  <ImageEditorSimple idx={idx} block={block} update={update} />
                );
              case "ul":
              case "ol":
                return (
                  <ListEditorSimple idx={idx} block={block} update={update} />
                );
              default:
                return null;
            }
          })()}
        </div>

        <Toolbar className="blk-toolbar">
          <Button size="small" variation="danger" onClick={() => remove(idx)}>
            Delete
          </Button>
        </Toolbar>
      </RowInner>
    </BlockRow>
  );
}

/* ======================== inline adder ======================== */
function InlineAdder({ token, onPick }) {
  const [open, setOpen] = useState(false);
  const labelFor = (t) =>
    ({
      h2: "Heading 2",
      h3: "Heading 3",
      p: "Paragraph",
      img: "Image",
      ul: "Bulleted list",
      ol: "Numbered list",
      blockquote: "Quote",
      callout: "Callout",
      code: "Code",
    }[t] || t);

  return (
    <AddGap>
      {open ? (
        <AddMenu>
          {[
            "p",
            "h3",
            "img",
            "ul",
            "ol",
            "blockquote",
            "callout",
            "code",
            "h2",
          ].map((t) => (
            <MenuButton
              key={t}
              onClick={() => {
                onPick(t);
                setOpen(false);
              }}
            >
              + {labelFor(t)}
            </MenuButton>
          ))}
        </AddMenu>
      ) : (
        <AddStrip onClick={() => setOpen(true)}>+ Add</AddStrip>
      )}
    </AddGap>
  );
}

/* ======================== small editors ======================== */
function ImageEditorSimple({ idx, block, update }) {
  const onPick = (payload) => {
    const file = payload?.target?.files?.[0] || payload?.file || payload;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(idx, { src: reader.result });
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <FileInput id={`img-${block.id}`} accept="image/*" onChange={onPick} />
      <Input
        placeholder="Alt: describe the image"
        value={block.alt || ""}
        onChange={(e) => update(idx, { alt: e.target.value })}
      />
      <Input
        placeholder="Caption (optional)"
        value={block.cap || ""}
        onChange={(e) => update(idx, { cap: e.target.value })}
      />
      {block.src ? (
        <div
          style={{
            marginTop: 4,
            border: "1px dashed var(--color-grey-200)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={block.src} style={{ width: "100%", display: "block" }} />
        </div>
      ) : null}
    </div>
  );
}

function ListEditorSimple({ idx, block, update }) {
  const items = Array.isArray(block.x) ? block.x : [];
  const set = (next) => update(idx, { x: next });
  const edit = (k, val) => {
    const next = [...items];
    next[k] = val;
    set(next);
  };
  const add = () => set([...items, ""]);
  const remove = (k) => set(items.filter((_, j) => j !== k));
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((li, k) => (
        <div
          key={`${block.id}-${k}`}
          style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}
        >
          <Input
            placeholder={`Item ${k + 1}`}
            value={li}
            onChange={(e) => edit(k, e.target.value)}
          />
          <Button size="small" variation="danger" onClick={() => remove(k)}>
            Delete
          </Button>
        </div>
      ))}
      <div>
        <Button size="small" onClick={add}>
          + Add item
        </Button>
      </div>
    </div>
  );
}

/* ======================== utils ======================== */
function sectionKey(s, k) {
  return s.h2?.id ? `h2-${s.h2.id}` : `sec-${k}`;
}
