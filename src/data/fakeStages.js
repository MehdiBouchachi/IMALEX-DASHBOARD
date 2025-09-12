// Ordered pipeline for briefs
export const STAGES = [
  "request_submitted",
  "awaiting_call",
  "proposal_in_progress",
  "awaiting_validation",
  "formulation_in_progress",
  "finalized",
];

export const STAGE_LABEL = (s) => (s || "").replaceAll("_", " ");
export const FIRST_STAGE = STAGES[0];
export const LAST_STAGE = STAGES[STAGES.length - 1];

export function stageIndex(stage) {
  const i = STAGES.indexOf(stage);
  return i < 0 ? 0 : i;
}

export function nextStage(stage) {
  const i = stageIndex(stage);
  return i >= STAGES.length - 1 ? null : STAGES[i + 1];
}

export function prevStage(stage) {
  const i = stageIndex(stage);
  return i <= 0 ? null : STAGES[i - 1];
}

export function progressPct(stage) {
  const i = stageIndex(stage);
  return Math.round((i / (STAGES.length - 1)) * 100);
}
