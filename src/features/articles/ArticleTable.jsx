import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";
import ArticleRow from "./ArticleRow";
import { useArticles } from "./useArticles";

function ArticleTable() {
  const { articles, count } = useArticles();

  if (!articles?.length) return <Empty resourceName="articles" />;

  return (
    <Menus>
      {/* Slightly widened last column to reduce truncation */}
      <Table columns="2fr 1.4fr 1.2fr 1fr 1.2fr 1.8fr 3.2rem">
        <Table.Header>
          <div>Title</div>
          <div>Credit</div>
          <div>Status</div>
          <div>Visibility</div>
          <div>Team</div>
          <div>Lifecycle</div>
          <div />
        </Table.Header>

        <Table.Body
          data={articles}
          render={(a) => <ArticleRow key={a.id} article={a} />}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default ArticleTable;
