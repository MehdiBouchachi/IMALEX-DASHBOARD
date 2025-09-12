// src/features/briefs/useBriefStage.js
import { useEffect, useMemo, useState } from "react";
import {
  STAGES,
  STAGE_LABEL,
  stageIndex,
  nextStage,
  prevStage,
  progressPct,
} from "./stages";

const LS_KEY = "brief-stage-store-v1";

/**
 * Local store shape:
 * {
 *   [briefId]: {
 *     stage: string,
 *     updatedAt: ISOString,
 *     history: Array<{ stage, at, by?, note? }>
 *   }
 * }
 */
function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeStore(store) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  } catch {
    console.log();
  }
}

function validStage(s) {
  return STAGES.includes(s);
}

function normalizeSeedHistory(seedHistory = []) {
  return seedHistory
    .filter((h) => h && validStage(h.stage) && h.at)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
}

/**
 * Ensure a seeded entry for this brief in the store.
 */
function ensureSeed(store, briefId, initialStage, createdAt, seedHistory = []) {
  const id = String(briefId);
  if (store[id]) return store;

  const now = new Date().toISOString();
  const norm = normalizeSeedHistory(seedHistory);

  // Always start with a created/request event if we have createdAt
  const createdEvt =
    createdAt && validStage("request_submitted")
      ? { stage: "request_submitted", at: createdAt, by: "system" }
      : null;

  let history = [...(createdEvt ? [createdEvt] : []), ...norm];

  // Include initial stage if it's not already last
  if (initialStage && validStage(initialStage)) {
    const last = history[history.length - 1];
    if (!last || last.stage !== initialStage) {
      history.push({ stage: initialStage, at: now, by: "system" });
    }
  }

  // Fallback
  if (history.length === 0) {
    history = [{ stage: STAGES[0], at: now, by: "system" }];
  }

  const currentStage = history[history.length - 1].stage;
  const updatedAt = history[history.length - 1].at;

  store[id] = {
    stage: currentStage,
    updatedAt,
    history,
  };

  return store;
}

/**
 * Hook to manage stage + history for a brief (localStorage backed).
 * Call with safe values (no conditional hooks).
 */
export function useBriefStage(briefId, initialStage, createdAt, seedHistory) {
  const [store, setStore] = useState(() => {
    const s = readStore();
    return ensureSeed(
      { ...s },
      briefId,
      initialStage,
      createdAt,
      seedHistory || []
    );
  });

  // Persist on change
  useEffect(() => writeStore(store), [store]);

  const id = String(briefId);
  const entry = store[id] || { stage: STAGES[0], updatedAt: null, history: [] };

  // multi-tab sync (optional but nice)
  useEffect(() => {
    const handle = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        try {
          const incoming = JSON.parse(e.newValue);
          setStore(incoming);
        } catch {
          console.log();
        }
      }
    };
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  }, []);

  const current = entry.stage;
  const pct = progressPct(current);
  const idx = stageIndex(current);
  const canAdvance = idx < STAGES.length - 1;
  const canRevert = idx > 0;

  const setStage = (targetStage, { by = "user", note = "" } = {}) => {
    if (!validStage(targetStage)) return;
    setStore((prev) => {
      const draft = { ...prev };
      const e = { ...(draft[id] || {}) };
      const now = new Date().toISOString();
      e.stage = targetStage;
      e.updatedAt = now;
      e.history = [
        ...(e.history || []),
        { stage: targetStage, at: now, by, note },
      ];
      draft[id] = e;
      return draft;
    });
  };

  const advance = (opts) => {
    const n = nextStage(current);
    if (n) setStage(n, opts);
  };

  const revert = (opts) => {
    const p = prevStage(current);
    if (p) setStage(p, opts);
  };

  // Timeline-ready items
  const timeline = useMemo(
    () =>
      (entry.history || []).map((h) => ({
        label: `Moved to ${STAGE_LABEL(h.stage)}`,
        at: h.at,
        by: h.by,
        note: h.note,
        stage: h.stage,
      })),
    [entry.history]
  );

  return {
    stage: current,
    updatedAt: entry.updatedAt,
    history: entry.history || [],
    timeline,
    pct,
    index: idx,
    next: nextStage(current),
    prev: prevStage(current),
    canAdvance,
    canRevert,
    setStage,
    advance,
    revert,
  };
}
