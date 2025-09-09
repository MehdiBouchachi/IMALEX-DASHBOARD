import React, { useRef } from "react";
import styled from "styled-components";
import Tag from "./Tag";
import FormRow from "./FormRow";

const Box = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 8px;
  min-height: 40px;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  background: var(--color-grey-0);
  transition: box-shadow 0.15s, border-color 0.15s;
  &:focus-within {
    border-color: var(--color-indigo-300);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  input {
    border: 0;
    outline: 0;
    background: transparent;
    min-width: 160px;
    padding: 4px 2px;
    color: var(--color-grey-700);
  }
`;

export default function TagInput({ value = [], onChange }) {
  const ref = useRef(null);

  const add = (raw) => {
    const t = raw.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
  };
  const remove = (t) => onChange(value.filter((x) => x !== t));

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(e.currentTarget.value.replace(",", ""));
      e.currentTarget.value = "";
    }
    if (e.key === "Backspace" && !e.currentTarget.value) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <FormRow label="Tags" controlId="tagInput">
      <Box onClick={() => ref.current?.focus()}>
        {value.map((t) => (
          <span
            key={t}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Tag type="brand">{t}</Tag>
            <button
              type="button"
              onClick={() => remove(t)}
              title={`Remove ${t}`}
              aria-label={`Remove ${t}`}
              style={{
                border: "none",
                background: "transparent",
                color: "var(--color-grey-500)",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="tagInput"
          ref={ref}
          onKeyDown={onKey}
          placeholder="Type & press Enter"
          aria-label="Add a tag"
        />
      </Box>
    </FormRow>
  );
}
