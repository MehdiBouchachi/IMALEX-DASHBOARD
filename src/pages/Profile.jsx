import { Link } from "react-router-dom";
import ProfileDetails from "../features/profiles/ProfileDetails.jsx";
import Heading from "../ui/Heading.jsx";
import ButtonGroup from "../ui/ButtonGroup.jsx";
import Row from "../ui/Row.jsx";
import Button from "../ui/Button.jsx";

export default function Profile() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Profile</Heading>
        <ButtonGroup>
          <Link to="/profiles">
            <Button variation="secondary">Back</Button>
          </Link>
        </ButtonGroup>
      </Row>
      <Row>
        <ProfileDetails />
      </Row>
    </>
  );
}
