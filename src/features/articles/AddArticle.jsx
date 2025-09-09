import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

function AddArticle() {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate(`/articles/new`)}>
        {" "}
        Create new article{" "}
      </Button>
    </div>
  );
}

export default AddArticle;
