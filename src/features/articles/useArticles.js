import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fakeArticles } from "./fakeArticles";
import { PAGE_SIZE } from "../../utils/constants";

function sortArticles(arr, sortBy) {
  const [col, dir = "asc"] = (sortBy || "createdAt-desc").split("-");
  const mult = dir === "desc" ? -1 : 1;
  return [...arr].sort((a, b) => {
    const va = a[col] ?? "";
    const vb = b[col] ?? "";
    if (va === vb) return 0;
    if (col.includes("At")) return (new Date(va) - new Date(vb)) * mult;
    return (va > vb ? 1 : -1) * mult;
  });
}

function matchQuery(article, q) {
  if (!q) return true;
  const hay =
    [
      article.title,
      article.slug,
      article.status?.replace("_", " "),
      article.team?.name,
      article.author?.displayName,
      ...(article.tags || []),
    ]
      .filter(Boolean)
      .join(" | ")
      .toLowerCase() || "";
  return hay.includes(q.toLowerCase());
}

export function useArticles() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const page = Number(searchParams.get("page") || 1);
  const q = searchParams.get("q") || "";
  const team = searchParams.get("team") || "all";

  const { data, count } = useMemo(() => {
    let list = fakeArticles;

    if (status !== "all") list = list.filter((a) => a.status === status);
    if (team !== "all") list = list.filter((a) => a.team?.slug === team);
    if (q) list = list.filter((a) => matchQuery(a, q));

    list = sortArticles(list, sortBy);

    const count = list.length;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    const slice = list.slice(from, to);

    return { data: slice, count };
  }, [status, sortBy, page, q, team]);

  return { articles: data, count, isLoading: false };
}
