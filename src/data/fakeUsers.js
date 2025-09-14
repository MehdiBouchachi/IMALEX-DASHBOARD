// ────────────────────────────────────────────────────────────────────────────
// Teams catalog (keep aligned with your Teams table)
// ────────────────────────────────────────────────────────────────────────────
export const TEAM_SLUGS = [
  "cosmetics",
  "animal-nutrition",
  "biopesticides",
  "food-supplements", // ← renamed from nutraceuticals
  "agri-food",
];

const T = (team) => ({ team });

// ────────────────────────────────────────────────────────────────────────────
// Helpers (dates/scopes only; avatars are direct URLs now)
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
export const fakeUsers = [
  // GLOBAL
  {
    id: "u-admin",
    displayName: "Imalex Admin",
    email: "admin@imalex.com",
    phone: "+213700000001",
    avatar:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "admin", scope: "global" }],
    teams: TEAM_SLUGS,
    createdAt: "2025-07-01T09:30:00Z",
    status: "active",
  },
  {
    id: "u-mgr-01",
    displayName: "Sara Benali",
    email: "sara.benali@imalex.com",
    phone: "+213700000010",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [
      { role: "manager", scope: "global" },
      { role: "reviewer", scope: T("cosmetics") },
    ],
    teams: ["cosmetics", "agri-food", "food-supplements"],
    createdAt: "2025-07-03T14:05:00Z",
    status: "active",
  },
  {
    id: "u-mgr-02",
    displayName: "Yacine Aït Kaci",
    email: "yacine.kaci@imalex.com",
    phone: "+213700000011",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "manager", scope: "global" }],
    teams: ["animal-nutrition", "biopesticides"],
    createdAt: "2025-07-04T08:22:00Z",
    status: "active",
  },

  // COSMETICS
  {
    id: "u-head-cos-01",
    displayName: "Lina Cherif",
    email: "lina.cherif@imalex.com",
    phone: "+213700000020",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [
      { role: "headSector", scope: T("cosmetics") },
      { role: "editor", scope: T("animal-nutrition") },
    ],
    teams: ["cosmetics", "animal-nutrition"],
    createdAt: "2025-07-05T10:00:00Z",
    status: "active",
  },
  {
    id: "u-head-cos-02",
    displayName: "Nassim Belkacem",
    email: "nassim.belkacem@imalex.com",
    phone: "+213700000021",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "headSector", scope: T("cosmetics") }],
    teams: ["cosmetics"],
    createdAt: "2025-07-05T10:02:00Z",
    status: "active",
  },
  {
    id: "u-ed-cos-01",
    displayName: "Meriem K.",
    email: "meriem.k@imalex.com",
    phone: "+213700000022",
    avatar:
      "https://images.unsplash.com/photo-1543012115-ec16fc88e7b3?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "editor", scope: T("cosmetics") }],
    teams: ["cosmetics"],
    createdAt: "2025-07-06T09:15:00Z",
    status: "active",
  },
  {
    id: "u-rev-cos-01",
    displayName: "Omar Touati",
    email: "omar.touati@imalex.com",
    phone: "+213700000023",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "reviewer", scope: T("cosmetics") }],
    teams: ["cosmetics"],
    createdAt: "2025-07-06T09:20:00Z",
    status: "active",
  },

  // ANIMAL NUTRITION
  {
    id: "u-head-an-01",
    displayName: "Walid Saadi",
    email: "walid.saadi@imalex.com",
    phone: "+213700000030",
    avatar:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [
      { role: "headSector", scope: T("animal-nutrition") },
      { role: "reviewer", scope: T("agri-food") },
    ],
    teams: ["animal-nutrition", "agri-food"],
    createdAt: "2025-07-07T11:00:00Z",
    status: "active",
  },
  {
    id: "u-ed-an-01",
    displayName: "Ikram Haddad",
    email: "ikram.haddad@imalex.com",
    phone: "+213700000031",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "editor", scope: T("animal-nutrition") }],
    teams: ["animal-nutrition"],
    createdAt: "2025-07-08T13:45:00Z",
    status: "active",
  },
  {
    id: "u-rev-an-01",
    displayName: "Brahim Loucif",
    email: "brahim.loucif@imalex.com",
    phone: "+213700000032",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "reviewer", scope: T("animal-nutrition") }],
    teams: ["animal-nutrition"],
    createdAt: "2025-07-08T13:50:00Z",
    status: "active",
  },

  // BIOPESTICIDES
  {
    id: "u-head-bio-01",
    displayName: "Amina Ziani",
    email: "amina.ziani@imalex.com",
    phone: "+213700000040",
    avatar:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "headSector", scope: T("biopesticides") }],
    teams: ["biopesticides"],
    createdAt: "2025-07-09T08:05:00Z",
    status: "active",
  },
  {
    id: "u-ed-bio-01",
    displayName: "Hichem B.",
    email: "hichem.b@imalex.com",
    phone: "+213700000041",
    avatar:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "editor", scope: T("biopesticides") }],
    teams: ["biopesticides"],
    createdAt: "2025-07-09T08:10:00Z",
    status: "active",
  },
  {
    id: "u-rev-bio-01",
    displayName: "Sofia Meziane",
    email: "sofia.meziane@imalex.com",
    phone: "+213700000042",
    avatar:
      "https://images.unsplash.com/photo-1548946526-f69e2424cf45?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [
      { role: "reviewer", scope: T("biopesticides") },
      { role: "editor", scope: T("food-supplements") },
    ],
    teams: ["biopesticides", "food-supplements"],
    createdAt: "2025-07-09T08:12:00Z",
    status: "active",
  },

  // FOOD SUPPLEMENTS
  {
    id: "u-head-nutra-01",
    displayName: "Khaled M.",
    email: "khaled.m@imalex.com",
    phone: "+213700000050",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "headSector", scope: T("food-supplements") }],
    teams: ["food-supplements"],
    createdAt: "2025-07-10T15:12:00Z",
    status: "active",
  },
  {
    id: "u-ed-nutra-01",
    displayName: "Rania Ferkous",
    email: "rania.ferkous@imalex.com",
    phone: "+213700000051",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "editor", scope: T("food-supplements") }],
    teams: ["food-supplements"],
    createdAt: "2025-07-10T15:20:00Z",
    status: "active",
  },

  // AGRI-FOOD
  {
    id: "u-head-agri-01",
    displayName: "Noureddine Guermoud",
    email: "noureddine.guermoud@imalex.com",
    phone: "+213700000060",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "headSector", scope: T("agri-food") }],
    teams: ["agri-food"],
    createdAt: "2025-07-11T09:05:00Z",
    status: "active",
  },
  {
    id: "u-ed-agri-01",
    displayName: "Salma D.",
    email: "salma.d@imalex.com",
    phone: "+213700000061",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop&crop=faces&auto=format",
    roles: [{ role: "editor", scope: T("agri-food") }],
    teams: ["agri-food"],
    createdAt: "2025-07-11T09:12:00Z",
    status: "active",
  },
];
