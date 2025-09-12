// src/features/briefs/fakeBriefs.js
// Requests ("briefs") tied to clients via clientId

export const PROJECT_STAGES = ["idea", "early_rnd", "in_production"];

export const NEEDS = [
  "custom_formulation",
  "prototype",
  "stability_and_efficacy",
  "research_and_innovation",
  "regulatory_analysis",
  "other",
];

export const BRIEF_STATUS = [
  // lifecycle you asked for
  "request_submitted",
  "awaiting_call",
  "estimating", // proposal / cost estimation in progress
  "awaiting_validation", // waiting for client's OK
  "in_progress", // formulation in progress
  "finalized",
];

export const fakeBriefs = [
  {
    id: "b-1001",
    code: "BRF-2025-1001",
    clientId: "c-ima",
    title: "Natural shampoo base with mild preservation",
    sector: "natural_cosmetics",
    stage: "idea",
    needs: [
      "custom_formulation",
      "stability_and_efficacy",
      "regulatory_analysis",
    ],
    brief:
      "SLS-free mild shampoo base, plant-derived emulsifiers, clear marketing claims backed by CoA. EU market.",
    status: "in_progress",
    createdAt: "2025-07-01T10:00:00.000Z",
    acceptedAt: "2025-07-02T09:00:00.000Z",
    proposalDueAt: "2025-07-03T18:00:00.000Z",
    validatedAt: "2025-07-04T10:00:00.000Z",
    startedAt: "2025-07-05T09:30:00.000Z",
    finishedAt: null,
    estimate: { currency: "DZD", min: 120000, max: 180000 },
    assignedTeam: "cosmetics",
    notes: "Risk: packaging UV transmission. Add photostability task.",
    attachments: [],
  },

  {
    id: "b-1002",
    code: "BRF-2025-1002",
    clientId: "c-lina",
    title: "Preservation framework for leave-on cream",
    sector: "natural_cosmetics",
    stage: "early_rnd",
    needs: ["stability_and_efficacy", "regulatory_analysis"],
    brief:
      "Define microbiome-friendly system with real challenge tests; prepare dossier outline.",
    status: "awaiting_validation",
    createdAt: "2025-06-12T08:10:00.000Z",
    acceptedAt: "2025-06-13T09:00:00.000Z",
    proposalDueAt: "2025-06-14T12:00:00.000Z",
    validatedAt: null,
    startedAt: null,
    finishedAt: null,
    estimate: { currency: "DZD", min: 80000, max: 120000 },
    assignedTeam: "cosmetics",
    notes: "Client prefers two rounds of iterations.",
    attachments: [],
  },

  {
    id: "b-1003",
    code: "BRF-2025-1003",
    clientId: "c-nutra",
    title: "Electrolyte powder—clean label",
    sector: "food_supplements",
    stage: "idea",
    needs: ["prototype", "stability_and_efficacy"],
    brief:
      "Hydration mix with natural flavors; avoid synthetic sweeteners. GCC market.",
    status: "estimating",
    createdAt: "2025-07-05T08:10:00.000Z",
    acceptedAt: "2025-07-05T16:00:00.000Z",
    proposalDueAt: "2025-07-07T12:00:00.000Z",
    validatedAt: null,
    startedAt: null,
    finishedAt: null,
    estimate: { currency: "DZD", min: 150000, max: 220000 },
    assignedTeam: "food-supplements",
    notes: "Check permitted flavorings list for target region.",
    attachments: [],
  },

  {
    id: "b-1004",
    code: "BRF-2025-1004",
    clientId: "c-prot",
    title: "Protein stability screening mini-panel",
    sector: "animal_nutrition",
    stage: "early_rnd",
    needs: ["research_and_innovation", "stability_and_efficacy"],
    brief:
      "Buffer/temperature matrix; rapid flags for turbidity and color. Bench only.",
    status: "finalized",
    createdAt: "2025-07-22T10:40:00.000Z",
    acceptedAt: "2025-07-22T14:00:00.000Z",
    proposalDueAt: "2025-07-23T12:00:00.000Z",
    validatedAt: "2025-07-23T16:30:00.000Z",
    startedAt: "2025-07-24T09:00:00.000Z",
    finishedAt: "2025-07-29T18:00:00.000Z",
    estimate: { currency: "DZD", min: 60000, max: 90000 },
    assignedTeam: "animal-nutrition",
    notes: "Delivered short SOP + template CSV.",
    attachments: [
      {
        name: "screening-results.csv",
        url: "#",
        bytes: 42137,
      },
    ],
  },

  {
    id: "b-1005",
    code: "BRF-2025-1005",
    clientId: "c-ops",
    title: "Micro-dosage QA counters (pre-robot)",
    sector: "agri_food",
    stage: "in_production",
    needs: ["research_and_innovation", "other"],
    brief:
      "Barcode counters + weekly accuracy checks before buying a robot; define metrics.",
    status: "awaiting_call",
    createdAt: "2025-05-25T10:10:00.000Z",
    acceptedAt: null,
    proposalDueAt: null,
    validatedAt: null,
    startedAt: null,
    finishedAt: null,
    estimate: { currency: "DZD", min: 40000, max: 70000 },
    assignedTeam: "agri-food",
    notes: "Wants a quick intro call next week.",
    attachments: [],
  },

  {
    id: "b-1006",
    code: "BRF-2025-1006",
    clientId: "c-legal",
    title: "Lightweight regulatory dossier (cosmetics)",
    sector: "natural_cosmetics",
    stage: "in_production",
    needs: ["regulatory_analysis"],
    brief:
      "Collect once, reuse across SKUs; versioned PDFs with signer and hash.",
    status: "request_submitted",
    createdAt: "2025-07-30T09:05:00.000Z",
    acceptedAt: null,
    proposalDueAt: null,
    validatedAt: null,
    startedAt: null,
    finishedAt: null,
    estimate: { currency: "DZD", min: 50000, max: 90000 },
    assignedTeam: "cosmetics",
    notes: "",
    attachments: [],
  },
];

export const sampleBrief = fakeBriefs[0];
