import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

/* same localStorage key as user data (demo only) */
const KEY = "imalex:user:v1";
const loadUser = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveUser = (u) => localStorage.setItem(KEY, JSON.stringify(u));

/* ──────────────────────────────────────────────────────────
   UI bits
────────────────────────────────────────────────────────── */
const FieldWrap = styled.div`
  position: relative;
  display: grid;
`;
const EyeButton = styled.button.attrs({ type: "button" })`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 0;
  padding: 4px;
  line-height: 0;
  border-radius: 8px;
  color: var(--color-grey-700);

  &:hover {
    background: var(--color-grey-100);
  }
  &:focus-visible {
    outline: 2px solid var(--color-blue-700);
    outline-offset: 2px;
  }
`;

const StrengthWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;
const StrengthBar = styled.div`
  height: 6px;
  border-radius: 999px;
  background: var(--color-grey-100);
  overflow: hidden;
  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${(p) => p.$pct || 0}%;
    background: ${(p) =>
      p.$level === "good"
        ? "var(--color-green-700)"
        : p.$level === "medium"
        ? "var(--color-yellow-700)"
        : "var(--color-red-700)"};
    transition: width 0.2s ease;
  }
`;
const StrengthLabel = styled.span`
  font-size: 12px;
  color: var(--color-grey-700);
  font-weight: 700;
  text-transform: capitalize;
`;
const StrengthNote = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${(p) =>
    p.$level === "good"
      ? "var(--color-green-700)"
      : p.$level === "medium"
      ? "var(--color-yellow-800)"
      : "var(--color-red-700)"};
`;

/* simple scoring */
function score(pw = "") {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 12) s++;
  if (s <= 2) return { level: "low", pct: Math.min(34, pw ? 34 : 0) };
  if (s === 3) return { level: "medium", pct: 67 };
  return { level: "good", pct: 100 };
}

const noteFor = (level) =>
  level === "good"
    ? "Strong — nice! Keep it unique."
    : level === "medium"
    ? "Okay — add a symbol or more length."
    : "Weak — use 8+ chars, upper/lowercase, numbers & symbols.";

/* ──────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────── */
export default function UpdatePasswordForm() {
  const user = loadUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    getValues,
    reset,
    watch,
  } = useForm({
    defaultValues: { password: "", confirm: "" },
    mode: "onBlur",
  });

  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const pw = watch("password");
  const { level, pct } = score(pw);

  function onSubmit({ password }) {
    if (!user) return;
    const next = { ...user, password }; // demo only; don't store plaintext in prod
    saveUser(next);
    reset({ password: "", confirm: "" });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type="regular">
      <FormRow
        label="New password (min 8)"
        controlId="password"
        error={errors.password?.message}
      >
        <FieldWrap>
          <Input
            id="password"
            type={showPw1 ? "text" : "password"}
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="••••••••"
            {...register("password", {
              required: "This field is required",
              minLength: { value: 8, message: "Too short (min 8)" },
            })}
          />
          <EyeButton
            onClick={() => setShowPw1((s) => !s)}
            aria-label={showPw1 ? "Hide password" : "Show password"}
            title={showPw1 ? "Hide password" : "Show password"}
          >
            {showPw1 ? (
              <HiOutlineEyeSlash size={18} />
            ) : (
              <HiOutlineEye size={18} />
            )}
          </EyeButton>
        </FieldWrap>

        <StrengthWrap>
          <StrengthBar $level={level} $pct={pct} />
          <StrengthLabel>{level}</StrengthLabel>
        </StrengthWrap>
        <StrengthNote $level={level}>{noteFor(level)}</StrengthNote>
      </FormRow>

      <FormRow
        label="Confirm password"
        controlId="confirm"
        error={errors.confirm?.message}
      >
        <FieldWrap>
          <Input
            id="confirm"
            type={showPw2 ? "text" : "password"}
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="Repeat password"
            {...register("confirm", {
              required: "This field is required",
              validate: (v) =>
                v === getValues("password") || "Passwords do not match",
            })}
          />
          <EyeButton
            onClick={() => setShowPw2((s) => !s)}
            aria-label={showPw2 ? "Hide password" : "Show password"}
            title={showPw2 ? "Hide password" : "Show password"}
          >
            {showPw2 ? (
              <HiOutlineEyeSlash size={18} />
            ) : (
              <HiOutlineEye size={18} />
            )}
          </EyeButton>
        </FieldWrap>
      </FormRow>

      <FormRow>
        <ButtonGroup>
          <Button
            type="reset"
            variation="secondary"
            onClick={() => reset({ password: "", confirm: "" })}
            disabled={isSubmitting || !isDirty}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting || !isDirty}>Update password</Button>
        </ButtonGroup>
      </FormRow>
    </Form>
  );
}
