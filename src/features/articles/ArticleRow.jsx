import { format, formatDistanceToNowStrict } from "date-fns";
import styled from "styled-components";
import Table from "../../ui/Table";
import Tag from "../../ui/Tag";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import {
  HiEye,
  HiArrowUpOnSquare,
  HiArrowDownOnSquare,
  HiTrash,
  HiPencilSquare,
  HiCheckCircle,
  HiPaperAirplane,
  HiPencil,
  HiPauseCircle,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

/* ----------------------------- tokens ----------------------------- */
const statusColor = {
  draft: "silver",
  in_review: "blue",
  changes_requested: "yellow",
  approved: "indigo",
  published: "green",
  unpublished: "silver",
  archived: "grey",
};

const phaseMap = {
  published: {
    Icon: HiCheckCircle,
    label: "Published",
    short: "Published",
    color: "var(--color-green-700)",
  },
  unpublished: {
    Icon: HiPauseCircle,
    label: "Unpublished",
    short: "Unpub.",
    color: "var(--color-grey-700)",
  },
  pushed: {
    Icon: HiPaperAirplane,
    label: "Pushed for review",
    short: "Review",
    color: "var(--color-blue-700)",
  },
  draft: {
    Icon: HiPencil,
    label: "Draft saved",
    short: "Draft",
    color: "var(--color-grey-700)",
  },
};

const STATUS_LABEL = {
  in_review: "IN REVIEW",
  draft: "DRAFT",
  approved: "APPROVED",
  changes_requested: "CHANGES REQ",
  unpublished: "UNPUBLISHED",
  published: "PUBLISHED",
  archived: "ARCHIVED",
};

/* ----------------------------- styles ----------------------------- */
const TitleWrap = styled.div`
  display: grid;
  gap: 2px;

  .title {
    font-weight: 600;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .sub {
    font-size: 1.2rem;
    color: var(--color-grey-500);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const LifeCell = styled.div`
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 10px;

  .ico {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
  }

  .line {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-grey-700);
    font-size: 1.3rem;
    white-space: nowrap;
    overflow: hidden;
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .label .long {
    display: inline;
  }
  .label .short {
    display: none;
  }

  .date {
    color: var(--color-grey-500);
  }
  .rel {
    color: var(--color-grey-500);
  }

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 999px;
    background: var(--color-grey-400);
    flex: 0 0 auto;
  }

  @media (max-width: 1250px) {
    .rel {
      display: none;
    }
  }
  @media (max-width: 1120px) {
    .label .long {
      display: none;
    }
    .label .short {
      display: inline;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

/* -------------------------- helpers -------------------------- */
function pickLifecycle(article) {
  if (article.status === "published") {
    return {
      key: "published",
      at: article.publishedAt || article.createdAt || null,
    };
  }
  if (article.status === "unpublished") {
    return {
      key: "unpublished",
      at: article.unpublishedAt || article.createdAt || null,
    };
  }
  if (["in_review", "approved", "changes_requested"].includes(article.status)) {
    return {
      key: "pushed",
      at: article.submittedAt || article.createdAt || null,
    };
  }
  return { key: "draft", at: article.updatedAt || article.createdAt || null };
}

function fmtAbs(iso) {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "MMM dd, yyyy");
  } catch {
    return "—";
  }
}
function fmtRel(iso) {
  if (!iso) return "";
  try {
    return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

/* ----------------------------- row ----------------------------- */
export default function ArticleRow({ article, onDelete }) {
  const navigate = useNavigate();
  const canPublish = article.status !== "published";
  const canUnpublish = article.status === "published";

  const life = pickLifecycle(article);
  const palette = phaseMap[life.key] || phaseMap.draft;
  const Icon = palette.Icon;
  const abs = fmtAbs(life.at);
  const rel = fmtRel(life.at);

  return (
    <Table.Row>
      {/* Title */}
      <TitleWrap>
        <div className="title">{article.title}</div>
        <div className="sub">
          {article.slug ? `/${article.slug}` : "No slug"}
          {article.tags?.length ? ` • ${article.tags.join(", ")}` : ""}
        </div>
      </TitleWrap>

      {/* Credit */}
      <div>
        {article.publishCredit === "team"
          ? article.team?.name || "—"
          : article.author?.displayName || "—"}
      </div>

      {/* Status */}
      <Tag type={statusColor[article.status] || "silver"}>
        {STATUS_LABEL[article.status] ||
          article.status.replace("_", " ").toUpperCase()}
      </Tag>

      {/* Visibility */}
      <div style={{ textTransform: "capitalize" }}>{article.visibility}</div>

      {/* Team */}
      <div>{article.team?.name || "—"}</div>

      {/* Lifecycle */}
      <LifeCell
        title={
          life.at
            ? `${palette.label} ${abs}${rel ? ` • ${rel}` : ""}`
            : palette.label
        }
      >
        <Icon className="ico" style={{ color: palette.color }} aria-hidden />
        <span
          className="line"
          aria-label={`${palette.label}${abs !== "—" ? ` ${abs}` : ""}`}
        >
          <span className="label">
            <span className="long">{palette.label}</span>
            <span className="short">{palette.short}</span>
          </span>
          {abs !== "—" && (
            <>
              <span className="dot" />
              <span className="date">{abs}</span>
              {rel && <span className="rel">({rel})</span>}
            </>
          )}
        </span>
      </LifeCell>

      {/* Actions (Modal wraps Menus, like CabinRow) */}
      <Actions>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={article.id} />
            <Menus.List id={article.id}>
              <Menus.Button
                icon={<HiPencilSquare />}
                onClick={() => navigate(`/articles/${article.id}/edit`)}
              >
                Edit
              </Menus.Button>
              <Menus.Button
                icon={<HiEye />}
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                See details
              </Menus.Button>

              {canPublish && (
                <Menus.Button
                  icon={<HiArrowUpOnSquare />}
                  onClick={() => alert("(static) Publish")}
                >
                  Publish
                </Menus.Button>
              )}
              {canUnpublish && (
                <Menus.Button
                  icon={<HiArrowDownOnSquare />}
                  onClick={() => alert("(static) Unpublish")}
                >
                  Unpublish
                </Menus.Button>
              )}

              <Modal.Open opens="delete-article">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="delete-article">
              <ConfirmDelete
                resourceName="article"
                onConfirm={() =>
                  onDelete
                    ? onDelete(article.id)
                    : alert(`(static) Delete id=${article.id}`)
                }
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </Actions>
    </Table.Row>
  );
}
