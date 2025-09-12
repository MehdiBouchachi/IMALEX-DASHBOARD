// src/features/briefs/BriefTimeline.jsx
import styled from "styled-components";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import { STAGE_LABEL } from "./stages";

/* ─── helpers ─────────────────────────────────────────── */
const fmt = (iso) => (iso ? format(new Date(iso), "PP • p") : "—");
const rel = (iso) =>
  iso ? formatDistanceToNowStrict(new Date(iso), { addSuffix: true }) : "";

function iconFor(type) {
  if (type === "created") return HiOutlineClock;
  if (type === "updated") return HiOutlineDocumentText;
  return HiOutlineDocumentText;
}

function normalize(e) {
  return {
    type: e.type ?? e.key,
    at: e.at,
    label:
      e.label ??
      (e.type === "stage_change" || e.to
        ? "Moved to"
        : e.key === "created"
        ? "Created"
        : e.key === "updated"
        ? "Last updated"
        : "Event"),
    stage: e.stage ?? e.to,
    by: e.by,
    note: e.note,
  };
}

/* Keep chronological ASC so months appear from oldest → newest */
function groupByMonth(events) {
  const groups = new Map();
  events.forEach((ev) => {
    const d = new Date(ev.at);
    const key = format(d, "yyyy-MM");
    const title = format(d, "LLLL yyyy"); // e.g. July 2025
    if (!groups.has(key)) groups.set(key, { key, title, items: [] });
    groups.get(key).items.push(ev);
  });
  return [...groups.values()];
}

/* ─── UI ──────────────────────────────────────────────── */

const Wrap = styled.div`
  position: relative;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 8px;
`;

const TinyBtn = styled.button`
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  font-size: 12.5px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  &:hover {
    background: var(--color-grey-50);
    border-color: var(--color-grey-300);
  }
`;

const Month = styled.section`
  &:not(:first-child) {
    margin-top: 10px;
  }
`;

const MonthHeader = styled.button`
  appearance: none;
  width: 100%;
  border: 1px solid var(--color-grey-100);
  background: linear-gradient(
    180deg,
    var(--color-grey-50),
    var(--color-grey-0)
  );
  color: var(--color-grey-600);
  border-radius: 10px;
  padding: 8px 10px;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: var(--color-grey-200);
  }

  .left {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  .title {
    font-size: 12px;
    font-weight: 500; /* calmer than bold */
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .count {
    background: var(--color-grey-100);
    color: var(--color-grey-700);
    padding: 0.18rem 0.5rem;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 500;
    box-shadow: inset 0 0 0 1px var(--color-grey-200);
  }

  .chev {
    width: 16px;
    height: 16px;
    color: var(--color-grey-500);
    transition: transform 0.15s ease;
    transform: rotate(${(p) => (p.$open ? 180 : 0)}deg);
  }
`;

const Rail = styled.ol`
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0 0 0 22px;
  display: grid;
  gap: ${(p) => (p.$dense ? "12px" : "16px")};

  &::before {
    content: "";
    position: absolute;
    left: 9px;
    top: 6px;
    bottom: 0;
    width: 2px;
    background: var(--color-grey-100);
  }
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 10px;
  align-items: start;
  min-width: 0;
`;

const Dot = styled.span`
  margin-top: 12px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--color-grey-0);
  border: 2px solid var(--color-brand-600);
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.14);
`;

const Card = styled.article`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: var(--shadow-sm);
  min-width: 0;
  transition: box-shadow 0.15s ease, border-color 0.15s ease,
    transform 0.15s ease;
  &:hover {
    border-color: var(--color-grey-200);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;

  .title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-grey-800);
    line-height: 1.25;
    font-weight: 500; /* medium */
    min-width: 0;
  }
  .when {
    color: var(--color-grey-500);
    font-size: 12px;
    white-space: nowrap;
    font-weight: 400;
  }
  svg {
    width: 16px;
    height: 16px;
    color: var(--color-grey-500);
  }
`;

const Meta = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const Chip = styled.span`
  background: var(--color-grey-100);
  color: var(--color-grey-700);
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px var(--color-grey-200);
`;
const By = styled.span`
  color: var(--color-grey-500);
  font-size: 12px;
  font-weight: 400;
`;

const NoteWrap = styled.div`
  position: relative;
  margin-top: 8px;
`;
const Note = styled.p`
  margin: 0;
  color: var(--color-grey-800);
  line-height: 1.55;
  font-weight: 400;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${(p) => (p.$open ? "unset" : 3)};
  overflow: hidden;

  mask-image: ${(p) =>
    p.$open
      ? "none"
      : "linear-gradient(180deg, #000 70%, rgba(0,0,0,0.05) 95%, transparent)"};
`;
const ToggleNote = styled.button`
  margin-top: 6px;
  border: none;
  background: none;
  color: var(--color-brand-700);
  font-weight: 500;
  font-size: 12px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.15s ease;
    transform: rotate(${(p) => (p.$open ? 180 : 0)}deg);
  }
`;

const OlderWrap = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;
const OlderBtn = styled(TinyBtn)``;

/* ─── rows ───────────────────────────────────────────── */

function EventRow({ e }) {
  const [open, setOpen] = useState(false);
  const Icon = iconFor(e.type);

  return (
    <Item>
      <Dot />
      <Card>
        <Row>
          <div className="title">
            <Icon />
            <span>{e.label}</span>
          </div>
          <span className="when">
            {fmt(e.at)} ({rel(e.at)})
          </span>
        </Row>

        {(e.stage || e.by) && (
          <Meta>
            {e.stage && <Chip>{STAGE_LABEL(e.stage)}</Chip>}
            {e.by && <By>by {e.by}</By>}
          </Meta>
        )}

        {e.note && (
          <NoteWrap>
            <Note $open={open}>{e.note}</Note>
            <ToggleNote $open={open} onClick={() => setOpen((v) => !v)}>
              {open ? "Show less" : "Show more"} <HiOutlineChevronDown />
            </ToggleNote>
          </NoteWrap>
        )}
      </Card>
    </Item>
  );
}

/* ─── main ───────────────────────────────────────────── */

export default function BriefTimeline({
  events = [],
  dense = true,
  initialLimit = 6, // show first N (from the end), then "Show older"
}) {
  // Normalize + keep chronological ASC (oldest → newest)
  const items = useMemo(
    () =>
      events
        .filter((e) => e && e.at)
        .map(normalize)
        .sort((a, b) => new Date(a.at) - new Date(b.at)),
    [events]
  );

  const groups = useMemo(() => groupByMonth(items), [items]);

  // Collapsed state per-month (default: collapse older months, keep latest open)
  const latestKey = groups[groups.length - 1]?.key;
  const [collapsed, setCollapsed] = useState({});

  // Initialize / merge collapsed map whenever month keys change
  useEffect(() => {
    const next = { ...collapsed };
    groups.forEach((g) => {
      if (!(g.key in next)) next[g.key] = g.key !== latestKey; // latest open, others collapsed
    });
    // Clean up removed months
    Object.keys(next).forEach((k) => {
      if (!groups.find((g) => g.key === k)) delete next[k];
    });
    setCollapsed(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.map((g) => g.key).join("|")]); // track key list

  const expandAll = () =>
    setCollapsed((m) => {
      const n = { ...m };
      Object.keys(n).forEach((k) => (n[k] = false));
      return n;
    });

  const collapseAll = () =>
    setCollapsed((m) => {
      const n = { ...m };
      Object.keys(n).forEach((k) => (n[k] = true));
      return n;
    });

  return (
    <Wrap>
      {groups.length > 1 && (
        <Toolbar>
          <TinyBtn onClick={expandAll}>Expand all</TinyBtn>
          <TinyBtn onClick={collapseAll}>Collapse all</TinyBtn>
        </Toolbar>
      )}

      {groups.map((g) => {
        const open = !collapsed[g.key];
        return (
          <Month key={g.key}>
            <MonthHeader
              type="button"
              onClick={() =>
                setCollapsed((m) => ({ ...m, [g.key]: !m[g.key] }))
              }
              $open={open}
              aria-expanded={open}
            >
              <div className="left">
                <span className="title">{g.title}</span>
                <span className="count">{g.items.length}</span>
              </div>
              <HiOutlineChevronDown className="chev" />
            </MonthHeader>

            {open && (
              <Rail $dense={dense}>
                {g.items.map((e, i) => (
                  <EventRow key={`${e.at}-${i}`} e={e} />
                ))}
              </Rail>
            )}
          </Month>
        );
      })}
    </Wrap>
  );
}
