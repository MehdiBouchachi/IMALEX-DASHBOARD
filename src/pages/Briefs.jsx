import CabinTable from "../features/cabins/CabinTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddCabin from "../features/cabins/AddCabin";
import CabinTablesOperations from "../features/cabins/CabinTablesOperations";

function Briefs() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All briefs</Heading>
        {/*         <CabinTablesOperations /> */}
      </Row>
      <Row>
        {/*  <CabinTable />
        <AddCabin /> */}
      </Row>
    </>
  );
}

export default Briefs;
