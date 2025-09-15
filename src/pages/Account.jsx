import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UpdateUserDataForm from "../features/account/UpdateUserDataForm";
import UpdatePasswordForm from "../features/account/UpdatePasswordForm";

function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Row>
        <Heading as="h3">Personal info</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading as="h3">Change password</Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
