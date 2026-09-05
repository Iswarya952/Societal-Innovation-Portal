export const mockChallenges = [
  {
    id: "SC-2026-00123", title: "Irregular drinking-water supply",
    domain: "Water & Sanitation", district: "Ranchi", status: "Government Validation",
    priority: "High", affectedPopulation: 420, submittedBy: "USR-C-001",
    visibleTo: ["citizen", "community_organization", "local_body", "government_agency", "university", "startup", "industry", "research_lab"],
    requiredCapabilities: ["Water Engineering", "Hydrology"]
  },
  {
    id: "SC-2026-00124", title: "Rural drinking-water shortage",
    domain: "Water & Sanitation", district: "Ranchi", status: "Government Validation",
    priority: "High", affectedPopulation: 1200,
    visibleTo: ["citizen", "community_organization", "local_body", "government_agency", "university", "startup", "industry", "research_lab"],
    requiredCapabilities: ["Hydrology", "Water Engineering", "IoT Monitoring", "GIS"]
  },
  {
    id: "SC-2026-00125", title: "Crop disease detection",
    domain: "Agriculture", district: "Khunti", status: "Under Review",
    priority: "High", affectedPopulation: 680,
    visibleTo: ["citizen", "community_organization", "local_body", "government_agency", "university", "startup", "industry", "research_lab"],
    requiredCapabilities: ["Computer Vision", "Agriculture", "Mobile AI"]
  },
  {
    id: "SC-2026-00126", title: "Inefficient municipal waste collection",
    domain: "Waste Management", district: "Dhanbad", status: "Validated",
    priority: "Medium", affectedPopulation: 2400,
    visibleTo: ["citizen", "community_organization", "local_body", "government_agency", "university", "startup", "industry", "research_lab"],
    requiredCapabilities: ["Route Optimization", "CivicTech", "Data Analytics"]
  },
  {
    id: "SC-2026-00127", title: "Public infrastructure accessibility",
    domain: "Accessibility", district: "Jamshedpur", status: "Initial Screening",
    priority: "Medium", affectedPopulation: 950,
    visibleTo: ["citizen", "community_organization", "local_body", "government_agency", "university", "industry", "research_lab"],
    requiredCapabilities: ["Universal Design", "Civil Engineering", "Accessibility"]
  }
];
