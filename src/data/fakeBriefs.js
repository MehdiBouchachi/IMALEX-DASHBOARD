// src/features/briefs/fakeBriefs.js
// Normalized briefs (requests). Client profile stays in fakeClients.

import { fakeClients, SECTORS } from "./fakeClients";

/* ---------------------------------------------
   Pipeline & vocabulary
--------------------------------------------- */

// Valid stages for a brief (request → formulation → done)
export const BRIEF_STAGES = [
  "request_submitted",
  "awaiting_call",
  "proposal_in_progress",
  "awaiting_validation",
  "formulation_in_progress",
  "finalized",
];

// Alias if other modules expect STAGES
export const STAGES = BRIEF_STAGES;

// Human label helper (optional export)
export const STAGE_LABEL = (s) => (s || "").replaceAll("_", " ");

// Needs come from your public form
export const NEEDS = [
  "custom_formulation",
  "prototype",
  "stability_efficacy_study",
  "research_innovation",
  "regulatory_analysis",
  "other",
];

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

// Embed a lightweight client reference on each brief
function pickClient(id) {
  const c = fakeClients.find((x) => x.id === id);
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    company: c.company,
    email: c.email,
    phone: c.phone,
    avatarUrl: c.avatarUrl,
    country: c.country,
    city: c.city,
    sector: c.sector,
  };
}

/* ---------------------------------------------
   Sample briefs
   - Each brief has: id, clientId, client, sector, stage,
     needs, brief, createdAt, updatedAt
   - NEW: stageHistory[] (optional seed; your stage hook
     will keep appending to this in localStorage)
--------------------------------------------- */

export const fakeBriefs = [
  {
    id: "b-1001",
    clientId: "c-lina",
    client: pickClient("c-lina"),
    sector: "natural_cosmetics",
    stage: "request_submitted",
    needs: ["custom_formulation", "stability_efficacy_study"],
    brief:
      "Moisturizer concept with microbiome-friendly preservative; eco claims OK if backed by data.",
    createdAt: "2025-08-01T09:15:00.000Z",
    updatedAt: "2025-08-01T09:15:00.000Z",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-08-01T09:15:00.000Z",
        by: "ops@imalex",
      },
    ],
  },

  {
    id: "b-1002",
    clientId: "c-ops",
    client: pickClient("c-ops"),
    sector: "agri_food",
    stage: "awaiting_call",
    needs: ["prototype"],
    brief: "Shelf-life extension for cold-chain dips; need quick prototype.",
    createdAt: "2025-07-28T14:30:00.000Z",
    updatedAt: "2025-07-29T10:10:00.000Z",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-07-28T14:30:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "awaiting_call",
        at: "2025-07-29T10:10:00.000Z",
        by: "ops@imalex",
      },
    ],
  },

  {
    id: "b-1003",
    clientId: "c-nutra",
    client: pickClient("c-nutra"),
    sector: "food_supplements",
    stage: "proposal_in_progress",
    needs: ["custom_formulation", "regulatory_analysis"],
    brief:
      "Gummy with iron + C; cost cap required; dossier outline for local market.",
    createdAt: "2025-07-22T11:20:00.000Z",
    updatedAt: "2025-07-30T08:05:00.000Z",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-07-22T11:20:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "awaiting_call",
        at: "2025-07-23T09:00:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "proposal_in_progress",
        at: "2025-07-30T08:05:00.000Z",
        by: "bizdev@imalex",
      },
    ],
  },

  {
    id: "b-1004",
    clientId: "c-prot",
    client: pickClient("c-prot"),
    sector: "animal_nutrition",
    stage: "awaiting_validation",
    needs: ["stability_efficacy_study", "other"],
    brief:
      "Protein stability screen; confirm buffer panel & incubation windows.",
    createdAt: "2025-07-21T10:10:00.000Z",
    updatedAt: "2025-07-31T12:40:00.000Z",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-07-21T10:10:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "awaiting_call",
        at: "2025-07-22T12:00:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "proposal_in_progress",
        at: "2025-07-25T15:45:00.000Z",
        by: "bizdev@imalex",
      },
      {
        stage: "awaiting_validation",
        at: "2025-07-31T12:40:00.000Z",
        by: "client@acme",
      },
    ],
  },

  {
    id: "b-1005",
    clientId: "c-ima",
    client: pickClient("c-ima"),
    sector: "natural_cosmetics",
    stage: "formulation_in_progress",
    needs: ["custom_formulation", "prototype"],
    brief: "Serum with plant antioxidants; keep INCI list short.",
    createdAt: "2025-06-25T09:00:00.000Z",
    updatedAt: "2025-08-02T16:30:00.000Z",
    formulation_state: "in_progress",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-06-25T09:00:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "awaiting_call",
        at: "2025-06-27T09:30:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "proposal_in_progress",
        at: "2025-07-02T14:20:00.000Z",
        by: "bizdev@imalex",
      },
      {
        stage: "awaiting_validation",
        at: "2025-07-20T10:05:00.000Z",
        by: "client@imalex",
      },
      {
        stage: "formulation_in_progress",
        at: "2025-08-02T16:30:00.000Z",
        by: "rd@imalex",
      },
    ],
  },

  {
    id: "b-1006",
    clientId: "c-ops",
    client: pickClient("c-ops"),
    sector: "agri_food",
    stage: "finalized",
    needs: ["regulatory_analysis"],
    brief: "Label review + compliance checklist for condiment line.",
    createdAt: "2025-06-10T08:05:00.000Z",
    updatedAt: "2025-07-05T11:45:00.000Z",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-06-10T08:05:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "awaiting_call",
        at: "2025-06-11T10:00:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "proposal_in_progress",
        at: "2025-06-14T09:20:00.000Z",
        by: "bizdev@imalex",
      },
      {
        stage: "awaiting_validation",
        at: "2025-06-20T16:05:00.000Z",
        by: "client@ops",
      },
      {
        stage: "formulation_in_progress",
        at: "2025-06-25T11:10:00.000Z",
        by: "rd@imalex",
      },
      { stage: "finalized", at: "2025-07-05T11:45:00.000Z", by: "rd@imalex" },
    ],
  },

  {
    id: "b-1007",
    clientId: "c-legal",
    client: pickClient("c-legal"),
    sector: "natural_cosmetics",
    stage: "proposal_in_progress",
    needs: ["regulatory_analysis", "other"],
    brief: "Dossier outline + template pack; prefer EU alignment.",
    createdAt: "2025-07-30T10:30:00.000Z",
    updatedAt: "2025-08-01T14:10:00.000Z",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-07-30T10:30:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "awaiting_call",
        at: "2025-07-30T15:00:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "proposal_in_progress",
        at: "2025-08-01T14:10:00.000Z",
        by: "legal@imalex",
      },
    ],
  },

  {
    id: "b-1008",
    clientId: "c-lina",
    client: pickClient("c-lina"),
    sector: "natural_cosmetics",
    stage: "awaiting_call",
    needs: ["prototype"],
    brief: "Small pilot batch with alternate fragrance.",
    createdAt: "2025-08-02T13:30:00.000Z",
    updatedAt: "2025-08-02T13:35:00.000Z",
    stageHistory: [
      {
        stage: "request_submitted",
        at: "2025-08-02T13:30:00.000Z",
        by: "ops@imalex",
      },
      {
        stage: "awaiting_call",
        at: "2025-08-02T13:35:00.000Z",
        by: "ops@imalex",
      },
    ],
  },
];

export const sampleBrief = fakeBriefs[0];
export { SECTORS };
