import { useMemo } from "react";
import { fakeArticles } from "./fakeArticles";

export function useArticle(idOrSlug) {
  const article = useMemo(() => {
    if (!idOrSlug) return null;
    return (
      fakeArticles.find((a) => a.id === idOrSlug) ||
      fakeArticles.find((a) => a.slug === idOrSlug) ||
      null
    );
  }, [idOrSlug]);

  return { article, isLoading: false };
}
