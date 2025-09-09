// src/features/articles/devArticles.js

// Static, schema-aligned sample data (works with AdminPreview & ArticleBody)
export const fakeArticles = [
  {
    id: "a1",
    slug: "natural-formulation-trends-2025",
    title: "Natural Formulation Trends to Watch in 2025",
    excerpt:
      "From plant-based emulsifiers to biodegradable actives—what matters for R&D this year.",
    status: "published", // draft | in_review | changes_requested | approved | published | unpublished | archived
    visibility: "public", // public | team | selected | private
    publishCredit: "team", // team | author
    readTimeMin: 8,
    createdAt: "2025-07-01T10:00:00.000Z",
    publishedAt: "2025-08-01T08:12:00.000Z",
    unpublishedAt: null,
    submittedAt: "2025-07-25T10:00:00.000Z",
    updatedAt: "2025-08-01T08:12:00.000Z",
    tags: ["R&D", "Formulation"],
    team: { id: 5, slug: "agri-food", name: "Agri-Food" },
    author: { id: "u-ima", displayName: "IMALEX Lab" },
    allowedUserIds: [],
    bodyPreview:
      "In 2025, natural formulation is no longer optional—it's table stakes. This deep dive focuses on lab realities, not hype, so your team can ship safer products without losing velocity.",
    hero: {
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
      alt: "Lab glassware with green botanicals",
    },
    bodyBlocks: [
      {
        t: "p",
        x: "In 2025, natural formulation is no longer optional—it's **table stakes**.",
      },
      { t: "h2", x: "Executive summary" },
      {
        t: "ul",
        x: [
          "Bio-based emulsifiers have stable lead times in two regions.",
          "Microbiome-safe preservatives are viable at mass price points.",
          "QC’s best ROI: small automation (labels, `audit logs`, sample tracking).",
          "Sustainability claims must be backed by docs: LCA, CoA, traceability.",
        ],
      },
      { t: "h2", x: "Market drivers (why now)" },
      {
        t: "p",
        x: "Three forces converge: tighter regulation, informed consumers, and volatile petro-derived costs. Brands that ship with _data-backed_ claims win trust.",
      },
      { t: "h3", x: "Regulatory pressure" },
      {
        t: "p",
        x: "Plan documentation-first pipelines where each batch carries digital paperwork from supplier → shelf.",
      },
      { t: "h3", x: "Consumer literacy" },
      {
        t: "p",
        x: "Transparent sourcing stories are **shareable assets** and push demand for plant-derived inputs.",
      },
      { t: "h2", x: "R&D: what works in the lab" },
      { t: "h3", x: "Emulsifiers" },
      {
        t: "ul",
        x: [
          "Sunflower- and sugar-derived blends improved cold-flow vs last year.",
          "Pair sensitive actives with antioxidants; watch pH drift after 4 weeks.",
          "Document shear profiles; replicate rpm/temp windows bench → pilot.",
        ],
      },
      { t: "h3", x: "Preservation" },
      {
        t: "p",
        x: "Microbiome-friendly systems are cost-viable; under-dosing at high water activity caused most failures.",
      },
      { t: "h2", x: "Stability workflow (10-point checklist)" },
      {
        t: "ol",
        x: [
          "Lock target pH and specify meter model + calibration schedule.",
          "Define acceptance windows for viscosity, color, odor, separation.",
          "Record exact cooling profile after hot-mix.",
          "Photostability: test under your packaging’s real UV transmission.",
          "Freeze–thaw at −5/25 °C (≥3 cycles).",
          "Micro: run a reduced challenge for each *major* tweak.",
          "Document every deviation with person / time / lot.",
          "Keep a genealogy: which micro-batch fed which test.",
          "Archive instrument settings (firmware matters).",
          "When in doubt, run a small pilot with full packaging.",
        ],
      },
      {
        t: "callout",
        v: "tip",
        x: "Set up **labels + audit logs** now—retroactive traceability is 10× harder.",
      },
      {
        t: "blockquote",
        x: "If a sustainability claim isn’t backed by a document, it’s a marketing liability waiting to happen.",
        cite: "QA Handbook",
      },
      {
        t: "img",
        src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56",
        alt: "Botanicals around beakers",
        cap: "Plant-derived actives: keep notes on region & seasonality.",
      },
      {
        t: "code",
        x: `# Minimal batch record
BATCH=2025-08-01-ML01
MIXER_RPM=1800
MIX_TIME=14m
COOL_PROFILE="85C->35C over 22m"
PRESERVATIVE="gluconate blend @ 0.9%"
LABELS="lot,batch,expiry,qc-signoff"`,
      },
    ],
  },

  {
    id: "a2",
    slug: "stability-testing-checklist",
    title: "Stability Testing: a 10-Point Checklist for SMEs",
    excerpt:
      "Reduce waste and accelerate launches with a lean, dependable stability workflow.",
    status: "published",
    visibility: "public",
    publishCredit: "author",
    readTimeMin: 5,
    createdAt: "2025-06-20T09:05:00.000Z",
    publishedAt: "2025-07-18T14:42:00.000Z",
    unpublishedAt: null,
    submittedAt: "2025-06-25T09:10:00.000Z",
    updatedAt: "2025-07-18T14:42:00.000Z",
    tags: ["QA", "Process"],
    team: { id: 1, slug: "cosmetics", name: "Cosmetics" },
    author: { id: "u-lina", displayName: "Dr. Lina Saada" },
    allowedUserIds: [],
    bodyPreview:
      "Stability is a system, not a test. Here’s a lean workflow you can run every week.",
    hero: {
      url: "https://images.unsplash.com/photo-1541643600914-78b084683601",
      alt: "Lab notebook and pipette",
    },
    bodyBlocks: [
      {
        t: "p",
        x: "Stability is a **system**, not a single test. This checklist fits small labs.",
      },
      { t: "h2", x: "The weekly loop" },
      {
        t: "ol",
        x: [
          "Batch a small pilot with full packaging.",
          "Run temperature & light challenges in parallel.",
          "Log deviations with labels and `lot` metadata.",
          "Review pH/viscosity trends; flag drift > 5%.",
          "Decide: lock window or iterate.",
        ],
      },
      {
        t: "callout",
        v: "note",
        x: "If you don’t write it, it didn’t happen. Default to *over*-labeling.",
      },
      {
        t: "code",
        x: "SELECT lot, ph, vis FROM qc_trends WHERE drift_pct > 5;",
      },
    ],
  },

  {
    id: "a3",
    slug: "nutraceutical-supply-chains",
    title: "Navigating Nutraceutical Supply Chains in 2025",
    excerpt:
      "Sourcing rare botanicals while keeping costs, quality, and compliance under control.",
    status: "published",
    visibility: "team",
    publishCredit: "team",
    readTimeMin: 7,
    createdAt: "2025-06-28T12:10:00.000Z",
    publishedAt: "2025-07-05T09:10:00.000Z",
    unpublishedAt: null,
    submittedAt: "2025-07-01T13:00:00.000Z",
    updatedAt: "2025-07-05T09:10:00.000Z",
    tags: ["Nutraceuticals"],
    team: { id: 2, slug: "food-supplements", name: "Food supplements" },
    author: { id: "u-supply", displayName: "Supply Team" },
    allowedUserIds: [],
    bodyPreview:
      "Seasonality and regional shocks are normal. The playbook is dual-region coverage and qualified alternates.",
    hero: {
      url: "https://images.unsplash.com/photo-1515165562835-c3b8c8e59382",
      alt: "Warehouse lanes and pallets",
    },
    bodyBlocks: [
      {
        t: "p",
        x: "Resilience starts at sourcing. Carry at least one **qualified alternate** per critical input and keep scorecards on delivery and CoA quality.",
      },
      { t: "h2", x: "Logistics: lane design & cold chain" },
      {
        t: "ul",
        x: [
          "For enzymes/probiotics, validate *thermal loggers* and define max excursion time.",
          "Document re-icing SOPs and who owns the call when temps breach.",
        ],
      },
      {
        t: "img",
        src: "https://images.unsplash.com/photo-1506224477000-564d6f74f9f9",
        alt: "Cold chain transfer",
        cap: "The lane is only as strong as the warmest transfer.",
      },
      {
        t: "callout",
        v: "warn",
        x: "Don’t rely on shipper brochures—**test your packaging** in your lanes.",
      },
    ],
  },

  {
    id: "a4",
    slug: null,
    title: "Biopesticide Field Pilots: Lessons from Semi-Arid Climates",
    excerpt:
      "Key agronomic and regulatory learnings from the 2024–2025 pilot season.",
    status: "in_review",
    visibility: "team",
    publishCredit: "team",
    readTimeMin: 8,
    createdAt: "2025-06-10T08:00:00.000Z",
    publishedAt: null,
    unpublishedAt: null,
    submittedAt: "2025-06-10T09:00:00.000Z",
    updatedAt: "2025-06-15T10:00:00.000Z",
    tags: ["Biopesticides", "Agriculture"],
    team: {
      id: 3,
      slug: "biofertilizers-biopesticides",
      name: "Biofertilizers & Biopesticides",
    },
    author: { id: "u-ima", displayName: "IMALEX Lab" },
    allowedUserIds: [],
    bodyPreview:
      "Semi-arid pilots exposed lane risks and formulation drift. Here’s the field data we trust.",
    hero: null,
    bodyBlocks: [
      {
        t: "p",
        x: "Field pilots showed drift in high UV lanes; anti-oxidant loading needed a bump.",
      },
      {
        t: "blockquote",
        x: "Hot truck decks ruined more samples than any lab error.",
        cite: "Ops log",
      },
      {
        t: "h3",
        x: "What changed for 2025",
        flagged: true,
        flagComment: "Tie each bullet to a dataset or field note (date/site).",
      },
      {
        t: "ul",
        x: [
          "Reflective liners by default",
          "Shorter hops, more hubs",
          "Sealed QC packs at handoff",
        ],
      },
    ],
  },

  {
    id: "a5",
    slug: null,
    title: "Lab Automation: Small Changes with Big Impact",
    excerpt:
      "Incremental automation in QC labs improves throughput and data reliability.",
    status: "draft",
    visibility: "private",
    publishCredit: "author",
    readTimeMin: 4,
    createdAt: "2025-05-28T10:00:00.000Z",
    publishedAt: null,
    unpublishedAt: null,
    submittedAt: null,
    updatedAt: "2025-06-02T11:10:00.000Z",
    tags: ["Lab", "Automation"],
    team: { id: 5, slug: "agri-food", name: "Agri-Food" },
    author: { id: "u-ima", displayName: "IMALEX Lab" },
    allowedUserIds: [],
    bodyPreview:
      "Barcode labels, simple scanners, and shared dashboards pay for themselves in a month.",
    hero: null,
    bodyBlocks: [
      {
        t: "p",
        x: "Start with **labels** and a shared dashboard; don’t buy a robot to fix a spreadsheet.",
      },
      {
        t: "callout",
        v: "tip",
        x: "Put `lot`, `operator`, and `step` on every label.",
      },
      { t: "code", x: "PRINT LOT={{lot}}; USER={{user}}; STEP={{step}};" },
    ],
  },

  {
    id: "a6",
    slug: "cosmetic-active-sourcing",
    title: "Sourcing Cosmetic Actives Responsibly",
    excerpt:
      "Balance innovation, sustainability, and cost when selecting actives for new lines.",
    status: "published",
    visibility: "selected",
    publishCredit: "author",
    readTimeMin: 5,
    createdAt: "2025-05-15T16:02:00.000Z",
    publishedAt: "2025-06-01T10:00:00.000Z",
    unpublishedAt: null,
    submittedAt: "2025-05-25T09:00:00.000Z",
    updatedAt: "2025-06-03T10:00:00.000Z",
    tags: ["Cosmetics", "Sourcing"],
    team: { id: 1, slug: "cosmetics", name: "Cosmetics" },
    author: { id: "u-lina", displayName: "Dr. Lina Saada" },
    allowedUserIds: ["u-ops", "u-qc"], // only these can view in the admin if you enforce it
    bodyPreview:
      "Supplier method sheets are not enough—request pilot CoAs and cross-region fallbacks.",
    hero: {
      url: "https://images.unsplash.com/photo-1548865167-0b3b2ee9c36f",
      alt: "Cosmetic actives arrangement",
    },
    bodyBlocks: [
      {
        t: "p",
        x: "Ask for **pilot CoAs** and split-by-region fallback plans before PO.",
      },
      { t: "h3", x: "What to request" },
      {
        t: "ul",
        x: [
          "Accelerated stability data",
          "Method sheet + validation notes",
          "Impurity profile over time",
        ],
      },
      {
        t: "callout",
        v: "danger",
        x: "Never approve an active without method validation in your lab context.",
      },
    ],
  },

  /* ------------------ NEW STATES BELOW ------------------ */

  {
    id: "a7",
    slug: "protein-stability-screening",
    title: "Protein Stability Screening: Practical Lab Patterns",
    excerpt:
      "What actually works for small teams: buffers, temps, and rapid flags.",
    status: "approved",
    visibility: "public",
    publishCredit: "team",
    readTimeMin: 6,
    createdAt: "2025-07-22T10:35:00.000Z",
    publishedAt: null,
    unpublishedAt: null,
    submittedAt: "2025-07-22T11:00:00.000Z",
    updatedAt: "2025-07-29T09:00:00.000Z",
    tags: ["QC", "Protein"],
    team: { id: 4, slug: "animal-nutrition", name: "Animal Nutrition" },
    author: { id: "u-prot", displayName: "QA Team" },
    allowedUserIds: [],
    bodyPreview:
      "Screening patterns you can replicate on a single bench without new gear.",
    hero: null,
    bodyBlocks: [
      {
        t: "p",
        x: "Start with a standardized **buffer panel** and lock incubation windows.",
      },
      {
        t: "ul",
        x: ["3 temps, 2 buffers", "Log turbidity + color", "Freeze–thaw 3×"],
      },
    ],
  },

  /* ===== CHANGES REQUESTED with per-block comments ===== */
  {
    id: "a8",
    slug: "bioplastic-additives-2025",
    title: "Bioplastic Additives 2025: Performance vs. Cost",
    excerpt: "Balancing shelf life claims with realistic supply chains.",
    status: "changes_requested",
    visibility: "team",
    publishCredit: "author",
    readTimeMin: 5,
    createdAt: "2025-07-05T08:00:00.000Z",
    publishedAt: null,
    unpublishedAt: null,
    submittedAt: "2025-07-06T08:30:00.000Z",
    updatedAt: "2025-07-26T13:45:00.000Z",
    tags: ["Sustainability"],
    team: { id: 5, slug: "agri-food", name: "Agri-Food" },
    author: { id: "u-ana", displayName: "Anas B." },
    allowedUserIds: [],
    bodyPreview: "Where bioplastics help—and where they don't—at real volumes.",
    hero: null,
    bodyBlocks: [
      {
        t: "p",
        x: "Request **lane tests** early; brochure numbers rarely match field data.",
        flagged: true,
        flagComment:
          "Give one concrete lane test example with temps & duration (e.g., 25 °C/40 °C for 2 weeks) and packaging thickness.",
      },
      {
        t: "h2",
        x: "Test setup",
        flagged: true,
        flagComment:
          "Add ambient vs elevated temperature ranges and specify packaging gauge (µm) for each run.",
      },
      {
        t: "callout",
        v: "note",
        x: "Reviewer: clarify test temperatures and packaging thickness.",
        flagged: true,
        flagComment:
          "Replace with exact numbers and move the reviewer note into the text. Cite data source if available.",
      },
    ],
  },

  {
    id: "a9",
    slug: "micro-dosage-automation",
    title: "Micro-Dosage Automation on a Shoestring",
    excerpt: "Simple jigs and QA counters before buying a robot.",
    status: "unpublished",
    visibility: "public",
    publishCredit: "team",
    readTimeMin: 4,
    createdAt: "2025-05-25T10:00:00.000Z",
    publishedAt: "2025-06-10T09:00:00.000Z",
    unpublishedAt: "2025-08-03T17:30:00.000Z",
    submittedAt: "2025-06-01T09:00:00.000Z",
    updatedAt: "2025-08-03T17:30:00.000Z",
    tags: ["Automation"],
    team: { id: 5, slug: "agri-food", name: "Agri-Food" },
    author: { id: "u-ops", displayName: "Ops Team" },
    allowedUserIds: [],
    bodyPreview: "Track accuracy with barcode counters and CSV audits first.",
    hero: null,
    bodyBlocks: [
      {
        t: "p",
        x: "Use **scales + counters** with barcodes; run 100-cycle accuracy checks weekly.",
      },
    ],
  },

  {
    id: "a10",
    slug: "regulatory-dossier-lightweight",
    title: "A Lightweight Regulatory Dossier that Scales",
    excerpt: "Collect once, reuse across SKUs—without a full QMS migration.",
    status: "in_review",
    visibility: "selected",
    publishCredit: "author",
    readTimeMin: 7,
    createdAt: "2025-07-30T09:00:00.000Z",
    publishedAt: null,
    unpublishedAt: null,
    submittedAt: "2025-07-30T10:00:00.000Z",
    updatedAt: "2025-07-31T08:30:00.000Z",
    tags: ["Documentation", "Compliance"],
    team: { id: 1, slug: "cosmetics", name: "Cosmetics" },
    author: { id: "u-lina", displayName: "Dr. Lina Saada" },
    allowedUserIds: ["u-qa", "u-legal"],
    bodyPreview: "Templates and field names that survive audits.",
    hero: null,
    bodyBlocks: [
      {
        t: "p",
        x: "Centralize **CoA, SDS, LCA**. Keep versioned PDFs with signer and hash.",
      },
    ],
  },

  {
    id: "a11",
    slug: "green-preservatives-myths",
    title: "Green Preservatives: Myths vs. Lab Reality",
    excerpt: "What survived challenge tests—and what failed repeatedly.",
    status: "approved",
    visibility: "team",
    publishCredit: "team",
    readTimeMin: 6,
    createdAt: "2025-06-12T08:00:00.000Z",
    publishedAt: null,
    unpublishedAt: null,
    submittedAt: "2025-06-20T08:00:00.000Z",
    updatedAt: "2025-07-01T12:00:00.000Z",
    tags: ["Preservation", "R&D"],
    team: { id: 1, slug: "cosmetics", name: "Cosmetics" },
    author: { id: "u-ima", displayName: "IMALEX Lab" },
    allowedUserIds: [],
    bodyPreview: "Separating marketing claims from datasets in small labs.",
    hero: null,
    bodyBlocks: [
      {
        t: "p",
        x: "Under-dosing at high water activity is the most common failure mode.",
      },
    ],
  },

  {
    id: "a12",
    slug: "sops-2024-archive",
    title: "Legacy SOPs (2019–2024) — Archived Pack",
    excerpt: "Frozen reference set kept for compliance traceability.",
    status: "archived",
    visibility: "private",
    publishCredit: "team",
    readTimeMin: 3,
    createdAt: "2024-12-20T10:00:00.000Z",
    publishedAt: null,
    unpublishedAt: null,
    submittedAt: null,
    updatedAt: "2025-01-05T12:00:00.000Z",
    tags: ["Archive", "Compliance"],
    team: { id: 2, slug: "food-supplements", name: "Food supplements" },
    author: { id: "u-ops", displayName: "Ops Team" },
    allowedUserIds: ["u-qa", "u-legal"],
    bodyPreview: "Read-only package; do not modify.",
    hero: null,
    bodyBlocks: [
      {
        t: "callout",
        v: "note",
        x: "This pack is archived. Replace with current SOPs for live work.",
      },
    ],
  },
];

// Quick grab for demos
export const sampleArticle = fakeArticles[0];
