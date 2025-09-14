import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BriefTableOperations from "../features/briefs/BriefTableOperations";
import BriefTable from "../features/briefs/BriefTable";

function Briefs() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Briefs</Heading>
        {/*         <CabinTablesOperations /> */}
      </Row>
      <Row>
        <BriefTableOperations />
        <BriefTable />
      </Row>
    </>
  );
}

export default Briefs;
