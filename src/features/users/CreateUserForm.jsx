import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import FileInput from "../../ui/FileInput";
import Checkbox from "../../ui/Checkbox";

import TeamRoleGrid, { LEVEL } from "./TeamRoleGrid";

/* ──────────────────────────────────────────────────────────
   SIMPLE + CLEAN (with validation + strength)
────────────────────────────────────────────────────────── */
const TEAMS_DEFAULT = [
  "cosmetics",
  "animal-nutrition",
  "biopesticides",
  "food-supplements",
  "agri-food",
];
const ALLOWED_HEAD_PER_TEAM = 2;

// Phone helpers: allow spaces, dashes, dots, parentheses in input; validate E.164 after normalization
const normalizePhone = (raw = "") => raw.replace(/[()\s.-]/g, "");
const isValidInternationalPhone = (raw = "") => {
  const v = normalizePhone(raw);
  return /^\+?[1-9]\d{7,14}$/.test(v); // + optional, start 1-9, total 8–15 digits
};

const Shell = styled(Form).attrs({ type: "regular" })``;
const Sections = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;
const Section = styled.section`
  border: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 1.4rem;
`;
const SectionTitle = styled.h3`
  margin: 0 0 1.2rem;
  font-size: 1.4rem;
  font-weight: 700;
`;
const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const AvatarPreview = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-grey-200);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const Note = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-grey-600);
`;
const QuickBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;
const ErrorBanner = styled.div.attrs({ role: "alert", "aria-live": "polite" })`
  margin-top: 8px;
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid var(--color-yellow-700);
  background: color-mix(in srgb, var(--color-yellow-100) 18%, transparent);
`;
const Footer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

/* Password UI */
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
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;
const StrengthBar = styled.div`
  height: 6px;
  flex: 1;
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
  color: var(--color-grey-600);
`;

/* ──────────────────────────────────────────────────────────
   Logic helpers
────────────────────────────────────────────────────────── */
const hasAdmin = (users = []) =>
  users.some((u) => (u.roles || []).some((r) => r.role === "admin"));

const headCounts = (users = []) => {
  const m = {};
  for (const u of users)
    for (const r of u.roles || [])
      if (r.role === "headSector" && r.scope?.team)
        m[r.scope.team] = (m[r.scope.team] || 0) + 1;
  return m;
};

const allowedTeamsByCreator = (role, teamsOwned, allTeams) =>
  role === "headSector"
    ? allTeams.filter((t) => new Set(teamsOwned || []).has(t))
    : allTeams;

function buildRolesPayload({ global_admin, global_manager, teamLevels }) {
  const roles = [];
  if (global_admin) roles.push({ role: "admin", scope: "global" });
  if (global_manager) roles.push({ role: "manager", scope: "global" });
  for (const [team, lvl] of Object.entries(teamLevels || {})) {
    if (lvl === LEVEL.HEAD) roles.push({ role: "headSector", scope: { team } });
    else if (lvl === LEVEL.REVIEWER)
      roles.push({ role: "reviewer", scope: { team } });
    else if (lvl === LEVEL.EDITOR)
      roles.push({ role: "editor", scope: { team } });
  }
  return roles;
}

/* Password strength (0..4 => low/med/good) */
function scorePassword(pw = "") {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 12) s++; // bonus length
  if (s <= 2) return { level: "low", pct: 34 };
  if (s === 3) return { level: "medium", pct: 67 };
  return { level: "good", pct: 100 };
}

/* ──────────────────────────────────────────────────────────
   Component
────────────────────────────────────────────────────────── */
export default function CreateUserForm({
  currentUserRole = "admin",
  currentUserTeams = [],
  existingUsers = [],
  teams = TEAMS_DEFAULT,
  onCreate,
  isSubmitting = false,
}) {
  const adminExists = useMemo(() => hasAdmin(existingUsers), [existingUsers]);
  const headsByTeam = useMemo(() => headCounts(existingUsers), [existingUsers]);
  const allowedTeams = useMemo(
    () => allowedTeamsByCreator(currentUserRole, currentUserTeams, teams),
    [currentUserRole, currentUserTeams, teams]
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
      avatarFile: null,
      global_admin: false,
      global_manager: false,
      teamLevels: Object.fromEntries(teams.map((t) => [t, LEVEL.NONE])),
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const values = watch();
  const [err, setErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [avatarPreviewURL, setAvatarPreviewURL] = useState("");

  useEffect(() => {
    const f = values.avatarFile?.[0];
    if (!f) {
      setAvatarPreviewURL("");
      return;
    }
    const url = URL.createObjectURL(f);
    setAvatarPreviewURL(url);
    return () => URL.revokeObjectURL(url);
  }, [values.avatarFile]);

  const canGrantAdmin = currentUserRole === "admin" && !adminExists;
  const canGrantManager = currentUserRole === "admin";

  // Enforce: only ONE HEAD across ALL teams
  const setTeamLevel = (team, lvl) => {
    if (lvl === LEVEL.HEAD) {
      const current = getValues("teamLevels") || {};
      const next = { ...current };
      // clear any existing HEADs on other teams
      for (const t of Object.keys(next)) {
        if (t !== team && next[t] === LEVEL.HEAD) next[t] = LEVEL.NONE;
      }
      next[team] = LEVEL.HEAD;
      setValue("teamLevels", next, { shouldDirty: true, shouldValidate: true });
      return;
    }
    setValue(`teamLevels.${team}`, lvl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const quickSetAll = (lvl) => {
    // never mass-assign HEAD
    if (lvl === LEVEL.HEAD) return;
    const current = getValues("teamLevels") || {};
    const next = { ...current };
    for (const t of Object.keys(next)) next[t] = lvl;
    setValue("teamLevels", next, { shouldDirty: true, shouldValidate: true });
  };

  const quickClear = () => {
    const current = getValues("teamLevels") || {};
    const next = { ...current };
    for (const t of Object.keys(next)) next[t] = LEVEL.NONE;
    setValue("teamLevels", next, { shouldDirty: true, shouldValidate: true });
  };

  function validateTeamSelectionIfNoManager(form) {
    const anyTeamRole = Object.values(form.teamLevels || {}).some(
      (lvl) => lvl !== LEVEL.NONE
    );
    if (!form.global_manager && !anyTeamRole) {
      return "Select at least one team role when the user is not a global manager.";
    }
    return "";
  }

  function onSubmit(form) {
    setErr("");

    // cross-field checks
    const headsSelected = Object.values(form.teamLevels || {}).filter(
      (lvl) => lvl === LEVEL.HEAD
    ).length;
    if (headsSelected > 1)
      return setErr("This user can be HeadSector for only one team.");
    const teamErr = validateTeamSelectionIfNoManager(form);
    if (teamErr) return setErr(teamErr);

    if (!form.password || form.password.length < 8)
      return setErr("Password must be at least 8 characters.");
    if (form.password !== form.passwordConfirm)
      return setErr("Passwords do not match.");

    // normalize & validate phone
    const phoneNormalized = normalizePhone(form.phone);
    if (!isValidInternationalPhone(form.phone))
      return setErr(
        "Phone is invalid. Use international format, e.g. +213 700 000 000."
      );

    if (currentUserRole !== "admin") {
      form.global_admin = false;
      form.global_manager = false;
    }
    if (currentUserRole === "headSector") {
      const filtered = {};
      for (const [team, lvl] of Object.entries(form.teamLevels || {}))
        if (allowedTeams.includes(team)) filtered[team] = lvl;
      form.teamLevels = filtered;
    }

    const msgs = [];
    for (const [team, lvl] of Object.entries(form.teamLevels || {}))
      if (
        lvl === LEVEL.HEAD &&
        (headsByTeam[team] || 0) >= ALLOWED_HEAD_PER_TEAM
      )
        msgs.push(
          `Team "${team}" already has ${headsByTeam[team]} HeadSectors (max ${ALLOWED_HEAD_PER_TEAM}).`
        );
    if (form.global_admin && adminExists)
      msgs.push("An admin already exists (unique).");
    if (msgs.length) return setErr(msgs.join(" "));

    const roles = buildRolesPayload(form);
    const teamsSelected = Object.entries(form.teamLevels || {})
      .filter(([_, lvl]) => lvl !== LEVEL.NONE)
      .map(([team]) => team);

    onCreate?.({
      displayName: form.displayName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: phoneNormalized, // submit normalized
      password: form.password,
      avatarFile: form.avatarFile?.[0] || null,
      roles,
      teams: teamsSelected,
      status: "active",
      createdAt: new Date().toISOString(),
    });

    reset();
    setAvatarPreviewURL("");
  }

  const pw = watch("password");
  const { level, pct } = scorePassword(pw);

  return (
    <Shell onSubmit={handleSubmit(onSubmit)}>
      {err && <ErrorBanner>{err}</ErrorBanner>}

      <Sections>
        <Section aria-labelledby="sec-identity">
          <SectionTitle id="sec-identity">Identity</SectionTitle>

          <FormRow
            label="Display name"
            controlId="displayName"
            error={errors.displayName?.message}
          >
            <Input
              id="displayName"
              placeholder="e.g., Lina Cherif"
              {...register("displayName", {
                required: "This field is required",
              })}
            />
          </FormRow>

          <FormRow
            label="Email"
            controlId="email"
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              placeholder="name@imalex.com"
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Provide a valid email address",
                },
              })}
            />
          </FormRow>

          <FormRow
            label="Phone"
            controlId="phone"
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+213 700 000 000"
              {...register("phone", {
                required: "This field is required",
                validate: (v) =>
                  isValidInternationalPhone(v) ||
                  "Use international format, e.g. +213 700 000 000",
              })}
            />
          </FormRow>

          <FormRow label="Avatar">
            <AvatarRow>
              <AvatarPreview>
                <img
                  src={
                    avatarPreviewURL ||
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                  }
                  alt="Avatar preview"
                />
              </AvatarPreview>
              <FileInput accept="image/*" {...register("avatarFile")} />
            </AvatarRow>
            <Note>Square images look best (min 256×256).</Note>
          </FormRow>
        </Section>

        <Section aria-labelledby="sec-credentials">
          <SectionTitle id="sec-credentials">Credentials</SectionTitle>

          <FormRow
            label="Password"
            controlId="password"
            error={errors.password?.message}
          >
            <FieldWrap>
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                {...register("password", {
                  required: "This field is required",
                  minLength: { value: 8, message: "Too short" },
                })}
              />
              <EyeButton
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                title={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <HiOutlineEyeSlash size={18} />
                ) : (
                  <HiOutlineEye size={18} />
                )}
              </EyeButton>
            </FieldWrap>
            <StrengthWrap>
              <StrengthBar $level={level} $pct={pct} />
              <StrengthLabel>
                {level === "good"
                  ? "Good"
                  : level === "medium"
                  ? "Medium"
                  : "Low"}
              </StrengthLabel>
            </StrengthWrap>
          </FormRow>

          <FormRow
            label="Repeat password"
            controlId="passwordConfirm"
            error={errors.passwordConfirm?.message}
          >
            <FieldWrap>
              <Input
                id="passwordConfirm"
                type={showPw2 ? "text" : "password"}
                placeholder="Repeat password"
                autoComplete="new-password"
                {...register("passwordConfirm", {
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
        </Section>

        <Section aria-labelledby="sec-roles">
          <SectionTitle id="sec-roles">Roles & scope</SectionTitle>

          {currentUserRole === "admin" && (
            <FormRow label="Global roles">
              <Sections as="div">
                <Checkbox
                  id="global_admin"
                  checked={!!values.global_admin}
                  disabled={!canGrantAdmin || isSubmitting}
                  onChange={(e) =>
                    setValue("global_admin", e.target.checked, {
                      shouldDirty: true,
                    })
                  }
                >
                  Admin (unique)
                </Checkbox>

                <Checkbox
                  id="global_manager"
                  checked={!!values.global_manager}
                  disabled={!canGrantManager || isSubmitting}
                  onChange={(e) =>
                    setValue("global_manager", e.target.checked, {
                      shouldDirty: true,
                    })
                  }
                >
                  Manager (global)
                </Checkbox>

                <Note>
                  {currentUserRole !== "admin"
                    ? "Only admin can grant admin or manager."
                    : adminExists
                    ? "An admin already exists; cannot add another."
                    : "Admin must be unique."}
                </Note>
              </Sections>
            </FormRow>
          )}

          <FormRow label="Team roles (single choice per team)">
            <div>
              <QuickBar>
                <Button
                  variation="secondary"
                  type="button"
                  onClick={quickClear}
                  disabled={isSubmitting}
                >
                  Select none
                </Button>
                <Button
                  variation="secondary"
                  type="button"
                  onClick={() => quickSetAll(LEVEL.EDITOR)}
                  disabled={isSubmitting}
                >
                  All editors
                </Button>
                <Button
                  variation="secondary"
                  type="button"
                  onClick={() => quickSetAll(LEVEL.REVIEWER)}
                  disabled={isSubmitting}
                >
                  All reviewers
                </Button>
              </QuickBar>

              <TeamRoleGrid
                teams={teams}
                allowedTeams={allowedTeams}
                values={values}
                headsByTeam={headsByTeam}
                headCap={ALLOWED_HEAD_PER_TEAM}
                isSubmitting={isSubmitting}
                onSelect={(team, lvl) => setTeamLevel(team, lvl)}
              />

              <Note>
                • Reviewer ⊃ Editor • HeadSector ⊃ Reviewer ⊃ Editor • Max{" "}
                {ALLOWED_HEAD_PER_TEAM} per team. • **Only one HeadSector team
                per user (auto-enforced).**
              </Note>
            </div>
          </FormRow>

          {err && <ErrorBanner>{err}</ErrorBanner>}
        </Section>
      </Sections>

      <Footer>
        <ButtonGroup>
          <Button
            variation="secondary"
            type="reset"
            onClick={() => {
              setErr("");
              reset();
              setAvatarPreviewURL("");
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting || !isValid}>Create user</Button>
        </ButtonGroup>
      </Footer>
    </Shell>
  );
}
