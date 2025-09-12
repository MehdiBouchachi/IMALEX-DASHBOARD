import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import Empty from "../../ui/Empty";
import BriefRow from "./BriefRow";
import useBriefs from "./useBriefs";

export default function BriefTable() {
  const { briefs, count } = useBriefs();

  if (count === 0) return <Empty resourceName="briefs (requests)" />;

  return (
    <Table columns="2.6fr 1.8fr 1fr 1.8fr 1.4fr 0.6fr">
      <Table.Header>
        <div>Client</div>
        <div>Stage</div>
        <div>Sector</div>
        <div>Needs</div>
        <div>Lifecycle</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={briefs}
        render={(b) => <BriefRow key={b.id} brief={b} />}
      />

      <Table.Footer>
        {/* Only 'count' is passed — page/size come from URL inside Pagination */}
        <Pagination count={count} />
      </Table.Footer>
    </Table>
  );
}
