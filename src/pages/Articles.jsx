import Heading from "../ui/Heading";
import Row from "../ui/Row";
import ArticleTable from "../features/articles/ArticleTable";
import ArticleTableOperations from "../features/articles/ArticleTableOperations";
import AddArticle from "../features/articles/AddArticle";

export default function Articles() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All articles</Heading>
        <ArticleTableOperations />
      </Row>
      <Row>
        <ArticleTable />
        <AddArticle />
      </Row>
    </>
  );
}
