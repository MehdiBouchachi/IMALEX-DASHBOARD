import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Select from "../../ui/Select";
import SortBy from "../../ui/SortBy";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

/* =========== styled =========== */
const Wrap = styled.div`
  display: grid;
  gap: 10px;
  margin: 10px 0 12px;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
`;

const SearchWrap = styled.div`
  position: relative;
  > svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-grey-500);
    width: 18px;
    height: 18px;
    pointer-events: none;
  }
  > input {
    padding-left: 34px;
  }
`;

const Right = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;

  @media (min-width: 1100px) {
    grid-template-columns: 1fr auto auto auto;
    align-items: center;
  }
`;

const StatusStrip = styled.div`
  display: none;
  @media (min-width: 1100px) {
    display: flex;
  }
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;

  /* pill */
  button {
    border: 1px solid var(--color-grey-100);
    background: var(--color-grey-0);
    color: var(--color-grey-700);
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
  }
  button[data-active="true"] {
    background: var(--color-brand-50);
    color: var(--color-grey-0);
    border-color: var(--color-brand-600);
  }
`;

const StatusSelectSmall = styled.div`
  @media (min-width: 1100px) {
    display: none;
  }
`;

const InlineSelects = styled.div`
  display: none;
  @media (min-width: 1100px) {
    display: flex;
  }
  gap: 8px;
  align-items: center;
`;

const Chips = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-grey-100);
  color: var(--color-grey-700);
  font-size: 12px;
  button {
    display: inline-flex;
    align-items: center;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    color: inherit;
  }
`;

/* tiny popover for filters on small screens */
const Pop = styled.div`
  position: relative;
`;
const PopCard = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 20;
  width: min(520px, 92vw);
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 12px;
  display: grid;
  gap: 10px;
`;
const Grid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  @media (min-width: 520px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
const Label = styled.label`
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: var(--color-grey-600);
`;

/* =========== helpers =========== */
const statuses = [
  ["all", "All"],
  ["draft", "Draft"],
  ["in_review", "In review"],
  ["changes_requested", "Changes req"],
  ["approved", "Approved"],
  ["published", "Published"],
  ["unpublished", "Unpublished"],
  ["archived", "Archived"],
];

function useQP() {
  const [sp, setSp] = useSearchParams();
  const get = (k, def = "") => sp.get(k) ?? def;
  const set = (k, v) => {
    if (v && v !== "all") sp.set(k, v);
    else sp.delete(k);
    sp.delete("page");
    setSp(sp);
  };
  const clearMany = (...keys) => {
    keys.forEach((k) => sp.delete(k));
    sp.delete("page");
    setSp(sp);
  };
  return { sp, get, set, clearMany };
}

/* =========== main =========== */
export default function ArticlesToolbar({
  allArticles, // full dataset (for option lists)
  sortOptions = [], // [{value,label}]
}) {
  const { get, set, clearMany } = useQP();
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  const q = get("q", "");
  const status = get("status", "all");
  const team = get("team", "all");
  const author = get("author", "all");
  const hasActive = q || status !== "all" || team !== "all" || author !== "all";

  // derive options from the full dataset so they’re stable
  const teamOptions = useMemo(() => {
    const map = new Map();
    allArticles.forEach((a) => {
      if (a.team?.slug) map.set(a.team.slug, a.team.name);
    });
    return [{ value: "all", label: "All teams" }].concat(
      Array.from(map, ([value, label]) => ({ value, label }))
    );
  }, [allArticles]);

  const authorOptions = useMemo(() => {
    const map = new Map();
    allArticles.forEach((a) => {
      if (a.author?.id) map.set(a.author.id, a.author.displayName);
    });
    return [{ value: "all", label: "All authors" }].concat(
      Array.from(map, ([value, label]) => ({ value, label }))
    );
  }, [allArticles]);

  // close popover on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!open) return;
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <Wrap>
      <Top>
        <SearchWrap>
          <HiOutlineMagnifyingGlass />
          <Input
            placeholder="Search title, team, author, status…"
            value={q}
            onChange={(e) => set("q", e.target.value)}
          />
        </SearchWrap>

        <Right>
          {/* Small screens: popover holds filters */}
          <Pop ref={popRef}>
            <Button
              size="small"
              variation="secondary"
              onClick={() => setOpen((o) => !o)}
            >
              <HiOutlineAdjustmentsHorizontal />
              Filters
            </Button>
            {open && (
              <PopCard>
                <Grid>
                  <Label>
                    Status
                    <select
                      value={status}
                      onChange={(e) => set("status", e.target.value)}
                    >
                      {statuses.map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Label>
                  <Label>
                    Team
                    <select
                      value={team}
                      onChange={(e) => set("team", e.target.value)}
                    >
                      {teamOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Label>
                  <Label>
                    Author
                    <select
                      value={author}
                      onChange={(e) => set("author", e.target.value)}
                    >
                      {authorOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Label>
                </Grid>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <ButtonText
                    onClick={() => clearMany("status", "team", "author")}
                  >
                    Reset filters
                  </ButtonText>
                  <Button size="small" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              </PopCard>
            )}
          </Pop>

          {/* Sort stays compact & familiar */}
          <SortBy options={sortOptions} />
        </Right>
      </Top>

      {/* Second row: status + inline selects (only wide) */}
      <Row>
        <StatusStrip aria-label="Quick status filters">
          {statuses.map(([val, label]) => (
            <button
              key={val}
              data-active={status === val}
              onClick={() => set("status", val)}
              title={label}
            >
              {label}
            </button>
          ))}
        </StatusStrip>

        <StatusSelectSmall>
          <Select
            value={status}
            onChange={(e) => set("status", e.target.value)}
            options={statuses.map(([value, label]) => ({ value, label }))}
          />
        </StatusSelectSmall>

        <InlineSelects>
          <Select
            value={team}
            onChange={(e) => set("team", e.target.value)}
            options={teamOptions}
          />
          <Select
            value={author}
            onChange={(e) => set("author", e.target.value)}
            options={authorOptions}
          />
        </InlineSelects>
      </Row>

      {/* Active chips */}
      {hasActive && (
        <Chips>
          {q && (
            <Chip>
              q: “{q}”
              <button onClick={() => set("q", "")}>
                <HiOutlineXMark />
              </button>
            </Chip>
          )}
          {status !== "all" && (
            <Chip>
              status: {statuses.find((s) => s[0] === status)?.[1] || status}
              <button onClick={() => set("status", "all")}>
                <HiOutlineXMark />
              </button>
            </Chip>
          )}
          {team !== "all" && (
            <Chip>
              team: {teamOptions.find((t) => t.value === team)?.label || team}
              <button onClick={() => set("team", "all")}>
                <HiOutlineXMark />
              </button>
            </Chip>
          )}
          {author !== "all" && (
            <Chip>
              author:{" "}
              {authorOptions.find((a) => a.value === author)?.label || author}
              <button onClick={() => set("author", "all")}>
                <HiOutlineXMark />
              </button>
            </Chip>
          )}
          <ButtonText
            onClick={() => clearMany("q", "status", "team", "author")}
          >
            Clear all
          </ButtonText>
        </Chips>
      )}
    </Wrap>
  );
}
