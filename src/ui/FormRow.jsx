// src/ui/FormRow.jsx
import React from "react";
import styled from "styled-components";

const Row = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr); /* label | control */
  gap: 10px 16px;
  align-items: start; /* don't center vertically */
  padding: 12px 0;
  border-top: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: none;
  }

  label {
    margin-top: 6px;
    font-weight: 600;
    color: var(--color-grey-700);
  }

  .control {
    /* <<< the important bits */
    min-width: 0;
    justify-self: stretch; /* fill the grid column */
    text-align: left; /* never right-align content */
  }

  /* make inner inputs stretch naturally */
  .control > * {
    max-width: 100%;
    width: 100%;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    label {
      margin-top: 0;
    }
  }
`;

export default function FormRow({ label, controlId, children }) {
  return (
    <Row>
      <label htmlFor={controlId}>{label}</label>
      <div className="control">{children}</div>
    </Row>
  );
}
