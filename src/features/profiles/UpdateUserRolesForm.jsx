// src/features/profiles/ProfileRolesForm.jsx
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import Checkbox from "../../ui/Checkbox";

/* ──────────────────────────────────────────────────────────
   Minimal radio pills
────────────────────────────────────────────────────────── */
const Radios = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const TeamRow = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-grey-100);
`;
const TeamName = styled.div`
  font-weight: 600;
  text-transform: capitalize;
`;
const Radio = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
  }

  span {
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
  }

  /* Hover: subtle hint (non-disabled only) */
  &:hover span {
    border-color: var(--color-brand-700);
    background: color-mix(in srgb, var(--color-brand-100) 14%, transparent);
  }

  /* Active press */
  &:active span {
    transform: translateY(0.5px);
  }

  /* Keyboard focus */
  input:focus-visible + span {
    outline: 2px solid var(--color-brand-700);
    outline-offset: 2px;
  }

  /* Selected */
  input:checked + span {
    border-color: var(--color-brand-700);
    box-shadow: inset 0 0 0 2px
      color-mix(in srgb, var(--color-brand-700) 12%, transparent);
    background: color-mix(in srgb, var(--color-brand-100) 30%, transparent);
  }

  /* Disabled wins over hover/active */
  input:disabled + span {
    opacity: 0.55;
    cursor: not-allowed;
    background: var(--color-grey-0);
    border-color: var(--color-grey-300);
    outline: none;
    box-shadow: none;
    transform: none;
  }
`;

const Section = styled.section`
  border: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 1.4rem;
  & + & {
    margin-top: 12px;
  }
`;
const SectionTitle = styled.h3`
  margin: 0 0 1.2rem;
  font-size: 1.4rem;
  font-weight: 700;
`;
const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1fr) auto;
  gap: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-grey-200);
  opacity: 0.9;
`;
const Legend = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 1.2rem;
  color: var(--color-grey-600);
`;
const ErrorBanner = styled.div`
  margin-bottom: 12px;
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid var(--color-yellow-700);
  background: color-mix(in srgb, var(--color-yellow-100) 18%, transparent);
`;

/* Levels */
const LEVEL = { NONE: 0, EDITOR: 1, REVIEWER: 2, HEAD: 3 };
const labelTeam = (slug) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

/* Helpers */
const hasGlobal = (u, role) =>
  (u.roles || []).some((r) => r.role === role && r.scope === "global");

const headCountsExcludingUser = (users = [], excludeId) => {
  const m = {};
  for (const u of users) {
    if (u.id === excludeId) continue;
    for (const r of u.roles || [])
      if (r.role === "headSector" && r.scope?.team)
        m[r.scope.team] = (m[r.scope.team] || 0) + 1;
  }
  return m;
};

const rolesToTeamLevels = (roles = [], teams) => {
  const map = Object.fromEntries(teams.map((t) => [t, LEVEL.NONE]));
  for (const r of roles) {
    if (r.scope && typeof r.scope === "object" && r.scope.team) {
      const t = r.scope.team;
      if (r.role === "headSector") map[t] = LEVEL.HEAD;
      else if (r.role === "reviewer") map[t] = LEVEL.REVIEWER;
      else if (r.role === "editor") map[t] = LEVEL.EDITOR;
    }
  }
  return map;
};

const buildRolesPayload = ({ global_admin, global_manager, teamLevels }) => {
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
};

export default function ProfileRolesForm({
  profile,
  currentUserRole = "admin", // "admin" | "manager" | "headSector"
  currentUserTeams = [], // if headSector, which teams they own
  teams = [],
  existingUsers = [],
  onSave,
  onCancel,
  isSubmitting = false,
  headCap = 2,
}) {
  const isAdmin = currentUserRole === "admin";
  const isManager = currentUserRole === "manager";
  const isHead = currentUserRole === "headSector";

  const allowedTeams = useMemo(() => {
    if (isHead) {
      const owned = new Set(currentUserTeams || []);
      return teams.filter((t) => owned.has(t));
    }
    return teams;
  }, [isHead, currentUserTeams, teams]);

  const headsByTeam = useMemo(
    () => headCountsExcludingUser(existingUsers, profile?.id),
    [existingUsers, profile?.id]
  );

  const defaultValues = useMemo(
    () => ({
      global_admin: hasGlobal(profile, "admin"),
      global_manager: hasGlobal(profile, "manager"),
      teamLevels: rolesToTeamLevels(profile.roles || [], teams),
    }),
    [profile, teams]
  );

  const { handleSubmit, setValue, getValues, watch, reset } = useForm({
    defaultValues,
    mode: "onBlur",
  });

  const values = watch();
  const [err, setErr] = useState("");

  const canTouchTeam = (team) =>
    isAdmin || isManager || (isHead && allowedTeams.includes(team));

  // Atomic: set HEAD on `team` and clear it everywhere else
  const setExclusiveHead = (team) => {
    const current = { ...(getValues("teamLevels") || {}) };
    for (const t of Object.keys(current)) {
      if (current[t] === LEVEL.HEAD && t !== team) current[t] = LEVEL.NONE;
    }
    current[team] = LEVEL.HEAD;
    setValue("teamLevels", current, { shouldDirty: true });
  };

  const trySetLevel = (team, targetLevel) => {
    const selected = values.teamLevels?.[team] ?? LEVEL.NONE;
    const used = headsByTeam[team] || 0;
    const full = used >= headCap;

    const baseDisabled = isSubmitting || !canTouchTeam(team);
    if (baseDisabled) return false;

    // HeadSector (current user) cannot grant Head
    if (targetLevel === LEVEL.HEAD && isHead) {
      setErr("HeadSector cannot grant Head.");
      return false;
    }

    // Respect team head cap unless user is already head of that same team
    if (targetLevel === LEVEL.HEAD && full && selected !== LEVEL.HEAD) {
      setErr(`"${labelTeam(team)}" HeadSector cap reached (${headCap}).`);
      return false;
    }

    setErr("");

    if (targetLevel === LEVEL.HEAD) {
      // make it exclusive
      setExclusiveHead(team);
    } else {
      setValue(`teamLevels.${team}`, targetLevel, { shouldDirty: true });
    }
    return true;
  };

  const save = (form) => {
    setErr("");

    if (!isAdmin) {
      form.global_admin = false;
      form.global_manager = false;
    }

    if (isHead) {
      // HeadSector user: limit to owned teams and never Head
      const filtered = {};
      for (const [team, lvl] of Object.entries(form.teamLevels || {})) {
        if (!allowedTeams.includes(team)) continue;
        filtered[team] = lvl === LEVEL.HEAD ? LEVEL.REVIEWER : lvl;
      }
      form.teamLevels = filtered;
    }

    // Final safety: ensure at most one Head
    let headCount = 0;
    for (const lvl of Object.values(form.teamLevels || {}))
      if (lvl === LEVEL.HEAD) headCount++;
    if (headCount > 1)
      return setErr("Only one HeadSector per user (choose one team).");

    // Respect head caps (can keep current head on a full team)
    const msgs = [];
    for (const [team, lvl] of Object.entries(form.teamLevels || {})) {
      const used = headsByTeam[team] || 0;
      const full = used >= headCap;
      const wasHead = defaultValues.teamLevels?.[team] === LEVEL.HEAD;
      if (lvl === LEVEL.HEAD && full && !wasHead)
        msgs.push(`"${labelTeam(team)}" HeadSector cap reached (${headCap}).`);
    }
    if (msgs.length) return setErr(msgs.join(" "));

    const roles = buildRolesPayload(form);
    const teamsSelected = Object.entries(form.teamLevels || {})
      .filter(([_, lvl]) => lvl !== LEVEL.NONE)
      .map(([t]) => t);

    onSave?.({
      ...profile,
      roles,
      teams: teamsSelected,
      updatedAt: new Date().toISOString(),
    });

    reset(form);
  };

  return (
    <Form onSubmit={handleSubmit(save)} type="regular">
      {err && <ErrorBanner role="alert">{err}</ErrorBanner>}

      {/* Global permissions — ONLY for Admin */}
      {isAdmin && (
        <Section>
          <SectionTitle>Permissions</SectionTitle>
          <FormRow label="Global">
            <div>
              <Checkbox
                id="global_admin"
                checked={!!values.global_admin}
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
                onChange={(e) =>
                  setValue("global_manager", e.target.checked, {
                    shouldDirty: true,
                  })
                }
              >
                Manager (global)
              </Checkbox>
            </div>
          </FormRow>
        </Section>
      )}

      <Section>
        <SectionTitle>Teams & scope</SectionTitle>

        <HeaderRow>
          <div>Team</div>
          <Legend>
            <span>None</span>·<span>Editor</span>·<span>Reviewer</span>·
            <span>Head</span>
          </Legend>
        </HeaderRow>

        {teams.map((team) => {
          if (!allowedTeams.includes(team)) return null;

          const selected = values.teamLevels?.[team] ?? LEVEL.NONE;
          const used = headsByTeam[team] || 0;
          const full = used >= headCap;

          const baseDisabled = isSubmitting || !canTouchTeam(team);
          const roleForbidsHead = isHead;
          const headCapReached = full && selected !== LEVEL.HEAD;

          const headDisabled =
            baseDisabled || roleForbidsHead || headCapReached;
          const headLabel = roleForbidsHead
            ? "Not allowed"
            : headCapReached
            ? "Max"
            : "Head";

          return (
            <TeamRow key={team} role="radiogroup" aria-label={labelTeam(team)}>
              <TeamName>{labelTeam(team)}</TeamName>

              <Radios>
                <Radio>
                  <input
                    type="radio"
                    name={`team-${team}`}
                    checked={selected === LEVEL.NONE}
                    disabled={baseDisabled}
                    onChange={() => trySetLevel(team, LEVEL.NONE)}
                  />
                  <span>None</span>
                </Radio>

                <Radio>
                  <input
                    type="radio"
                    name={`team-${team}`}
                    checked={selected === LEVEL.EDITOR}
                    disabled={baseDisabled}
                    onChange={() => trySetLevel(team, LEVEL.EDITOR)}
                  />
                  <span>Editor</span>
                </Radio>

                <Radio>
                  <input
                    type="radio"
                    name={`team-${team}`}
                    checked={selected === LEVEL.REVIEWER}
                    disabled={baseDisabled}
                    onChange={() => trySetLevel(team, LEVEL.REVIEWER)}
                  />
                  <span>Reviewer</span>
                </Radio>

                <Radio
                  title={
                    roleForbidsHead
                      ? "HeadSector cannot grant Head"
                      : headCapReached
                      ? "Head sector slots are full for this team"
                      : "Head sector"
                  }
                >
                  <input
                    type="radio"
                    name={`team-${team}`}
                    checked={selected === LEVEL.HEAD}
                    disabled={headDisabled}
                    onChange={() => trySetLevel(team, LEVEL.HEAD)}
                  />
                  <span>{headLabel}</span>
                </Radio>
              </Radios>
            </TeamRow>
          );
        })}
      </Section>

      <FormRow>
        <ButtonGroup>
          <Button
            variation="secondary"
            type="button"
            onClick={() => onCancel?.()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting}>Save changes</Button>
        </ButtonGroup>
      </FormRow>
    </Form>
  );
}
