// src/features/clients/fakeClients.js
// Minimal, normalized clients used by briefs (requests)

export const SECTORS = [
  "natural_cosmetics",
  "food_supplements",
  "biofertilizers_biopesticides",
  "animal_nutrition",
  "agri_food",
];

export const fakeClients = [
  {
    id: "c-ima",
    googleId: "g-ima", // can be null if not using Google sign-in yet
    name: "IMALEX Lab",
    company: "IMALEX",
    email: "contact.imalex.dz@gmail.com",
    phone: "+213 000 000 000",
    avatarUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&h=128&fit=crop",
    country: "Algeria",
    city: "Algiers",
    sector: "natural_cosmetics",
    createdAt: "2025-06-20T09:05:00.000Z",
    lastActiveAt: "2025-08-03T17:30:00.000Z",
    notes: "Prefers WhatsApp for quick updates.",
  },

  {
    id: "c-lina",
    googleId: null,
    name: "Dr. Lina Saada",
    company: "Freelance Formulator",
    email: "lina.saada@example.com",
    phone: "+213 555 000 111",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
    country: "Algeria",
    city: "Blida",
    sector: "natural_cosmetics",
    createdAt: "2025-06-12T08:00:00.000Z",
    lastActiveAt: "2025-07-29T09:00:00.000Z",
    notes: "Needs help with dossiers.",
  },

  {
    id: "c-ops",
    googleId: "g-ops",
    name: "Ops Team",
    company: "GreenOps",
    email: "ops@example.com",
    phone: "+213 552 120 438",
    avatarUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=128&h=128&fit=crop",
    country: "Algeria",
    city: "Oran",
    sector: "agri_food",
    createdAt: "2025-05-25T10:00:00.000Z",
    lastActiveAt: "2025-08-03T17:30:00.000Z",
  },

  {
    id: "c-nutra",
    googleId: null,
    name: "Anas B.",
    company: "NutraCo",
    email: "anas.b@example.com",
    phone: "+213 662 777 888",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&h=128&fit=crop",
    country: "Algeria",
    city: "Constantine",
    sector: "food_supplements",
    createdAt: "2025-07-05T08:00:00.000Z",
    lastActiveAt: "2025-07-26T13:45:00.000Z",
  },

  {
    id: "c-prot",
    googleId: null,
    name: "QA Team",
    company: "FeedLab",
    email: "qa@feedlab.example",
    phone: "+213 540 010 010",
    avatarUrl:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=128&h=128&fit=crop",
    country: "Algeria",
    city: "Tiaret",
    sector: "animal_nutrition",
    createdAt: "2025-07-22T10:35:00.000Z",
    lastActiveAt: "2025-07-29T09:00:00.000Z",
  },

  {
    id: "c-legal",
    googleId: null,
    name: "Reg Affairs",
    company: "ComplyCo",
    email: "legal@complyco.example",
    phone: "+213 540 222 900",
    avatarUrl:
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?w=128&h=128&fit=crop",
    country: "Algeria",
    city: "Annaba",
    sector: "natural_cosmetics",
    createdAt: "2025-07-30T09:00:00.000Z",
    lastActiveAt: "2025-07-31T08:30:00.000Z",
  },
];

export const sampleClient = fakeClients[0];
