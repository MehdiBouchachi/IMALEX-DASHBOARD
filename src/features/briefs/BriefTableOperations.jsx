// src/features/briefs/BriefTableOperations.jsx
import { useSearchParams } from "react-router-dom";
import SortBy from "../../ui/SortBy";
import TableOpsBar from "../../ui/TableOpsBar";
import { BRIEF_STAGES, SECTORS } from "../../data/fakeBriefs";

const STAGE_OPTIONS = [{ value: "all", label: "All stages" }].concat(
  BRIEF_STAGES.map((s) => ({ value: s, label: s.replaceAll("_", " ") }))
);

const SECTOR_OPTIONS = [{ value: "all", label: "All sectors" }].concat(
  SECTORS.map((s) => ({ value: s, label: s.replaceAll("_", " ") }))
);

export default function BriefTableOperations() {
  const [sp, setSp] = useSearchParams();

  const q = sp.get("q") ?? "";
  const stage = sp.get("stage") ?? "all";
  const sector = sp.get("sector") ?? "all";

  const setParam = (k, v) => {
    // normalize "all" to an empty param (deleted)
    const nextVal = !v || v === "all" ? "" : String(v);
    const currVal = sp.get(k) ?? "";
    // ⛔️ nothing changed → don't touch URL (prevents page=1 resets)
    if (currVal === nextVal) return;

    setSp((prev) => {
      const merged = new URLSearchParams(prev);
      if (nextVal === "") merged.delete(k);
      else merged.set(k, nextVal);
      // legit reset page ONLY when a filter/search actually changed
      merged.set("page", "1");
      return merged;
    });
  };
  const clearAll = () => {
    const next = new URLSearchParams(sp);
    ["q", "stage", "sector", "page"].forEach((k) => next.delete(k));
    setSp(next);
  };

  return (
    <TableOpsBar
      q={q}
      onQChange={(val) => setParam("q", val)}
      placeholder="Search client, company, email, sector, stage, needs…"
      filters={[
        {
          id: "stage",
          label: "Stage",
          value: stage,
          options: STAGE_OPTIONS,
          onChange: (v) => setParam("stage", v),
        },
        {
          id: "sector",
          label: "Sector",
          value: sector,
          options: SECTOR_OPTIONS,
          onChange: (v) => setParam("sector", v),
        },
      ]}
      onClearAll={clearAll}
      sortSlot={
        <SortBy
          options={[
            { value: "createdAt-desc", label: "Created (newest)" },
            { value: "createdAt-asc", label: "Created (oldest)" },
            { value: "updatedAt-desc", label: "Updated (newest)" },
            { value: "updatedAt-asc", label: "Updated (oldest)" },
            { value: "client-asc", label: "Client (A→Z)" },
            { value: "client-desc", label: "Client (Z→A)" },
          ]}
        />
      }
    />
  );
}
