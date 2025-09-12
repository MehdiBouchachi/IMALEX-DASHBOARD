// src/features/briefs/BriefDetail.jsx
import styled from "styled-components";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Tag from "../../ui/Tag";
import Empty from "../../ui/Empty";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

import {
  HiOutlineArrowLeft,
  HiOutlineClipboard,
  HiOutlineUser,
  HiOutlineBuildingOffice,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlineInformationCircle,
  HiOutlineBeaker,
} from "react-icons/hi2";

import { fakeBriefs } from "../../data/fakeBriefs";
import StageControls from "./StageControls";
import { useBriefStage } from "./useBriefStage";
import { STAGE_LABEL } from "./stages";
import Textarea from "../../ui/Textarea";
import BriefTimeline from "./BriefTimeline";
import { useMoveBack } from "../../hooks/useMoveBack";

/* ───────────────── helpers ───────────────── */
const fmt = (iso) => (iso ? format(new Date(iso), "PPP p") : "—");
const rel = (iso) =>
  iso ? formatDistanceToNowStrict(new Date(iso), { addSuffix: true }) : "";

/* Tag color map (same mapping you used in table) */
const stageColor = {
  request_submitted: "silver",
  awaiting_call: "blue",
  proposal_in_progress: "indigo",
  awaiting_validation: "yellow",
  formulation_in_progress: "indigo",
  finalized: "green",
};

/* ───────────────── layout ───────────────── */
const PageWrap = styled.div`
  --pad: clamp(14px, 2vw, 22px);
`;

const HeaderCard = styled.header`
  --hdr-pad: clamp(16px, 2.4vw, 28px);
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: clamp(14px, 1.4vw, 20px);
  align-items: center;

  border: 1px solid var(--color-grey-100);
  background: linear-gradient(
    180deg,
    var(--color-grey-50),
    var(--color-grey-0)
  );
  border-radius: var(--border-radius-lg);
  padding: var(--hdr-pad);
  box-shadow: var(--shadow-sm);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  img {
    width: 72px;
    height: 72px;
    border-radius: 999px;
    object-fit: cover;
    background: var(--color-grey-100);
    box-shadow: 0 0 0 1px var(--color-grey-100) inset;

    @media (max-width: 700px) {
      margin-bottom: 6px;
    }
  }
`;

const TitleBlock = styled.div`
  display: grid;
  row-gap: clamp(8px, 1.2vw, 14px);

  .top {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1vw, 16px);
    flex-wrap: wrap;
  }
  .client {
    margin: 0;
    line-height: 1.15;
    letter-spacing: -0.01em;
    font-size: clamp(22px, 2.1vw + 12px, 34px);
    color: var(--color-grey-900);
    font-weight: 700;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    color: var(--color-grey-600);
    font-size: 1.1rem;
    margin-top: 2px;
  }
  .pill {
    width: fit-content;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.44rem 0.9rem;
    border-radius: 100px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--color-grey-100);
    color: var(--color-grey-700);
    box-shadow: inset 0 0 0 1px var(--color-grey-200);
  }
`;

const StageBar = styled.div`
  margin-top: 4px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding-top: 4px;
`;
const Progress = styled.div`
  height: 6px;
  background: var(--color-grey-100);
  border-radius: 999px;
  overflow: hidden;
  > span {
    display: block;
    height: 100%;
    width: ${(p) => p.$pct}%;
    background: var(--color-brand-600);
    border-radius: 999px;
    transition: width 0.25s ease;
  }
`;
const StageText = styled.span`
  color: var(--color-grey-600);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const ActionsBar = styled.div`
  margin-top: clamp(12px, 1.4vw, 18px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: clamp(10px, 1.2vw, 14px) 0;
  border-top: 1px solid var(--color-grey-100);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 16px;

  @media (min-width: 1020px) {
    grid-template-columns: 1.08fr 0.92fr;
  }
`;

const Surface = styled.section`
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-lg);
  padding: 1.8rem;
  box-shadow: var(--shadow-md);
`;
const SideCard = styled.article`
  background: linear-gradient(
    180deg,
    var(--color-grey-50),
    var(--color-grey-0)
  );
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 1.4rem;
`;

const SectionLabel = styled.h3`
  margin: 0 0 12px;
  color: var(--color-grey-500);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const MetaList = styled.dl`
  margin: 0;
`;
const RowLine = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.2rem;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px dashed var(--color-grey-100);
`;
const Dt = styled.dt`
  color: var(--color-grey-500);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;
const Dd = styled.dd`
  margin: 0;
  color: var(--color-grey-700);
`;

const Needs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const NeedPill = styled.span`
  background: var(--color-grey-100);
  color: var(--color-grey-700);
  padding: 0.36rem 0.9rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const FooterActions = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-grey-800);
  color: var(--color-grey-0);
  padding: 10px 14px;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-lg);
  font-size: 13px;
  z-index: 60;
`;

/* util line */
const Line = ({ label, children }) => (
  <RowLine>
    <Dt>{label}</Dt>
    <Dd>{children ?? "—"}</Dd>
  </RowLine>
);

/* local fake data hook */
function useBrief(briefId) {
  const brief = fakeBriefs.find((b) => String(b.id) === String(briefId));
  return { brief };
}

/* ───────────────── main ───────────────── */
export default function BriefDetail() {
  const { briefId } = useParams();
  const { brief } = useBrief(briefId);
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const client = brief.client || {};

  // Live stage state + timeline (persists in localStorage)
  const { stage, pct, timeline, next, canAdvance, setStage, advance } =
    useBriefStage(brief.id, brief.stage, brief.createdAt, brief.stageHistory);

  const stageLabel = STAGE_LABEL(stage);
  const sectorLabel = brief.sector?.replaceAll("_", " ") || "—";
  const needs = brief.needs || [];
  const lastUpdatedAt =
    (timeline.at(-1)?.at || brief.updatedAt) ?? brief.updatedAt;

  const copy = async (text, msg) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(msg || "Copied!");
    } catch {
      setToast("Could not copy");
    } finally {
      setTimeout(() => setToast(""), 1600);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === "b") navigate(-1);
      if (k === "e") navigate(`/briefs/${brief.id}/edit`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, brief.id]);

  // Static events (created/last updated)
  const staticTimeline = useMemo(
    () =>
      [
        {
          key: "created",
          icon: HiOutlineClock,
          label: "Created",
          at: brief.createdAt,
        },
        lastUpdatedAt && {
          key: "updated",
          icon: HiOutlineDocumentText,
          label: "Last updated",
          at: lastUpdatedAt,
        },
      ].filter(Boolean),
    [brief.createdAt, lastUpdatedAt]
  );
  if (!brief) return <Empty resourceName="brief" />;

  return (
    <PageWrap>
      {/* Header */}
      <HeaderCard>
        <img src={client.avatarUrl} alt={client.name || "Client"} />
        <TitleBlock>
          <div className="top">
            <Heading as="h1" className="client">
              {client.name || "—"}
            </Heading>
            <Tag type={stageColor[stage] || "silver"} title={stageLabel}>
              <span className="txt">{stageLabel}</span>
            </Tag>
          </div>

          <div className="meta">
            <span className="pill">
              <HiOutlineBuildingOffice /> {client.company || "—"}
            </span>
            {client.email && (
              <span className="pill">
                <HiOutlineEnvelope /> {client.email}
              </span>
            )}
            {client.phone && (
              <span className="pill">
                <HiOutlinePhone /> {client.phone}
              </span>
            )}
          </div>

          {/* Progress + Controls */}
          <StageBar>
            <Progress $pct={pct}>
              <span />
            </Progress>
            <StageText>{stageLabel}</StageText>
          </StageBar>

          <div style={{ marginTop: 8 }}>
            <StageControls
              stage={stage}
              next={next}
              canAdvance={canAdvance}
              onAdvance={(note) => advance({ note, by: "user" })}
              onChangeStage={(target, note) =>
                setStage(target, { note, by: "user" })
              }
              NoteComponent={Textarea}
            />
          </div>
        </TitleBlock>
      </HeaderCard>

      {/* Utility actions */}
      <ActionsBar>
        <ButtonText onClick={moveBack} aria-label="Go back">
          <HiOutlineArrowLeft /> Back
        </ButtonText>
        <ButtonGroup>
          <Button
            variation="secondary"
            size="small"
            onClick={() => copy(brief.id, "Brief ID copied")}
          >
            <HiOutlineClipboard /> Copy ID
          </Button>
          {client.email && (
            <Button
              variation="secondary"
              size="small"
              onClick={() => copy(client.email, "Email copied")}
            >
              <HiOutlineClipboard /> Copy email
            </Button>
          )}
          {client.phone && (
            <Button
              variation="secondary"
              size="small"
              onClick={() => copy(client.phone, "Phone copied")}
            >
              <HiOutlineClipboard /> Copy phone
            </Button>
          )}
        </ButtonGroup>
      </ActionsBar>

      {/* Content */}
      <Grid>
        {/* LEFT: details */}
        <Surface aria-label="Brief details">
          <SectionLabel>
            <HiOutlineInformationCircle
              style={{ marginRight: 6, opacity: 0.8 }}
            />
            Details
          </SectionLabel>

          <MetaList>
            <Line label="Client name">
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <HiOutlineUser style={{ opacity: 0.7 }} /> {client.name || "—"}
              </span>
            </Line>
            <Line label="Company">
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <HiOutlineBuildingOffice style={{ opacity: 0.7 }} />{" "}
                {client.company || "—"}
              </span>
            </Line>
            <Line label="Email">
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <HiOutlineEnvelope style={{ opacity: 0.7 }} />{" "}
                {client.email || "—"}
              </span>
            </Line>
            <Line label="Phone">
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <HiOutlinePhone style={{ opacity: 0.7 }} />{" "}
                {client.phone || "—"}
              </span>
            </Line>

            <Line label="Stage">
              <Tag type={stageColor[stage] || "silver"} title={stageLabel}>
                <span className="txt">{stageLabel}</span>
              </Tag>
            </Line>

            <Line label="Sector">{sectorLabel}</Line>

            <Line label="Needs">
              {needs.length ? (
                <Needs>
                  {needs.map((n) => (
                    <NeedPill key={n}>
                      <HiOutlineTag style={{ opacity: 0.85 }} />
                      {n.replaceAll("_", " ")}
                    </NeedPill>
                  ))}
                </Needs>
              ) : (
                "—"
              )}
            </Line>

            <Line label="Notes / Brief text">{brief.brief || "—"}</Line>

            <SectionLabel style={{ marginTop: 14 }}>
              <HiOutlineBeaker style={{ marginRight: 6, opacity: 0.8 }} />
              R&D / Formulation
            </SectionLabel>
            <Line label="Formulation state">
              {brief.formulation_state
                ? brief.formulation_state.replaceAll("_", " ")
                : "—"}
            </Line>
          </MetaList>
        </Surface>

        {/* RIGHT: lifecycle */}
        <SideCard aria-label="Lifecycle">
          <SectionLabel>
            <HiOutlineClock style={{ marginRight: 6, opacity: 0.8 }} />
            Lifecycle
          </SectionLabel>

          <MetaList>
            <Line label="Created">
              {brief.createdAt ? (
                <>
                  {fmt(brief.createdAt)}{" "}
                  <span style={{ color: "var(--color-grey-500)" }}>
                    ({rel(brief.createdAt)})
                  </span>
                </>
              ) : (
                "—"
              )}
            </Line>

            {lastUpdatedAt && (
              <Line label="Last updated">
                {fmt(lastUpdatedAt)}{" "}
                <span style={{ color: "var(--color-grey-500)" }}>
                  ({rel(lastUpdatedAt)})
                </span>
              </Line>
            )}
          </MetaList>

          <SectionLabel style={{ marginTop: 14 }}>Timeline</SectionLabel>

          {/* New elegant timeline */}
          <BriefTimeline events={[...staticTimeline, ...timeline]} />
        </SideCard>
      </Grid>

      {/* Bottom-right actions */}
      <FooterActions>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete</Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="brief"
              onConfirm={() => {
                setToast(`(static) Delete id=${brief.id}`);
                setTimeout(() => setToast(""), 1600);
              }}
            />
          </Modal.Window>
        </Modal>
      </FooterActions>

      {toast && (
        <Toast role="status" aria-live="polite">
          {toast}
        </Toast>
      )}
    </PageWrap>
  );
}
