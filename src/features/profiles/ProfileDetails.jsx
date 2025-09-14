import React, { useMemo } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { format, formatDistanceToNowStrict } from "date-fns";

import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import Tag from "../../ui/Tag";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";

import { useProfile } from "./useProfile";
import ProfileRolesForm from "./UpdateUserRolesForm";

/* ──────────────────────────────────────────────────────────
   Layout + polish
────────────────────────────────────────────────────────── */
const Page = styled.div``;

const Shell = styled.section`
  border: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 1.6rem;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-grey-100);
`;

const AvatarWrap = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-100);
  box-shadow: 0 1px 0 var(--color-grey-100);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Identity = styled.div`
  display: grid;
  align-content: center;
  gap: 6px;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 2rem;
  line-height: 1.2;
  letter-spacing: 0.2px;
`;

const SubMeta = styled.div`
  color: var(--color-grey-600);
  font-size: 1.3rem;
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  padding-top: 16px;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border: 1px solid var(--color-grey-100);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  padding: 1.2rem;
`;

const PanelTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.2px;
`;

const Muted = styled.span`
  color: var(--color-grey-600);
`;

/* Global tags line */
const TagLine = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 28px;
`;

/* Teams list: compact, readable grid */
const TeamsList = styled.div`
  display: grid;
  gap: 10px;
`;
const TeamItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--color-grey-100);
  border-radius: 12px;
  background: var(--color-grey-0);
`;

const TeamName = styled.div`
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.2px;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-grey-200);
  background: var(--color-grey-0);
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--color-grey-700);
`;

const RoleDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${(p) =>
    p.$role === "headSector"
      ? "var(--color-brand-700)"
      : p.$role === "reviewer"
      ? "var(--color-yellow-700)"
      : "var(--color-grey-700)"};
`;

/* Meta list */
const MetaList = styled.div`
  display: grid;
  gap: 10px;
  dt {
    color: var(--color-grey-600);
  }
  dd {
    margin: 0;
  }
  div {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: baseline;
    gap: 12px;
  }
`;

/* ──────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────── */
const labelTeam = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

function getGlobalRoles(roles = []) {
  const out = [];
  for (const r of roles) {
    if (r.scope === "global" && (r.role === "admin" || r.role === "manager"))
      out.push(r.role);
  }
  return out;
}

// keep highest role per team (head > reviewer > editor)
function getTeamRoles(roles = []) {
  const prio = { headSector: 3, reviewer: 2, editor: 1 };
  const map = {};
  for (const r of roles) {
    if (r.scope && typeof r.scope === "object" && r.scope.team) {
      const t = r.scope.team;
      const cur = map[t];
      if (!cur || prio[r.role] > prio[cur]) map[t] = r.role;
    }
  }
  return map; // { teamSlug: "headSector"|"reviewer"|"editor" }
}

/* ──────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────── */
export default function ProfileDetails() {
  const { profileId } = useParams();
  const { profile, updateProfile, deleteProfile, isLoading } =
    useProfile(profileId);

  const globals = useMemo(
    () => getGlobalRoles(profile?.roles),
    [profile?.roles]
  );
  const teamMap = useMemo(() => getTeamRoles(profile?.roles), [profile?.roles]);

  if (isLoading) return null;
  if (!profile) return <Empty resourceName="profile" />;

  const created = profile.createdAt
    ? `${format(
        new Date(profile.createdAt),
        "PP"
      )} (${formatDistanceToNowStrict(new Date(profile.createdAt), {
        addSuffix: true,
      })})`
    : "—";
  const updated = profile.updatedAt
    ? `${format(
        new Date(profile.updatedAt),
        "PP"
      )} (${formatDistanceToNowStrict(new Date(profile.updatedAt), {
        addSuffix: true,
      })})`
    : "—";

  return (
    <Page>
      <Shell>
        <Header>
          <AvatarWrap>
            <img
              src={
                profile.avatar ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
              }
              alt={`${profile.displayName} avatar`}
            />
          </AvatarWrap>

          <Identity>
            <Name>{profile.displayName}</Name>
            <SubMeta>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              {" · "}
              {profile.phone || "—"}
            </SubMeta>
          </Identity>

          <Modal>
            <ButtonGroup>
              <Modal.Open opens="edit-roles">
                <Button>Edit roles</Button>
              </Modal.Open>
              <Modal.Open opens="delete-profile">
                <Button variation="danger">Delete</Button>
              </Modal.Open>
            </ButtonGroup>

            <Modal.Window name="edit-roles">
              <ProfileRolesForm
                profile={profile}
                teams={
                  // If you keep a central teams catalog, pass it here.
                  // Fallback to the user's teams or the keys inside roles.
                  profile.teams?.length
                    ? profile.teams
                    : Object.keys(getTeamRoles(profile.roles || []))
                }
                existingUsers={[]}
                currentUserRole="admin"
                currentUserTeams={[]}
                onSave={(updated) => updateProfile(updated)}
              />
            </Modal.Window>

            <Modal.Window name="delete-profile">
              <ConfirmDelete
                resourceName={profile.displayName}
                onConfirm={() => deleteProfile(profile.id)}
              />
            </Modal.Window>
          </Modal>
        </Header>

        <Body>
          {/* Access */}
          <Panel>
            <PanelTitle>Global</PanelTitle>
            <TagLine>
              {globals.length === 0 && <Muted>—</Muted>}
              {globals.includes("admin") && <Tag type="danger">ADMIN</Tag>}
              {globals.includes("manager") && <Tag type="blue">MANAGER</Tag>}
            </TagLine>

            <PanelTitle style={{ marginTop: 18 }}>Teams & roles</PanelTitle>
            {Object.keys(teamMap).length ? (
              <TeamsList>
                {Object.entries(teamMap)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([team, role]) => (
                    <TeamItem key={team}>
                      <TeamName>{labelTeam(team)}</TeamName>
                      <RoleBadge>
                        <RoleDot $role={role} />
                        {role === "headSector"
                          ? "Head"
                          : role === "reviewer"
                          ? "Reviewer"
                          : "Editor"}
                      </RoleBadge>
                    </TeamItem>
                  ))}
              </TeamsList>
            ) : (
              <Muted>No team roles.</Muted>
            )}
          </Panel>

          {/* Meta */}
          <Panel>
            <PanelTitle>Meta</PanelTitle>
            <MetaList as="dl">
              <div>
                <dt>Status</dt>
                <dd>{profile.status || "—"}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{created}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{updated}</dd>
              </div>
              <div>
                <dt>User ID</dt>
                <dd>{profile.id}</dd>
              </div>
            </MetaList>
          </Panel>
        </Body>
      </Shell>
    </Page>
  );
}
