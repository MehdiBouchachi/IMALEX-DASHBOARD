// src/features/briefs/StageControls.jsx
import styled from "styled-components";
import { useState } from "react";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Modal from "../../ui/Modal";
import { STAGES, STAGE_LABEL } from "./stages";

/* ───────────────── UI ───────────────── */

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

/* Dialog chrome */
const Dialog = styled.div`
  width: min(560px, 92vw);
`;

const TitleRow = styled.h3`
  margin: 0 0 8px; /* compact title-to-content gap */
  line-height: 1.15;
  letter-spacing: 0.2px;
`;

const Helper = styled.p`
  margin: 0 0 10px;
  color: var(--color-grey-600);
  font-size: 1.3rem;
`;

/* Radio list with reduced vertical spacing */
const List = styled.ul`
  list-style: none;
  margin: 0 0 8px;
  padding: 0;
  display: grid;
  gap: 4px; /* tighter than before */
`;

/* Hide native radio, keep it accessible */
const HiddenRadio = styled.input.attrs({ type: "radio" })`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

/* Small visual radio dot */
const RadioIcon = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  border: 2px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "var(--color-grey-300)")};
  transition: border-color 0.15s ease;

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${(p) =>
      p.$active ? "var(--color-brand-600)" : "transparent"};
    transform: scale(${(p) => (p.$active ? 1 : 0.6)});
    opacity: ${(p) => (p.$active ? 1 : 0)};
    transition: transform 0.15s ease, opacity 0.15s ease, background 0.15s ease;
  }
`;

/* Row with primary highlight when selected */
const Row = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px; /* reduced padding */
  border-radius: 12px;
  cursor: pointer;

  border: 1.5px solid
    ${(p) => (p.$active ? "var(--color-brand-600)" : "var(--color-grey-100)")};
  background: ${(p) =>
    p.$active ? "rgba(99, 102, 241, 0.08)" : "var(--color-grey-50)"};
  box-shadow: ${(p) => (p.$active ? " rgba(99,102,241,.10)" : "none")};
  transition: background 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: ${(p) =>
      p.$active ? "rgba(99, 102, 241, 0.12)" : "var(--color-grey-100)"};
    border-color: ${(p) =>
      p.$active ? "var(--color-brand-600)" : "var(--color-grey-200)"};
  }
`;

const LabelText = styled.span`
  font-size: 14px;
  color: var(--color-grey-200); /* ensure readable in dark; overridden below */
  color: var(--color-grey-700);
`;

/* Fallback note (if you don’t pass your own textarea component) */
const FallbackNote = styled.textarea`
  width: 100%;
  min-height: 72px;
  border-radius: 8px;
  border: 1px solid var(--color-grey-200);
  padding: 8px 10px;
  resize: vertical;
  font: inherit;
  color: var(--color-grey-800);
  background: var(--color-grey-0);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
    border-color: var(--color-brand-600);
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
`;

/* ─────────────── Component ─────────────── */

export default function StageControls({
  stage, // current stage string
  next, // next stage string or null
  canAdvance, // boolean
  onAdvance, // (note: string) => void
  onChangeStage, // (targetStage: string, note: string) => void
  NoteComponent, // optional: your ready-made textarea
}) {
  const Note = NoteComponent || FallbackNote;

  return (
    <Wrap>
      {/* Advance to next */}
      <Modal>
        <Modal.Open opens="advance">
          <Button size="small" disabled={!canAdvance}>
            {canAdvance
              ? `Move to ${STAGE_LABEL(next)}`
              : "Reached final stage"}
          </Button>
        </Modal.Open>
        <Modal.Window name="advance">
          {/* Modal.Window injects onClose into child props */}
          <AdvanceDialog
            current={stage}
            next={next}
            onConfirm={(note, onClose) => {
              onAdvance(note);
              onClose?.();
            }}
            Note={Note}
          />
        </Modal.Window>
      </Modal>

      {/* Jump/change to any stage */}
      <Modal>
        <Modal.Open opens="change-stage">
          <ButtonText>Change stage…</ButtonText>
        </Modal.Open>
        <Modal.Window name="change-stage">
          <ChangeStageDialog
            current={stage}
            onConfirm={(target, note, onClose) => {
              onChangeStage(target, note);
              onClose?.();
            }}
            Note={Note}
          />
        </Modal.Window>
      </Modal>
    </Wrap>
  );
}

/* ─────────────── Dialogs ─────────────── */

function AdvanceDialog({ current, next, onConfirm, Note, onClose }) {
  const [note, setNote] = useState("");

  return (
    <Dialog>
      <TitleRow>Advance stage</TitleRow>
      <Helper>
        You are moving from <b>{STAGE_LABEL(current)}</b> to{" "}
        <b>{STAGE_LABEL(next)}</b>. Add a short note (required) for the
        timeline.
      </Helper>

      <Note
        placeholder="e.g., Client validated the proposal; starting formulation."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <FooterRow>
        <Button
          variation="primary"
          size="medium"
          onClick={() => onConfirm(note.trim(), onClose)}
          disabled={!note.trim()}
        >
          Confirm
        </Button>
      </FooterRow>
    </Dialog>
  );
}

function ChangeStageDialog({ current, onConfirm, Note, onClose }) {
  const [target, setTarget] = useState(current);
  const [note, setNote] = useState("");

  return (
    <Dialog>
      <TitleRow>Change stage</TitleRow>

      <List role="radiogroup" aria-label="Select a stage">
        {STAGES.map((s) => {
          const active = target === s;
          return (
            <li key={s}>
              <Row $active={active}>
                <HiddenRadio
                  name="stage"
                  value={s}
                  checked={active}
                  onChange={() => setTarget(s)}
                />
                <RadioIcon $active={active} aria-hidden="true" />
                <LabelText>{STAGE_LABEL(s)}</LabelText>
              </Row>
            </li>
          );
        })}
      </List>

      <Note
        placeholder="Optional note (recommended for audit trail)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <FooterRow>
        <Button
          variation="primary"
          size="medium"
          onClick={() => onConfirm(target, note.trim(), onClose)}
        >
          Confirm
        </Button>
      </FooterRow>
    </Dialog>
  );
}
