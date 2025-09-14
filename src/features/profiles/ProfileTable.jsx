import styled from "styled-components";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";
import ProfileRow from "./ProfileRow";
import { useProfiles } from "./useProfiles";

/* header alignment (must mirror row cells) */
const HLeft = styled.div`
  justify-self: start;
  text-align: left;
`;
const HCenter = styled.div`
  justify-self: center;
  text-align: center;
`;
const HRight = styled.div`
  justify-self: end;
  text-align: right;
`;

export default function ProfileTable() {
  const { profiles, count } = useProfiles();

  if (!profiles?.length) return <Empty resourceName="profiles" />;

  return (
    <Menus>
      {/* Name | Phone | Global | Teams | Created | Actions */}
      {/* last column fixed so kebab aligns flush-right */}
      <Table columns="2.4fr 1.2fr 1.1fr 2.7fr 1.8fr 3.2rem">
        <Table.Header>
          <HLeft>Name</HLeft>
          <HRight>Phone</HRight>
          <HCenter>Global</HCenter>
          <HLeft>Teams & roles</HLeft>
          <HRight>Created</HRight>
          <div />
        </Table.Header>

        <Table.Body
          data={profiles}
          render={(p) => <ProfileRow key={p.id} profile={p} />}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}
