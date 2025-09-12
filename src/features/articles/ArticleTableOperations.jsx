import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SortBy from "../../ui/SortBy";
import TableOpsBar from "../../ui/TableOpsBar";
import { fakeArticles } from "./fakeArticles";

/* constants */
const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "draft" },
  { value: "in_review", label: "in review" },
  { value: "changes_requested", label: "changes requested" },
  { value: "approved", label: "approved" },
  { value: "published", label: "published" },
  { value: "unpublished", label: "unpublished" },
  { value: "archived", label: "archived" },
];

function useTeamOptions() {
  const teams = useMemo(() => {
    const set = new Map();
    fakeArticles.forEach((a) => {
      if (a.team) set.set(a.team.slug, a.team.name);
    });
    return [{ value: "all", label: "All teams" }].concat(
      [...set].map(([slug, name]) => ({ value: slug, label: name }))
    );
  }, []);
  return teams;
}

export default function ArticleTableOperations() {
  const teams = useTeamOptions();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "all";
  const team = searchParams.get("team") ?? "all";

  const setParam = (k, v) => {
    const next = new URLSearchParams(searchParams);
    const before = next.get(k) ?? "";

    // write the new value (or delete for "all"/empty)
    if (!v || v === "all") next.delete(k);
    else next.set(k, v);

    const after = next.get(k) ?? "";

    // only reset pagination if a *filter* really changed
    if (k !== "page" && before !== after) next.set("page", "1");

    setSearchParams(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams(searchParams);
    ["q", "status", "team", "page"].forEach((k) => next.delete(k));
    setSearchParams(next);
  };

  return (
    <TableOpsBar
      q={q}
      onQChange={(val) => setParam("q", val)}
      placeholder="Search title, team, author, status, tags…"
      filters={[
        {
          id: "status",
          label: "Status",
          value: status,
          options: STATUSES,
          onChange: (v) => setParam("status", v),
        },
        {
          id: "team",
          label: "Team",
          value: team,
          options: teams,
          onChange: (v) => setParam("team", v),
        },
      ]}
      onClearAll={clearAll}
      sortSlot={
        <SortBy
          options={[
            { value: "createdAt-desc", label: "Created (newest)" },
            { value: "createdAt-asc", label: "Created (oldest)" },
            { value: "publishedAt-desc", label: "Published (newest)" },
            { value: "publishedAt-asc", label: "Published (oldest)" },
            { value: "title-asc", label: "Title (A→Z)" },
            { value: "title-desc", label: "Title (Z→A)" },
          ]}
        />
      }
    />
  );
}
