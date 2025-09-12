import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fakeBriefs } from "../../data/fakeBriefs";
import { PAGE_SIZE } from "../../utils/constants";

/* sort like useArticles: handle dates, strings, and client name */
function sortBriefs(arr, sortBy) {
  const [col, dir = "asc"] = (sortBy || "createdAt-desc").split("-");
  const mult = dir === "desc" ? -1 : 1;

  return [...arr].sort((a, b) => {
    const va = col === "client" ? a.client?.name || "" : a[col] ?? "";
    const vb = col === "client" ? b.client?.name || "" : b[col] ?? "";

    if (va === vb) return 0;
    if (col.includes("At")) return (new Date(va) - new Date(vb)) * mult; // dates
    return (va > vb ? 1 : -1) * mult; // strings/numbers
  });
}

/* local query matcher (no side effects) */
function matchBrief(brief, q) {
  if (!q) return true;
  const hay =
    [
      brief.client?.name,
      brief.client?.company,
      brief.client?.email,
      brief.client?.phone,
      brief.sector,
      brief.stage,
      ...(brief.needs || []),
      brief.brief,
    ]
      .filter(Boolean)
      .join(" | ")
      .toLowerCase() || "";
  return hay.includes(q.toLowerCase());
}

export default function useBriefs() {
  const [sp] = useSearchParams();

  const stage = sp.get("stage") || "all";
  const sector = sp.get("sector") || "all";
  const sortBy = sp.get("sortBy") || "createdAt-desc";
  const page = Number(sp.get("page") || 1);
  const q = sp.get("q") || "";

  const { data, count } = useMemo(() => {
    let list = fakeBriefs;

    if (stage !== "all") list = list.filter((b) => b.stage === stage);
    if (sector !== "all") list = list.filter((b) => b.sector === sector);
    if (q) list = list.filter((b) => matchBrief(b, q));

    list = sortBriefs(list, sortBy);

    const count = list.length;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    const slice = list.slice(from, to);

    return { data: slice, count };
  }, [stage, sector, q, sortBy, page]);

  return { briefs: data, count, isLoading: false };
}
