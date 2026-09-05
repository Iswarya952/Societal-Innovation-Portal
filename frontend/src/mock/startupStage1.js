export const STARTUP_INTERESTS_KEY = "sahaya_startup_interests";

export const startupInterestStatuses = [
  "Interested",
  "Under Review",
  "Shortlisted",
  "Proposal Requested",
  "Selected",
  "Not Selected",
  "Withdrawn"
];

export const startupCapabilities = [
  "IoT Monitoring",
  "Field Deployment",
  "Computer Vision",
  "Agritech",
  "Mobile Advisory",
  "Route Optimization",
  "Data Platform",
  "CivicTech",
  "Data Analytics"
];

export function calculateStartupMatch(challenge) {
  const required = challenge.requiredCapabilities || [];
  const matched = required.filter((capability) => startupCapabilities.some((item) => {
    const left = capability.toLowerCase();
    const right = item.toLowerCase();
    return left === right || left.includes(right) || right.includes(left);
  }));
  const capabilityScore = required.length ? Math.round((matched.length / required.length) * 70) : 35;
  const domainScore = challenge.domain && startupCapabilities.some((item) => challenge.domain.toLowerCase().includes(item.toLowerCase().replace("tech", ""))) ? 15 : 8;
  const deploymentScore = challenge.district ? 10 : 5;
  return Math.min(99, Math.max(25, capabilityScore + domainScore + deploymentScore));
}

export function challengeForStartup(challenges, id) {
  return challenges.find((challenge) => challenge.id === id);
}

export function readStartupInterests() {
  try {
    const interests = JSON.parse(localStorage.getItem(STARTUP_INTERESTS_KEY) || "[]");
    return Array.isArray(interests) ? interests : [];
  } catch {
    return [];
  }
}

export function writeStartupInterests(interests) {
  localStorage.setItem(STARTUP_INTERESTS_KEY, JSON.stringify(interests));
}
