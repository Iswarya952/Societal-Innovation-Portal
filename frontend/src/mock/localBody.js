export const localBodyProfile = {
  authority: "Ranchi Municipal Corporation",
  bodyType: "Municipal Corporation",
  registrationNumber: "RMC/JH/ULB/1869",
  state: "Jharkhand",
  district: "Ranchi",
  jurisdiction: "Ranchi city · 53 wards",
  wards: "1-53",
  officialEmail: "commissioner@ranchimunicipal.gov.in",
  phone: "+91 651 220 0101",
  authorizedOfficer: "Ravi Kumar",
  designation: "Municipal Officer",
  departments: "Water & Sanitation, Roads, Solid Waste, Public Health",
  serviceAreas: "Civic services, public infrastructure and municipal operations",
  mandate: "Coordinate civic services, validate local problems and deliver accountable public responses.",
  website: "https://ranchimunicipal.gov.in",
  documents: {
    registration: [{ name: "ULB establishment order.pdf", type: "application/pdf", size: 284000 }],
    authorization: [{ name: "Authorized officer letter.pdf", type: "application/pdf", size: 196000 }],
    serviceProfile: [],
    compliance: []
  }
};

export const localBodyProfileSections = [
  { key: "authority", label: "Authority identity", weight: 12 },
  { key: "bodyType", label: "Local body type", weight: 8 },
  { key: "registrationNumber", label: "Registration details", weight: 10 },
  { key: "district", label: "Jurisdiction", weight: 12 },
  { key: "wards", label: "Wards / villages covered", weight: 10 },
  { key: "departments", label: "Departments", weight: 12 },
  { key: "serviceAreas", label: "Service areas", weight: 10 },
  { key: "authorizedOfficer", label: "Authorized officer", weight: 10 },
  { key: "officialEmail", label: "Official contact", weight: 6 },
  { key: "mandate", label: "Statutory mandate", weight: 5 },
  { key: "documents", label: "Verification documents", weight: 5 }
];

export const localBodyLifecycle = ["Pending Review", "Prioritized", "Assigned", "Implementation", "Resolved"];

export const localBodyChallenges = [
  {
    id: "LB-2026-001",
    title: "Irregular drinking-water supply in Ward 18",
    description: "Residents report intermittent supply and low pressure across three colonies during the summer months.",
    domain: "Water & Sanitation",
    district: "Ranchi",
    locality: "Ward 18 · Harmu",
    priority: "High",
    status: "Pending Review",
    affectedPopulation: 1200,
    submittedBy: "USR-C-001",
    submittedAt: "2026-08-27T09:00:00.000Z",
    source: "Citizen submission",
    jurisdiction: "Ranchi Municipal Corporation",
    jurisdictionMatch: "Pending validation",
    assignedDepartment: "Water & Sanitation",
    assignedOfficer: "",
    targetDate: "",
    evidence: ["Ward complaint register", "Water supply schedule"],
    validationNotes: "Confirm ward boundary and service-line ownership before routing."
  },
  {
    id: "LB-2026-002",
    title: "Door-to-door waste collection gap",
    description: "Collection vehicles are missing inner lanes in Wards 7 and 8, leading to roadside dumping near the market.",
    domain: "Waste Management",
    district: "Ranchi",
    locality: "Wards 7-8 · Upper Bazaar",
    priority: "High",
    status: "Prioritized",
    affectedPopulation: 2400,
    submittedBy: "USR-CO-001",
    submittedAt: "2026-08-21T10:30:00.000Z",
    source: "Community organization",
    jurisdiction: "Ranchi Municipal Corporation",
    jurisdictionMatch: "Validated",
    assignedDepartment: "Solid Waste Management",
    assignedOfficer: "",
    targetDate: "2026-09-30",
    evidence: ["Collection route map", "Community photo log"],
    validationNotes: "Within municipal service jurisdiction; high health and sanitation impact."
  },
  {
    id: "LB-2026-003",
    title: "Unsafe pedestrian crossing near government school",
    description: "Children cross a high-traffic road without a marked crossing or speed-calming measures.",
    domain: "Roads & Accessibility",
    district: "Ranchi",
    locality: "Ward 32 · Kanke Road",
    priority: "Medium",
    status: "Assigned",
    affectedPopulation: 680,
    submittedBy: "USR-LB-001",
    submittedAt: "2026-08-12T08:15:00.000Z",
    source: "Institutional authority",
    jurisdiction: "Ranchi Municipal Corporation",
    jurisdictionMatch: "Validated",
    assignedDepartment: "Roads & Traffic",
    assignedOfficer: "A. Ekka · Executive Engineer",
    targetDate: "2026-10-15",
    evidence: ["Site inspection note"],
    validationNotes: "Municipal road asset; coordinate with traffic police for enforcement."
  },
  {
    id: "LB-2026-004",
    title: "Community toilet refurbishment and maintenance",
    description: "A public toilet block requires repairs, water connection and a reliable maintenance schedule.",
    domain: "Public Health",
    district: "Ranchi",
    locality: "Ward 11 · Daily Market",
    priority: "Medium",
    status: "Implementation",
    affectedPopulation: 950,
    submittedBy: "USR-LB-001",
    submittedAt: "2026-07-18T11:00:00.000Z",
    source: "Institutional authority",
    jurisdiction: "Ranchi Municipal Corporation",
    jurisdictionMatch: "Validated",
    assignedDepartment: "Public Health",
    assignedOfficer: "N. Kumari · Health Officer",
    targetDate: "2026-09-20",
    evidence: ["Work order", "Before photos"],
    validationNotes: "Work order issued; monthly maintenance owner recorded."
  },
  {
    id: "LB-2026-005",
    title: "Streetlight restoration on Ward 4 access road",
    description: "Eight LED streetlights were repaired and the access road is now safely lit after a joint inspection.",
    domain: "Public Infrastructure",
    district: "Ranchi",
    locality: "Ward 4 · Bariatu",
    priority: "Low",
    status: "Resolved",
    affectedPopulation: 410,
    submittedBy: "USR-LB-001",
    submittedAt: "2026-05-09T14:00:00.000Z",
    source: "Institutional authority",
    jurisdiction: "Ranchi Municipal Corporation",
    jurisdictionMatch: "Validated",
    assignedDepartment: "Electrical Services",
    assignedOfficer: "S. Prasad · Works Supervisor",
    targetDate: "2026-06-01",
    evidence: ["Completion certificate", "After photos"],
    validationNotes: "Resolution verified during site visit on 1 June 2026."
  }
];

export const localBodyNotifications = [
  {
    id: "LBN-001",
    title: "New challenge requires jurisdiction review",
    body: "Irregular drinking-water supply in Ward 18 is waiting for your validation.",
    createdAt: "2026-08-27T09:05:00.000Z",
    unread: true
  },
  {
    id: "LBN-002",
    title: "Assignment due date approaching",
    body: "The Ward 32 pedestrian crossing task is due for an implementation update.",
    createdAt: "2026-08-28T08:20:00.000Z",
    unread: true
  },
  {
    id: "LBN-003",
    title: "Resolution recorded",
    body: "Streetlight restoration on Ward 4 access road has been marked resolved.",
    createdAt: "2026-06-02T10:00:00.000Z",
    unread: false
  }
];

export const localBodyReportTemplates = [
  { label: "Open jurisdiction queue", key: "open" },
  { label: "Priority response report", key: "priority" },
  { label: "Department workload", key: "department" },
  { label: "Resolution and impact report", key: "resolved" }
];
