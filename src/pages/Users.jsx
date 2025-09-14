import { fakeUsers, TEAM_SLUGS } from "../data/fakeUsers";
import SignupForm from "../features/authentication/SignupForm";
import CreateUserForm from "../features/users/CreateUserForm";
import Heading from "../ui/Heading";

function NewUsers() {
  return (
    <>
      {" "}
      <Heading as="h1">Create a new user</Heading>
      <CreateUserForm
        currentUserRole="admin" // "admin" | "manager" | "headSector"
        currentUserTeams={["cosmetics"]} // required only for headSector creators
        existingUsers={fakeUsers} // pass your current list to enforce caps
        teams={TEAM_SLUGS} // or omit to use defaults
        onCreate={(payload) => {
          // -> send to API / persist
          console.log("NEW USER PAYLOAD", payload);
        }}
      />
    </>
  );
}

export default NewUsers;
