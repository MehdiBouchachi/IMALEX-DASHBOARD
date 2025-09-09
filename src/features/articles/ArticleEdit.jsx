import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Empty from "../../ui/Empty";
import ArticleCreate from "./ArticleCreate";
import { useArticle } from "./useArticle";

export default function ArticleEdit() {
  const { articleId } = useParams();
  const { article } = useArticle(articleId);
  const navigate = useNavigate();

  if (!article) return <Empty resourceName="article" />;

  return (
    <ArticleCreate
      mode="edit"
      initial={article}
      onCancel={() => navigate(-1)}
    />
  );
}
