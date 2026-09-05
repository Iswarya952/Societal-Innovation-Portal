export const startupProblems = [
  { id: "SC-2026-00118", title: "Rural Drinking Water Monitoring", district: "Ranchi", domain: "Water & Sanitation", priority: "High", status: "Needs Implementation", progress: 0, requiredCapabilities: ["IoT Monitoring","Water Sensors","Field Deployment"], authority: "Ranchi District Administration" },
  { id: "SC-2026-00121", title: "Crop Disease Early Warning", district: "Hazaribagh", domain: "Agriculture", priority: "High", status: "Needs Implementation", progress: 25, requiredCapabilities: ["Computer Vision","Agritech","Mobile Advisory"], authority: "Hazaribagh District Administration" },
  { id: "SC-2026-00124", title: "Smart Waste Collection Routing", district: "Dhanbad", domain: "Urban Infrastructure", priority: "Medium", status: "Needs Implementation", progress: 0, requiredCapabilities: ["Route Optimization","Data Platform","Municipal Integration"], authority: "Dhanbad Municipal Corporation" }
];

export const implementedStartupProblems = [
  { id: "SC-2025-0087", title: "Accessible Public Facility Mapping", district: "Khunti", domain: "Accessibility", priority: "Medium", status: "Implemented", progress: 100, requiredCapabilities: ["GIS","Mobile App","Accessibility Mapping"], authority: "Khunti District Administration" }
];

export const startupProfileSections = [
  { key:"organization", label:"Startup details", weight:20 },
  { key:"technology", label:"Technology & products", weight:20 },
  { key:"team", label:"Team expertise", weight:15 },
  { key:"deployment", label:"Deployment capability", weight:15 },
  { key:"documents", label:"Documents", weight:15 },
  { key:"geography", label:"Geographic coverage", weight:10 },
  { key:"verification", label:"Capability verification", weight:5 }
];
