export const governmentProfile = {
  agencyName: "Department of Drinking Water & Sanitation",
  agencyType: "State department",
  ministry: "Government of Jharkhand",
  registrationNumber: "GOV-JH-DWSD-1964",
  state: "Jharkhand",
  district: "Ranchi",
  jurisdiction: "State-wide policy and district implementation",
  serviceAreas: "Water, sanitation, rural infrastructure and public health",
  officialEmail: "nodal@sahaya.gov.in",
  phone: "+91 651 240 0100",
  website: "https://jharkhand.gov.in",
  representativeName: "Anita Ekka",
  representativeDesignation: "State Nodal Officer",
  representativeEmail: "anita.ekka@sahaya.gov.in",
  representativePhone: "+91 98765 43210",
  mandate: "Coordinate public service delivery, validate societal challenges and commission accountable solutions.",
  departments: "Water & Sanitation, Rural Development, Public Health Engineering",
  documents: {
    registration: [{ name: "Department notification.pdf", type: "application/pdf", size: 284000 }],
    authorization: [{ name: "Nodal officer authorization.pdf", type: "application/pdf", size: 196000 }],
    jurisdiction: [{ name: "State service jurisdiction.pdf", type: "application/pdf", size: 320000 }],
    compliance: []
  }
};

export const governmentProfileSections = [
  { key: "agencyName", label: "Agency identity", weight: 12 },
  { key: "agencyType", label: "Agency type", weight: 7 },
  { key: "ministry", label: "Parent ministry", weight: 7 },
  { key: "registrationNumber", label: "Registration details", weight: 9 },
  { key: "jurisdiction", label: "Jurisdiction", weight: 12 },
  { key: "serviceAreas", label: "Service areas", weight: 10 },
  { key: "representativeName", label: "Authorized representative", weight: 10 },
  { key: "officialEmail", label: "Official contact", weight: 6 },
  { key: "mandate", label: "Statutory mandate", weight: 10 },
  { key: "documents", label: "Verification documents", weight: 7 },
  { key: "departments", label: "Departments / nodal units", weight: 10 }
];

export const governmentLifecycle = [
  "Submitted", "Screening", "Validated", "Prioritized", "Matching",
  "Proposal review", "Project delivery", "Monitoring", "Resolved"
];

export const governmentChallenges = [
  {
    id: "GA-2026-001", title: "Irregular drinking-water supply in rural habitations",
    description: "Multiple habitations report intermittent supply and low pressure during summer. The department needs a reliable monitoring and response model.",
    domain: "Water & Sanitation", district: "Ranchi", locality: "Kanke and Namkum blocks",
    status: "Government Validation", priority: "Critical", affectedPopulation: 4200,
    source: "Citizen and local body reports", submittedAt: "2026-08-25T09:00:00.000Z",
    requiredCapabilities: ["Water Engineering", "IoT Monitoring", "Hydrology"],
    jurisdiction: "State water and sanitation mandate", validationNotes: "Verify source records and identify the accountable district unit.",
    evidence: ["Water quality readings.xlsx", "District inspection note.pdf"]
  },
  {
    id: "GA-2026-002", title: "Crop disease early warning for smallholder farmers",
    description: "Agriculture extension teams need an affordable image-based early warning workflow for crop disease detection.",
    domain: "Agriculture", district: "Khunti", locality: "Khunti district",
    status: "Validated", priority: "High", affectedPopulation: 6800,
    source: "Agriculture department", submittedAt: "2026-08-18T11:15:00.000Z",
    requiredCapabilities: ["Computer Vision", "Agriculture", "Mobile AI"],
    jurisdiction: "State agriculture extension mandate", validationNotes: "Problem statement accepted for capability matching.",
    evidence: ["Extension baseline report.pdf"]
  },
  {
    id: "GA-2026-003", title: "District waste collection route optimisation",
    description: "District towns need route-level visibility to reduce missed collection and roadside dumping.",
    domain: "Waste Management", district: "Dhanbad", locality: "Dhanbad municipal areas",
    status: "Prioritized", priority: "High", affectedPopulation: 24000,
    source: "Local body network", submittedAt: "2026-07-30T08:00:00.000Z",
    requiredCapabilities: ["Route Optimization", "CivicTech", "Data Analytics"],
    jurisdiction: "Urban development coordination", validationNotes: "High population impact and ready data access.",
    evidence: ["Route coverage baseline.csv"]
  },
  {
    id: "GA-2026-004", title: "Accessible public infrastructure audit",
    description: "Create a repeatable audit and remediation plan for accessibility of public facilities.",
    domain: "Accessibility", district: "Jamshedpur", locality: "Public hospitals and schools",
    status: "Matching", priority: "Medium", affectedPopulation: 9500,
    source: "Disability rights partners", submittedAt: "2026-07-12T10:00:00.000Z",
    requiredCapabilities: ["Universal Design", "Civil Engineering", "Accessibility"],
    jurisdiction: "State social welfare coordination", validationNotes: "Matching is open to qualified universities and startups.",
    evidence: ["Accessibility audit template.docx"]
  },
  {
    id: "GA-2026-005", title: "Telemedicine continuity for remote health centres",
    description: "Remote primary health centres require resilient telemedicine and referral connectivity.",
    domain: "Healthcare", district: "Simdega", locality: "Remote PHCs",
    status: "Project delivery", priority: "High", affectedPopulation: 12500,
    source: "Public health department", submittedAt: "2026-06-20T10:00:00.000Z",
    requiredCapabilities: ["Telemedicine", "Connectivity", "Health Systems"],
    jurisdiction: "Public health mission", validationNotes: "Pilot monitoring is active in three facilities.",
    evidence: ["Pilot dashboard export.pdf"]
  }
];

export const governmentProposals = [
  { id: "PROP-2026-014", challengeId: "GA-2026-002", proposer: "Birsa University AI Lab", type: "University", status: "Under review", submittedAt: "2026-08-29", budget: "₹18 lakh", summary: "Mobile crop image model with extension-worker training." },
  { id: "PROP-2026-015", challengeId: "GA-2026-004", proposer: "AccessWorks Foundation", type: "Community organization", status: "Shortlisted", submittedAt: "2026-08-24", budget: "₹9 lakh", summary: "Facility audit toolkit and local accessibility fellows." },
  { id: "PROP-2026-016", challengeId: "GA-2026-005", proposer: "CareLink HealthTech", type: "Startup", status: "Accepted", submittedAt: "2026-06-28", budget: "₹42 lakh", summary: "Connectivity, clinician scheduling and referral monitoring pilot." }
];

export const governmentProjects = [
  { id: "GPROJ-2026-004", challengeId: "GA-2026-005", title: "Connected PHC telemedicine pilot", partner: "CareLink HealthTech", status: "Monitoring", progress: 64, district: "Simdega", targetDate: "2026-12-15", budget: "₹42 lakh", nextMilestone: "Quarterly outcome review" },
  { id: "GPROJ-2026-003", challengeId: "GA-2026-003", title: "Dhanbad smart collection routes", partner: "CivicRoute University Consortium", status: "Implementation", progress: 38, district: "Dhanbad", targetDate: "2027-01-30", budget: "₹26 lakh", nextMilestone: "Deploy ward dashboard" }
];

export const governmentEscalations = [
  { id: "ESC-2026-007", challengeId: "GA-2026-001", title: "District response overdue", severity: "High", owner: "Ranchi district unit", status: "Open", due: "2026-09-08", detail: "Inspection evidence has not been uploaded within the validation SLA." },
  { id: "ESC-2026-004", challengeId: "GA-2026-005", title: "Connectivity variance in pilot sites", severity: "Medium", owner: "CareLink HealthTech", status: "In progress", due: "2026-09-18", detail: "One facility has below-target uptime and needs a remediation plan." }
];

export const governmentNotifications = [
  { id: "GAN-001", title: "Challenge requires validation", body: "GA-2026-001 is waiting for jurisdiction and evidence validation.", createdAt: "2026-08-25T09:05:00.000Z", unread: true },
  { id: "GAN-002", title: "New proposal received", body: "Birsa University AI Lab submitted a proposal for crop disease early warning.", createdAt: "2026-08-29T12:00:00.000Z", unread: true },
  { id: "GAN-003", title: "Monitoring update due", body: "The connected PHC telemedicine pilot has a quarterly outcome review due.", createdAt: "2026-09-01T08:30:00.000Z", unread: false }
];

export const governmentReportTemplates = [
  { key: "portfolio", label: "Challenge portfolio", description: "All challenges by status, district and priority." },
  { key: "impact", label: "Impact and outcomes", description: "Affected population, project progress and resolved outcomes." },
  { key: "partner", label: "Partner pipeline", description: "Proposals, matching activity and accepted partners." },
  { key: "escalations", label: "Escalation register", description: "Open risks, owners, due dates and action status." }
];
