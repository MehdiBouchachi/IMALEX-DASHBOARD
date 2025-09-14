import { format, formatDistanceToNowStrict } from "date-fns";
import styled from "styled-components";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Tag from "../../ui/Tag";
import { HiUser, HiPencilSquare, HiTrash } from "react-icons/hi2";
import { fakeUsers } from "../../data/fakeUsers";
import UpdateUserRolesForm from "./UpdateUserRolesForm";

/* ───────── labels ───────── */
const TEAM_LABELS = {
  cosmetics: "Cosmetics",
  "animal-nutrition": "Animal Nutrition",
  biopesticides: "Biopesticides",
  "food-supplements": "Food Supplements",
  "agri-food": "Agri-Food",
};

/* role precedence per team */
const RANK = { headSector: 3, reviewer: 2, editor: 1 };
const rolesByTeam = (u) => {
  const out = {};
  for (const r of u.roles || []) {
    if (r.scope && typeof r.scope === "object" && r.scope.team) {
      const t = r.scope.team;
      if (!out[t] || RANK[r.role] > RANK[out[t]]) out[t] = r.role;
    }
  }
  return out;
};
const hasGlobal = (u, role) =>
  (u.roles || []).some((r) => r.role === role && r.scope === "global");

/* ───────── cell align helpers (mirror header) ───────── */
const CellLeft = styled.div`
  justify-self: start;
  text-align: left;
`;
const CellCenter = styled.div`
  justify-self: center;
  text-align: center;
`;
const CellRight = styled.div`
  justify-self: end;
  text-align: right;
`;

/* ───────── name (left) ───────── */
const NameCell = styled(CellLeft)`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  align-items: center;
  min-width: 260px;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid var(--color-grey-200);
`;
const NameWrap = styled.div`
  min-width: 0;
  .title {
    font-weight: 600;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sub {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/* ───────── phone (right) ───────── */
const PhoneCell = styled(CellRight)`
  font-variant-numeric: tabular-nums; /* vertical alignment for digits */
  color: var(--color-grey-700);
`;

/* ───────── global (center) ───────── */
const GlobalTags = styled(CellCenter)`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
`;

/* ───────── teams & roles (left) ───────── */
const Chips = styled(CellLeft)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  max-width: 68ch;
`;
const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  font-size: 12px;
  border-radius: 999px;
  border: 1px solid var(--color-grey-300);
  background: var(--color-grey-0);
  color: var(--color-grey-700);
`;
const Team = styled.span`
  font-weight: 600;
`;
const Role = styled.span`
  color: var(--color-grey-600);
`;

/* ───────── created (right, single line) ───────── */
const CreatedCell = styled(CellRight)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  white-space: nowrap; /* never wrap */
  color: var(--color-grey-700);
  font-size: 1.3rem;

  .muted {
    color: var(--color-grey-500);
  }
  .sep {
    color: var(--color-grey-400);
  }
`;

/* ───────── actions (fixed width col) ───────── */
const Actions = styled.div`
  width: 3.2rem;
  justify-self: end;
  display: flex;
  justify-content: flex-end;
`;

/* ───────── date helpers ───────── */
const fmtAbs = (iso) => {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "MMM dd, yyyy");
  } catch {
    return "—";
  }
};
const fmtRel = (iso) => {
  if (!iso) return "";
  try {
    return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
};

/* ───────── row ───────── */
export default function ProfileRow({ profile }) {
  const tmap = rolesByTeam(profile);

  const globalCell = (
    <>
      {hasGlobal(profile, "admin") && <Tag type="green">ADMIN</Tag>}
      {hasGlobal(profile, "manager") && <Tag type="blue">MANAGER</Tag>}
      {!hasGlobal(profile, "admin") && !hasGlobal(profile, "manager") && "—"}
    </>
  );

  const chips = (profile.teams || []).map((t) => {
    const role = tmap[t];
    const label =
      role === "headSector"
        ? "Head"
        : role === "reviewer"
        ? "Reviewer"
        : role === "editor"
        ? "Editor"
        : null;

    return (
      <Chip key={`${profile.id}-${t}`}>
        <Team>{TEAM_LABELS[t] || t}</Team>
        {label && <Role>· {label}</Role>}
      </Chip>
    );
  });

  const abs = fmtAbs(profile.createdAt);
  const rel = fmtRel(profile.createdAt);

  return (
    <Table.Row>
      <NameCell>
        <Avatar
          src={
            profile.avatar ||
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
          }
          alt={profile.displayName}
        />
        <NameWrap>
          <div className="title">{profile.displayName}</div>
          <div className="sub">{profile.email}</div>
        </NameWrap>
      </NameCell>

      <PhoneCell>{profile.phone || "—"}</PhoneCell>

      <GlobalTags>{globalCell}</GlobalTags>

      <Chips>{chips.length ? chips : "—"}</Chips>

      <CreatedCell aria-label={`Created ${abs}${rel ? `, ${rel}` : ""}`}>
        {abs !== "—" ? (
          <>
            <span>{abs}</span>
            {rel && (
              <>
                <span className="sep">·</span>
                <span className="muted">{rel}</span>
              </>
            )}
          </>
        ) : (
          "—"
        )}
      </CreatedCell>

      <Actions>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={profile.id} />
            <Menus.List id={profile.id}>
              <Menus.Button icon={<HiUser />}>View</Menus.Button>
              <Modal.Open opens="edit-roles">
                <Menus.Button icon={<HiPencilSquare />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete-profile">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
            <Modal.Window name="edit-roles">
              <UpdateUserRolesForm
                profile={profile}
                currentUserRole={"admin" /* or "manager" | "headSector" */}
                currentUserTeams={["animal-nutrition"] /* if headSector */}
                teams={[
                  "cosmetics",
                  "animal-nutrition",
                  "biopesticides",
                  "food-supplements",
                  "agri-food",
                ]}
                existingUsers={fakeUsers}
                isSubmitting={false}
                onSave={(updated) => {
                  // merge into your store
                  console.log("SAVE", updated);
                }}
                onCancel={() => {}}
              />
            </Modal.Window>

            <Modal.Window name="delete-profile">
              <ConfirmDelete
                resourceName="user"
                onConfirm={() => console.log("delete user", profile.id)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </Actions>
    </Table.Row>
  );
}
