// src/features/articles/ArticleTableOperations.jsx
import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

export default function ArticleTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "draft", label: "Draft" },
          { value: "in_review", label: "In review" },
          { value: "changes_requested", label: "Changes requested" },
          { value: "approved", label: "Approved" },
          { value: "published", label: "Published" },
          { value: "unpublished", label: "Unpublished" },
          { value: "archived", label: "Archived" },
        ]}
      />
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
    </TableOperations>
  );
}
