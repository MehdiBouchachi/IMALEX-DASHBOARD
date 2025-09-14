import styled from "styled-components";

const Wrap = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: ${(p) => (p.$disabled ? "not-allowed" : "pointer")};
`;

const Hidden = styled.input.attrs({ type: "radio" })`
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--color-grey-300);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
  font-weight: 600;
  user-select: none;
  transition: background 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease, transform 0.05s ease;

  /* hover (only when not disabled) */
  ${Wrap}:not([data-disabled="true"]):hover & {
    border-color: var(--color-brand-700);
    background: color-mix(in srgb, var(--color-brand-100) 14%, transparent);
  }

  /* active/press */
  ${Wrap}:not([data-disabled="true"]):active & {
    transform: translateY(0.5px);
  }

  /* focus-visible ring from the hidden input */
  ${Hidden}:focus-visible + & {
    outline: 2px solid var(--color-brand-700);
    outline-offset: 2px;
  }

  /* selected */
  ${Hidden}:checked + & {
    border-color: var(--color-brand-700);
    box-shadow: inset 0 0 0 2px
      color-mix(in srgb, var(--color-brand-700) 12%, transparent);
    background: color-mix(in srgb, var(--color-brand-100) 30%, transparent);
  }

  /* disabled overrides everything */
  ${Hidden}:disabled + & {
    opacity: 0.55;
    cursor: not-allowed;
    background: var(--color-grey-0);
    border-color: var(--color-grey-300);
    outline: none;
    box-shadow: none;
    transform: none;
  }
`;

export default function RoleRadio({
  name,
  value,
  selected,
  disabled,
  label,
  onChange,
  title,
}) {
  const id = `${name}-${value}`;
  return (
    <Wrap
      htmlFor={id}
      title={title}
      data-disabled={disabled ? "true" : "false"}
    >
      <Hidden
        id={id}
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      <Pill>{label}</Pill>
    </Wrap>
  );
}
