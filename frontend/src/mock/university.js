export const universityProblems = [
  {
    id: "SC-2026-00120",
    title: "Rural Drinking Water Quality Monitoring",
    district: "Ranchi",
    domain: "Water & Sanitation",
    status: "Needs implementation",
    priority: "High",
    affectedPopulation: 1200,
    requiredCapabilities: ["Water Engineering", "Hydrology", "IoT Monitoring", "GIS"],
    progress: 0,
    government: "Ranchi District Administration",
    complexity: "High",
    submittedAt: "12 Mar 2026",
    matchPercentage: 92,
    description: "Rural communities need a reliable, low-cost way to monitor drinking-water quality and availability before shortages become public-health incidents.",
    evidence: ["Water-quality complaints", "Seasonal availability records"],
    duplicateInformation: "No confirmed duplicate; one related water-supply report is under screening.",
    suggestedSolution: "Combine low-cost field sensors, periodic laboratory validation and a GIS-backed alert dashboard.",
    summary: "Develop and pilot a low-cost monitoring approach for rural drinking-water quality and availability."
  },
  {
    id: "SC-2026-00118",
    title: "Crop Disease Early Warning",
    district: "Hazaribagh",
    domain: "Agriculture",
    status: "Needs implementation",
    priority: "High",
    affectedPopulation: 480,
    requiredCapabilities: ["Computer Vision", "Agronomy", "Mobile Advisory"],
    progress: 18,
    government: "Hazaribagh District Administration",
    complexity: "Medium",
    submittedAt: "08 Mar 2026",
    matchPercentage: 88,
    description: "Farmers need early warnings and practical guidance when crop disease indicators appear in the field.",
    evidence: ["Farmer interviews", "Sample crop images"],
    duplicateInformation: "Two related agriculture challenges are being compared for consolidation.",
    suggestedSolution: "Build a mobile computer-vision prototype supported by agronomy review and local-language advisories.",
    summary: "Create an early-warning prototype that helps farmers identify crop disease before major yield loss."
  },
  {
    id: "SC-2026-00111",
    title: "Municipal Waste Route Optimization",
    district: "Dhanbad",
    domain: "Urban Infrastructure",
    status: "Needs implementation",
    priority: "Medium",
    affectedPopulation: 2100,
    requiredCapabilities: ["Data Science", "Route Optimization", "Municipal Operations"],
    progress: 42,
    government: "Dhanbad Municipal Corporation",
    complexity: "Medium",
    submittedAt: "02 Mar 2026",
    matchPercentage: 76,
    description: "Collection routes are inefficient and residents lack visibility into municipal waste-service coverage.",
    evidence: ["Route logs", "Ward-level service complaints"],
    duplicateInformation: "No active duplicate found in the university challenge catalog.",
    suggestedSolution: "Use route optimization, ward-level analytics and a lightweight municipal operations dashboard.",
    summary: "Improve collection routes and service visibility for high-density municipal wards."
  }
];

export const implementedUniversityProblems = [
  {
    id: "SC-2025-0087",
    title: "Low-cost School Accessibility Retrofit",
    district: "Khunti",
    domain: "Accessibility",
    status: "Implemented",
    progress: 100,
    beneficiaries: 130,
    capabilities: ["Universal Design", "Civil Engineering", "Low-cost Fabrication"],
    partners: ["District Administration Khunti", "RuralFab Manufacturing"],
    summary: "Accessibility improvements were implemented across a school campus using low-cost local fabrication."
  },
  {
    id: "SC-2025-0069",
    title: "Community Solar Study for a Rural School",
    district: "Gumla",
    domain: "Energy",
    status: "Implemented",
    progress: 100,
    beneficiaries: 340,
    capabilities: ["Renewable Energy", "Electrical Engineering", "Energy Auditing"],
    partners: ["Gumla District Administration"],
    summary: "A university team completed a feasibility study and implementation support for a school solar system."
  }
];

export const universityProfileSections = [
  { key: "institution", label: "Institution details", weight: 20 },
  { key: "domains", label: "Departments & research domains", weight: 20 },
  { key: "faculty", label: "Faculty & expertise", weight: 15 },
  { key: "labs", label: "Laboratories & facilities", weight: 15 },
  { key: "pastProjects", label: "Already solved problems", weight: 10 },
  { key: "licenses", label: "Licenses / registrations", weight: 5 },
  { key: "certifications", label: "Certifications", weight: 5 },
  { key: "awards", label: "Awards & recognition", weight: 5 },
  { key: "capacity", label: "Student teams & current capacity", weight: 5 }
];

// University workspace seed data. The UI copies these records into localStorage
// when a university user takes an action, so the demo remains stateful without
// introducing a backend or changing the other role workflows.
export const universityProjects = [
  {
    id: "UPRJ-2026-001",
    problemId: "SC-2026-00118",
    title: "Crop Disease Early Warning",
    status: "Active",
    phase: "Team formation",
    progress: 18,
    teamId: "TEAM-U-001",
    milestones: [
      { id: "m1", title: "Confirm field partners and baseline data", status: "In progress", due: "15 Apr 2026" },
      { id: "m2", title: "Build disease image dataset", status: "Not started", due: "30 Apr 2026" },
      { id: "m3", title: "Pilot advisory with farmers", status: "Not started", due: "31 May 2026" }
    ]
  }
];

export const universityTeams = [
  {
    id: "TEAM-U-001",
    name: "Agri Vision Lab",
    lead: "Dr. Meera Singh",
    members: 6,
    capabilities: ["Computer Vision", "Agronomy", "Mobile Advisory"],
    availability: "Available for one more pilot"
  },
  {
    id: "TEAM-U-002",
    name: "Water Systems Studio",
    lead: "Prof. Anil Kumar",
    members: 8,
    capabilities: ["Water Engineering", "IoT Monitoring", "GIS"],
    availability: "Available"
  }
];

export const universityDocuments = {
  pastProjects: [{ name: "Accessibility-retrofit-case-study.pdf", size: 1240000, type: "application/pdf" }],
  licenses: [{ name: "University-registration-certificate.pdf", size: 840000, type: "application/pdf" }],
  certifications: [],
  awards: [],
  researchPapers: [],
  patents: [],
  technologyCapabilities: []
};

export const universityProfile = {
  institution: "University A",
  type: "University / HEI",
  state: "Jharkhand",
  district: "Ranchi",
  email: "admin@university-a.edu.in",
  admin: "Dr. Meera Singh",
  departments: "Water Engineering, Computer Science, Agriculture",
  domains: "Hydrology, AI, GIS, Renewable Energy",
  faculty: "Water systems, computer vision, rural development",
  labs: "IoT and sensor lab, GIS lab, fabrication workshop",
  capacity: "8 multidisciplinary student teams",
  infrastructure: "IoT lab, GIS lab, fabrication workshop, field vehicle",
  technologyCapabilities: "IoT, GIS, computer vision, mobile applications",
  researchAreas: "Water systems, agriculture, civic technology",
  pastProjects: "School accessibility retrofit, rural solar feasibility study",
  certifications: "NAAC accredited",
  awards: "State innovation award",
  licenses: "Institution registration certificate",
  patents: "No patents currently listed"
};
