import React from "react";
import styled from "styled-components";
import { MAXW } from "./PageShell";

const Wrap = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin: 0.8rem auto 0.6rem;
  max-width: min(${MAXW}, 96vw);
  list-style: none;
  counter-reset: step;
`;
const Item = styled.li`
  counter-increment: step;
  position: relative;
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-grey-100);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  background: ${(p) =>
    p.$active ? "var(--color-indigo-100)" : "var(--color-grey-0)"};
  color: ${(p) =>
    p.$active ? "var(--color-indigo-700)" : "var(--color-grey-700)"};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  &::before {
    content: counter(step);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${(p) =>
      p.$active ? "var(--color-indigo-700)" : "var(--color-grey-200)"};
    color: ${(p) =>
      p.$active ? "var(--color-indigo-100)" : "var(--color-grey-700)"};
    font-size: 12px;
    font-weight: 700;
    flex: 0 0 22px;
  }
`;

export default function Stepper({ steps = [], active = 0 }) {
  return (
    <Wrap>
      {steps.map((label, i) => (
        <Item key={label} $active={i === active}>
          {label}
        </Item>
      ))}
    </Wrap>
  );
}
