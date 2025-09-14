import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SortBy from "../../ui/SortBy";
import TableOpsBar from "../../ui/TableOpsBar";
import { fakeUsers } from "../../data/fakeUsers";

const ROLE_OPTS = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Global: Admin" },
  { value: "manager", label: "Global: Manager" },
  { value: "head", label: "Team: HeadSector" },
  { value: "reviewer", label: "Team: Reviewer" },
  { value: "editor", label: "Team: Editor" },
];

function useTeamOptions() {
  return useMemo(() => {
    const set = new Map();
    fakeUsers.forEach((u) => (u.teams || []).forEach((t) => set.set(t, t)));
    return [{ value: "all", label: "All teams" }].concat(
      [...set].map(([slug]) => ({
        value: slug,
        label:
          slug === "animal-nutrition"
            ? "Animal Nutrition"
            : slug === "biopesticides"
            ? "Biopesticides"
            : slug === "food-supplements"
            ? "Food Supplements"
            : slug === "agri-food"
            ? "Agri-Food"
            : "Cosmetics",
      }))
    );
  }, []);
}

export default function ProfileTableOperations() {
  const teams = useTeamOptions();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const team = searchParams.get("team") ?? "all";
  const role = searchParams.get("role") ?? "all";

  const setParam = (k, v) => {
    const next = new URLSearchParams(searchParams);
    const before = next.get(k) ?? "";

    if (!v || v === "all") next.delete(k);
    else next.set(k, v);

    const after = next.get(k) ?? "";
    if (k !== "page" && before !== after) next.set("page", "1");

    setSearchParams(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams(searchParams);
    ["q", "team", "role", "page"].forEach((k) => next.delete(k));
    setSearchParams(next);
  };

  return (
    <TableOpsBar
      q={q}
      onQChange={(val) => setParam("q", val)}
      placeholder="Search name, email, phone, team…"
      filters={[
        {
          id: "team",
          label: "Team",
          value: team,
          options: teams,
          onChange: (v) => setParam("team", v),
        },
        {
          id: "role",
          label: "Role",
          value: role,
          options: ROLE_OPTS,
          onChange: (v) => setParam("role", v),
        },
      ]}
      onClearAll={clearAll}
      sortSlot={
        <SortBy
          options={[
            { value: "createdAt-desc", label: "Created (newest)" },
            { value: "createdAt-asc", label: "Created (oldest)" },
            { value: "name-asc", label: "Name (A–Z)" },
            { value: "name-desc", label: "Name (Z–A)" },
          ]}
        />
      }
    />
  );
}
