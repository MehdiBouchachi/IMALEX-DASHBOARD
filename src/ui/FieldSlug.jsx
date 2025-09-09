import styled from "styled-components";
import Input from "./Input";
import Checkbox from "./Checkbox";
import Button from "./Button";
import FormRow from "./FormRow";

const SlugRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 10px;
  width: 100%;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  .url-helper {
    grid-column: 1 / -1;
    color: var(--color-grey-600);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default function FieldSlug({
  value,
  onChange,
  lock,
  onToggleLock,
  url,
}) {
  return (
    <FormRow label="Slug" controlId="slug">
      <SlugRow>
        <Input
          id="slug"
          placeholder="customize slug"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Checkbox
          id="lockSlug"
          checked={lock}
          onChange={(e) => onToggleLock(e.target.checked)}
        >
          lock slug
        </Checkbox>
        {value && (
          <Button
            size="small"
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              alert("Copied URL");
            }}
          >
            COPY
          </Button>
        )}
        <span className="url-helper" aria-live="polite">
          {url}
        </span>
      </SlugRow>
    </FormRow>
  );
}
