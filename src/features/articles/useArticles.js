import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fakeArticles } from "./fakeArticles";

const PAGE_SIZE = 10;

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

export function useArticles() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt-desc";
  const page = Number(searchParams.get("page") || 1);

  const { data, count } = useMemo(() => {
    let list = fakeArticles;

    // filter
    if (status !== "all") list = list.filter((a) => a.status === status);

    // sort
    list = sortArticles(list, sortBy);

    // paginate
    const count = list.length;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    const slice = list.slice(from, to);

    return { data: slice, count };
  }, [status, sortBy, page]);

  return { articles: data, count, isLoading: false };
}
