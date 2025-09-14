import styled from "styled-components";
import RoleRadio from "./RoleRadio";

export const LEVEL = { NONE: 0, EDITOR: 1, REVIEWER: 2, HEAD: 3 };

const Wrap = styled.div``;

const Header = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1fr) repeat(4, 160px);
  padding: 8px 0;
  font-size: 1.2rem;
  opacity: 0.85;
  border-bottom: 1px solid var(--color-grey-200);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(160px, 1fr) repeat(4, 160px);
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-grey-100);
`;

const Team = styled.div`
  font-weight: 600;
  text-transform: capitalize;
`;

export default function TeamRoleGrid({
  teams,
  allowedTeams,
  values,
  headsByTeam,
  headCap = 2,
  isSubmitting,
  onSelect,
}) {
  return (
    <Wrap>
      <Header>
        <div>Team</div>
        <div>None</div>
        <div>Editor</div>
        <div>Reviewer</div>
        <div>Head sector</div>
      </Header>

      {teams.map((team) => {
        if (!allowedTeams.includes(team)) return null;

        const group = `teamLevels.${team}`;
        const selected = values.teamLevels?.[team] ?? LEVEL.NONE;
        const used = headsByTeam[team] || 0;
        const full = used >= headCap;
        const headDisabled = (full && selected !== LEVEL.HEAD) || isSubmitting;

        return (
          <Row key={team} role="radiogroup" aria-labelledby={`${team}-legend`}>
            <Team id={`${team}-legend`}>
              {team.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
            </Team>

            <RoleRadio
              name={group}
              value={LEVEL.NONE}
              selected={selected === LEVEL.NONE}
              disabled={isSubmitting}
              label="None"
              onChange={(lvl) => onSelect(team, lvl)}
            />
            <RoleRadio
              name={group}
              value={LEVEL.EDITOR}
              selected={selected === LEVEL.EDITOR}
              disabled={isSubmitting}
              label="Editor"
              onChange={(lvl) => onSelect(team, lvl)}
            />
            <RoleRadio
              name={group}
              value={LEVEL.REVIEWER}
              selected={selected === LEVEL.REVIEWER}
              disabled={isSubmitting}
              label="Reviewer"
              onChange={(lvl) => onSelect(team, lvl)}
            />
            <RoleRadio
              name={group}
              value={LEVEL.HEAD}
              selected={selected === LEVEL.HEAD}
              disabled={headDisabled}
              label={full && selected !== LEVEL.HEAD ? "Max" : "Head"}
              title={
                full && selected !== LEVEL.HEAD
                  ? "Head sector slots are full for this team"
                  : "Head sector"
              }
              onChange={(lvl) => onSelect(team, lvl)}
            />
          </Row>
        );
      })}
    </Wrap>
  );
}
