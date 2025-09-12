// src/ui/TableOpsBar.jsx
import { useMemo, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import SearchBar from "./SearchBar";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

/* ---------- styled ---------- */
const OpsWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  width: 100%;

  @media (max-width: 860px) {
    grid-template-columns: 1fr auto;
    grid-auto-rows: auto;
    & > .sort {
      grid-column: 2 / 3;
    }
  }
`;

const FiltersWrap = styled.div`
  position: relative;
`;

const FilterButton = styled(Button)`
  /* match SearchBar's control height */
  height: 40px;
  padding: 0 1.2rem;
  font-size: 1.4rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

const ActiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-brand-600);
  display: inline-block;
`;

const Pop = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: min(480px, 92vw);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 12px;
  z-index: 30;

  display: grid;
  gap: 10px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px;
  align-items: center;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  height: 40px; /* match SearchBar */
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  border-radius: var(--border-radius-sm);
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: var(--color-grey-500);
  text-transform: uppercase;
`;

const Footer = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

/* ---------- component ---------- */
/**
 * Pure, reusable ops bar for any table.
 * Props:
 * - q, onQChange, placeholder
 * - filters: [{ id, label, value, options:[{value,label}], onChange }]
 * - onClearAll(): void
 * - sortSlot: ReactNode
 */
export default function TableOpsBar({
  q,
  onQChange,
  placeholder = "Search…",
  filters = [],
  onClearAll,
  sortSlot = null,
}) {
  const [open, setOpen] = useState(false);

  const hasActiveFilters = useMemo(
    () =>
      filters.some(
        (f) => f && f.value && f.value !== "all" && `${f.value}`.length > 0
      ),
    [filters]
  );

  return (
    <OpsWrap>
      {/* Search (reuses your SearchBar) */}
      <SearchBar
        value={q}
        onChange={onQChange}
        placeholder={placeholder}
        debounceMs={200}
        aria-label="Search"
      />

      {/* Filters */}
      <FiltersWrap>
        <FilterButton
          variation="secondary"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <HiOutlineAdjustmentsHorizontal />
          Filters
          {hasActiveFilters && <ActiveDot aria-hidden />}
        </FilterButton>

        {open && (
          <Pop
            role="dialog"
            aria-label="Filter items"
            onMouseLeave={() => setOpen(false)}
          >
            {filters.map((f) => (
              <Row key={f.id}>
                <Label htmlFor={f.id}>{f.label}</Label>
                <Select
                  id={f.id}
                  value={f.value}
                  onChange={(e) => f.onChange?.(e.target.value)}
                >
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Row>
            ))}

            <Footer>
              <Button
                variation="secondary"
                size="small"
                onClick={() => {
                  onClearAll?.();
                }}
              >
                Clear all
              </Button>
              <Button size="small" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </Footer>
          </Pop>
        )}
      </FiltersWrap>

      {/* Sort slot */}
      <div className="sort">{sortSlot}</div>
    </OpsWrap>
  );
}
