// src/features/articles/editor/state/useArticleEditorState.js
import { useEffect, useMemo, useReducer } from "react";
import { ensureSlug, estimateReadTimeFromText } from "../../utils/helpers";
import { blocksToPlainText } from "./editor/BlockEditor";

/* ------------ initial state builder (destructure once) ------------ */
function buildInitialState({ mode, initial, fallbackTeamId = 1 }) {
  const {
    title: initialTitle = "",
    bodyBlocks: initialBlocks = [{ t: "p", x: "" }],
    slug: initialSlug = "",
    publishCredit: initialCredit = "team",
    team: initialTeam,
    visibility: initialVisibility = "private",
    allowedUserIds: initialAllowed = [],
    hero: initialHero,
    readTimeMin: initialRead = 5,
    excerpt: initialExcerpt = "",
    tags: initialTags = ["R&D"],
    author: initialAuthor,
    createdAt: initialCreatedAt,
    publishedAt: initialPublishedAt,
    status: initialStatus,
    id: initialId,
  } = initial || {};

  return {
    step: 1,
    showPreview: false,

    // write
    title: initialTitle,
    blocks: initialBlocks,

    // details
    slug: initialSlug,
    lockSlug: Boolean(initialSlug),
    slugTouched: Boolean(initialSlug),
    publishCredit: initialCredit,
    teamId: initialTeam?.id ?? fallbackTeamId,
    visibility: initialVisibility,
    selectedUserIds: (initialAllowed ?? []).join(", "),
    heroFile: null,
    heroPreview: initialHero?.url ?? "",
    readTimeMin: initialRead ?? 5,
    excerpt: initialExcerpt,
    tags: initialTags,

    // meta
    mode,
    initialId: initialId ?? null,
    initialAuthor: initialAuthor ?? null,
    initialCreatedAt,
    initialPublishedAt,
    initialStatus,
  };
}

/* ------------------------------- reducer ------------------------------- */
function reducer(state, action) {
  switch (action.type) {
    case "SET": {
      const { key, value } = action;
      return { ...state, [key]: value };
    }
    case "SET_BLOCKS":
      return { ...state, blocks: action.blocks };
    case "SET_HERO": {
      const { file, preview } = action;
      return { ...state, heroFile: file, heroPreview: preview };
    }
    case "CLEAR_HERO":
      return { ...state, heroFile: null, heroPreview: "" };
    case "TOGGLE_PREVIEW":
      return { ...state, showPreview: action.open };
    case "STEP":
      return { ...state, step: action.step };
    case "SET_SLUG":
      return { ...state, slug: ensureSlug(action.value), slugTouched: true };
    case "TOGGLE_LOCK": {
      const lock = action.value;
      if (!lock) {
        return {
          ...state,
          lockSlug: false,
          slugTouched: false,
          slug: ensureSlug(state.title),
        };
      }
      return { ...state, lockSlug: true };
    }
    case "AUTO_SLUG":
      if (!state.lockSlug && !state.slugTouched) {
        return { ...state, slug: ensureSlug(state.title) };
      }
      return state;
    case "AUTO_READTIME": {
      if (!state.readTimeMin || state.readTimeMin < 1) {
        const txt = blocksToPlainText(state.blocks);
        const est = estimateReadTimeFromText(txt);
        return { ...state, readTimeMin: est };
      }
      return state;
    }
    default:
      return state;
  }
}

/* ---------------------------- exported hook ---------------------------- */
export function useArticleEditorState({ mode, initial, fallbackTeamId = 1 }) {
  const [state, dispatch] = useReducer(
    reducer,
    { mode, initial, fallbackTeamId },
    buildInitialState
  );

  // derived
  const hasContent =
    state.title.trim().length > 0 && blocksToPlainText(state.blocks).length > 0;

  const bodyPreview = useMemo(() => {
    const t = blocksToPlainText(state.blocks);
    return t.length > 220 ? `${t.slice(0, 220)}…` : t;
  }, [state.blocks]);

  // side effects
  useEffect(() => {
    dispatch({ type: "AUTO_SLUG" });
  }, [state.title, state.lockSlug, state.slugTouched]);

  useEffect(() => {
    dispatch({ type: "AUTO_READTIME" });
  }, [state.blocks]);

  // action helpers (nice ergonomics for components)
  const actions = {
    set: (key, value) => dispatch({ type: "SET", key, value }),
    setBlocks: (blocks) => dispatch({ type: "SET_BLOCKS", blocks }),
    setHero: ({ file, dataUrl }) =>
      dispatch({
        type: "SET_HERO",
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
        },
        preview: dataUrl,
      }),
    clearHero: () => dispatch({ type: "CLEAR_HERO" }),
    togglePreview: (open) => dispatch({ type: "TOGGLE_PREVIEW", open }),
    stepTo: (step) => dispatch({ type: "STEP", step }),
    setSlug: (value) => dispatch({ type: "SET_SLUG", value }),
    toggleLock: (value) => dispatch({ type: "TOGGLE_LOCK", value }),
  };

  return { state, actions, bodyPreview, hasContent };
}
