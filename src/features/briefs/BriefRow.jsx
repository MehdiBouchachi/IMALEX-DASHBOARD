// src/features/briefs/BriefRow.jsx
import { format, formatDistanceToNowStrict } from "date-fns";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineEllipsisVertical,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

/* cells */
const ClientCell = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 10px;
  align-items: center;

  img {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    object-fit: cover;
    background: var(--color-grey-100);
  }
  .name {
    font-weight: 600;
    color: var(--color-grey-800);
  }
  .meta {
    font-size: 12px;
    color: var(--color-grey-500);
  }
`;
const Needs = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  span {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--color-grey-100);
    color: var(--color-grey-700);
    font-size: 12px;
    font-weight: 600;
  }
`;
const ActionsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const stageColor = {
  request_submitted: "silver",
  awaiting_call: "blue",
  proposal_in_progress: "indigo",
  awaiting_validation: "yellow",
  formulation_in_progress: "indigo",
  finalized: "green",
};

export default function BriefRow({ brief, onDelete }) {
  const navigate = useNavigate();
  const { client } = brief;

  const created = brief.createdAt
    ? format(new Date(brief.createdAt), "PPP")
    : "—";
  const rel = brief.updatedAt
    ? formatDistanceToNowStrict(new Date(brief.updatedAt), { addSuffix: true })
    : "";

  const needs = brief.needs || [];
  const first = needs.slice(0, 2);
  const rest = needs.length - first.length;

  const sectorLabel = brief.sector?.replaceAll("_", " ") || "—";
  const stageLabel = brief.stage?.replaceAll("_", " ") || "—";
  const menuId = `brief-${brief.id}`;

  return (
    <Table.Row>
      {/* Client */}
      <ClientCell title={`${client?.name ?? ""} • ${client?.company ?? ""}`}>
        <img src={client?.avatarUrl} alt={client?.name || "Client"} />
        <div>
          <div className="name">{client?.name || "—"}</div>
          <div className="meta">
            {client?.company || "—"} • {client?.email || "—"}
          </div>
        </div>
      </ClientCell>

      {/* Stage */}
      <Tag type={stageColor[brief.stage] || "silver"}>{stageLabel}</Tag>

      {/* Sector */}
      <div style={{ color: "var(--color-grey-700)" }}>{sectorLabel}</div>

      {/* Needs */}
      <Needs>
        {first.map((n) => (
          <span key={n}>{n.replaceAll("_", " ")}</span>
        ))}
        {rest > 0 && <span>+{rest} more</span>}
      </Needs>

      {/* Lifecycle */}
      <div style={{ color: "var(--color-grey-700)" }}>
        {created}{" "}
        <span style={{ color: "var(--color-grey-500)" }}>({rel})</span>
      </div>

      {/* Actions — Modal wraps Menus, and Toggle/List sit inside Menus.Menu */}
      <ActionsWrap>
        <Modal>
          <Menus>
            <Menus.Menu>
              <Menus.Toggle id={menuId}>
                <HiOutlineEllipsisVertical />
              </Menus.Toggle>

              <Menus.List id={menuId}>
                <Menus.Button
                  icon={<HiOutlineEye />}
                  onClick={() => navigate(`/briefs/${brief.id}`)}
                >
                  See details
                </Menus.Button>

                <Modal.Open opens="delete-brief">
                  <Menus.Button icon={<HiOutlineTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="delete-brief">
                <ConfirmDelete
                  resourceName="brief"
                  onConfirm={() =>
                    onDelete
                      ? onDelete(brief.id)
                      : alert(`(static) Delete id=${brief.id}`)
                  }
                />
              </Modal.Window>
            </Menus.Menu>
          </Menus>
        </Modal>
      </ActionsWrap>
    </Table.Row>
  );
}
