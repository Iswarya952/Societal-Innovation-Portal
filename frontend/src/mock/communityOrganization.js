export const communityOrganizationProfile = {
  organizationName: "Adivasi Jal Jeevan Collective",
  organizationType: "Community-based organization",
  registrationNumber: "CBO/JH/2021/084",
  district: "Ranchi",
  communitiesServed: "12 villages across Kanke block",
  focusAreas: "Water access, livelihoods, women's leadership",
  contactPerson: "Sanjay Oraon",
  email: "community@example.com",
  phone: "+91 98765 43210",
  website: "",
  description: "A locally governed organization supporting village-led improvements and connecting community evidence with public services.",
  documents: {
    registration: [{ name: "CBO registration certificate.pdf", type: "application/pdf", size: 182000 }],
    authorization: [],
    impact: [{ name: "2024 community impact brief.pdf", type: "application/pdf", size: 246000 }]
  }
};

export const communityOrganizationProfileSections = [
  { key: "organizationName", label: "Organization identity", weight: 20 },
  { key: "registrationNumber", label: "Registration details", weight: 15 },
  { key: "district", label: "Location and communities served", weight: 15 },
  { key: "focusAreas", label: "Focus areas", weight: 15 },
  { key: "contactPerson", label: "Authorized contact", weight: 15 },
  { key: "description", label: "Community context", weight: 10 },
  { key: "documents", label: "Verification documents", weight: 10 }
];

export const communityOrganizationChallenges = [
  {
    id: "CO-2026-001",
    title: "Safe drinking water for summer months",
    description: "Several hamlets rely on a seasonal stream when handpumps run dry. The organization has mapped households and wants a durable, community-managed water plan.",
    domain: "Water & Sanitation",
    district: "Ranchi",
    locality: "Kanke block · 12 villages",
    priority: "High",
    status: "Under Review",
    affectedPopulation: 1800,
    submittedBy: "USR-CO-001",
    createdAt: "2026-08-14T09:30:00.000Z",
    communityContext: "Women and older residents spend up to two hours collecting water during April–June.",
    existingAttempts: "Two handpump repairs and a written request to the block office in 2025.",
    contacts: "Sanjay Oraon · community@example.com · +91 98765 43210",
    evidence: ["Village water map", "Attendance sheet from gram sabha"],
    mediaCount: 2,
    media: [],
    documents: [],
    visibleTo: ["community_organization", "citizen", "local_body", "government_agency", "university", "startup", "industry", "research_lab"],
    requiredCapabilities: ["Water Engineering", "Hydrology", "Community Operations"]
  },
  {
    id: "CO-2026-002",
    title: "Market access for women producers",
    description: "Women-led producer groups make lac and forest products but lose value to fragmented transport and limited market information.",
    domain: "Livelihoods",
    district: "Khunti",
    locality: "Murhu cluster",
    priority: "Medium",
    status: "Implementation",
    affectedPopulation: 420,
    submittedBy: "USR-CO-001",
    createdAt: "2026-05-22T10:00:00.000Z",
    communityContext: "Four producer groups requested a shared order and logistics channel.",
    existingAttempts: "A monthly haat pilot ran for three months with volunteer transport.",
    contacts: "Sanjay Oraon · community@example.com · +91 98765 43210",
    evidence: ["Producer group register"],
    mediaCount: 1,
    media: [],
    documents: [],
    visibleTo: ["community_organization", "citizen", "local_body", "government_agency", "university", "startup"],
    requiredCapabilities: ["Market Linkages", "Digital Platforms", "Field Operations"]
  },
  {
    id: "CO-2025-014",
    title: "Community nutrition garden network",
    description: "A network of kitchen gardens is supplying fresh vegetables to anganwadi centres and is ready to document outcomes for scale.",
    domain: "Health & Nutrition",
    district: "Ranchi",
    locality: "Ormanjhi block",
    priority: "Low",
    status: "Resolved",
    affectedPopulation: 260,
    submittedBy: "USR-CO-001",
    createdAt: "2025-11-04T10:00:00.000Z",
    communityContext: "Caregivers and anganwadi workers co-designed the crop calendar.",
    existingAttempts: "Six demonstration gardens were supported by the organization.",
    contacts: "Sanjay Oraon · community@example.com · +91 98765 43210",
    evidence: ["Nutrition monitoring summary", "Garden photo log"],
    mediaCount: 3,
    media: [],
    documents: [],
    visibleTo: ["community_organization", "citizen", "government_agency", "university", "startup"],
    requiredCapabilities: ["Public Health", "Agriculture", "Community Operations"]
  }
];

export const communityOrganizationCollaborations = [
  { id: "COL-001", challengeId: "CO-2026-001", title: "Water resilience field study", partner: "Birsa Institute of Technology", type: "University", status: "Exploring", updatedAt: "2026-08-28", nextStep: "Joint baseline visit on 12 Sep" },
  { id: "COL-002", challengeId: "CO-2026-002", title: "Producer logistics pilot", partner: "MandiLink Technologies", type: "Startup", status: "Active", updatedAt: "2026-08-18", nextStep: "Review pilot order data" },
  { id: "COL-003", challengeId: "CO-2025-014", title: "Nutrition outcomes review", partner: "District Health Society", type: "Government", status: "Completed", updatedAt: "2026-03-11", nextStep: "Impact note archived" }
];

export const communityOrganizationNotifications = [
  { id: "CON-001", title: "A university requested a field conversation", body: "Birsa Institute of Technology would like to discuss the safe drinking water challenge.", createdAt: "2026-08-28T08:00:00.000Z", unread: true },
  { id: "CON-002", title: "Your challenge is under review", body: "The water access submission is being checked for completeness and jurisdiction.", createdAt: "2026-08-15T08:00:00.000Z", unread: false },
  { id: "CON-003", title: "Implementation update requested", body: "Please add the latest producer logistics pilot order data when available.", createdAt: "2026-08-18T08:00:00.000Z", unread: true }
];

export const communityOrganizationLifecycle = ["Submitted", "Under Review", "Validated", "Collaboration", "Implementation", "Resolved"];
