import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fakeUsers } from "../../data/fakeUsers";
import { PAGE_SIZE } from "../../utils/constants";

const RANK = { headSector: 3, reviewer: 2, editor: 1 };

const hasGlobal = (u, role) =>
  (u.roles || []).some((r) => r.role === role && r.scope === "global");

const rolesByTeam = (u) => {
  const out = {};
  for (const r of u.roles || []) {
    if (r.scope && typeof r.scope === "object" && r.scope.team) {
      const t = r.scope.team;
      if (!out[t] || RANK[r.role] > RANK[out[t]]) out[t] = r.role;
    }
  }
  return out;
};

const matchesQuery = (u, q) => {
  if (!q) return true;
  const hay = [
    u.displayName,
    u.email,
    u.phone,
    ...(u.teams || []),
    ...(u.roles || []).map((r) => r.role),
  ]
    .filter(Boolean)
    .join(" | ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
};

export function useProfiles() {
  const [sp] = useSearchParams();

  const q = sp.get("q") || "";
  const team = sp.get("team") || "all"; // team slug or all
  const role = sp.get("role") || "all"; // admin|manager|head|reviewer|editor|all
  const sortBy = sp.get("sortBy") || "createdAt-desc"; // createdAt/name asc|desc
  const page = Number(sp.get("page") || 1);

  const { data, count } = useMemo(() => {
    let list = fakeUsers;

    if (team !== "all")
      list = list.filter((u) => (u.teams || []).includes(team));

    if (role !== "all") {
      if (role === "admin") list = list.filter((u) => hasGlobal(u, "admin"));
      else if (role === "manager")
        list = list.filter((u) => hasGlobal(u, "manager"));
      else {
        const want =
          role === "head"
            ? "headSector"
            : role === "reviewer"
            ? "reviewer"
            : "editor";
        list = list.filter((u) => Object.values(rolesByTeam(u)).includes(want));
      }
    }

    if (q) list = list.filter((u) => matchesQuery(u, q));

    // sort
    const [col, dir = "asc"] = sortBy.split("-");
    const mult = dir === "desc" ? -1 : 1;
    list = [...list].sort((a, b) => {
      if (col === "name")
        return a.displayName.localeCompare(b.displayName) * mult;
      if (col === "createdAt")
        return (new Date(a.createdAt) - new Date(b.createdAt)) * mult;
      return 0;
    });

    const count = list.length;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    return { data: list.slice(from, to), count };
  }, [q, team, role, sortBy, page]);

  return { profiles: data, count, isLoading: false };
}
