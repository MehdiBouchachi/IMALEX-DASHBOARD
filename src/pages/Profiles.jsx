import ProfileTable from "../features/profiles/ProfileTable.jsx";
import ProfileTableOperations from "../features/profiles/ProfileTableOperations.jsx";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

export default function Profiles() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Profiles</Heading>
      </Row>

      <Row>
        <ProfileTableOperations />
        <ProfileTable />
      </Row>
    </>
  );
}
