import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "./styles.css";
import { mockUsers } from "./mock/users";
import { mockOrganizations } from "./mock/organizations";
import { mockChallenges } from "./mock/challenges";
import { mockProjects } from "./mock/projects";
import { mockNotifications } from "./mock/notifications";
import { universityProblems, implementedUniversityProblems, universityProfileSections, universityProjects, universityTeams, universityDocuments, universityProfile } from "./mock/university";
import { startupProblems, implementedStartupProblems, startupProfileSections } from "./mock/startup";
import { StartupChallengesPage, StartupChallengeDetails, StartupInterests } from "./startupStage1";
import { IndustryHome, IndustryChallenges, IndustryChallengeDetails, IndustryInterests, IndustryProfile } from "./industryStage1";
import { ResearchLabHome, ResearchLabChallenges, ResearchLabChallengeDetails, ResearchLabInterests, ResearchLabProfile } from "./researchLabStage1";
import { communityOrganizationProfile, communityOrganizationProfileSections, communityOrganizationChallenges, communityOrganizationCollaborations, communityOrganizationNotifications, communityOrganizationLifecycle } from "./mock/communityOrganization";
import { localBodyProfile, localBodyProfileSections, localBodyChallenges, localBodyNotifications, localBodyLifecycle, localBodyReportTemplates } from "./mock/localBody";
import { LocalBodyHome as LocalBodyHomeView, LocalBodyReport as LocalBodyReportView, LocalBodyChallenges as LocalBodyChallengesView, LocalBodyChallengeDetail as LocalBodyChallengeDetailView, LocalBodyReports as LocalBodyReportsView, LocalBodyNotifications as LocalBodyNotificationsView, LocalBodyProfile as LocalBodyProfileView } from "./localBody";
import { GovernmentHome, GovernmentReport, GovernmentChallenges, GovernmentChallengeDetail, GovernmentMatching, GovernmentProposals, GovernmentProjects, GovernmentEscalations, GovernmentReports, GovernmentNotifications, GovernmentProfile } from "./government";

const CITIZEN_WEEKLY_LIMIT = 3;
const CHALLENGE_LIFECYCLE = [
  "Submitted", "Screening", "Government validation", "Resolution pathway",
  "Matching", "Solution development", "Pilot", "Implementation", "Impact"
];

const ROLE_IDS = [
  "citizen", "community_organization", "local_body", "government_agency",
  "university", "startup", "industry", "research_lab"
];
const roleLabels = {
  citizen: "Citizen",
  community_organization: "Community organization",
  local_body: "Local body",
  government_agency: "Government agency",
  university: "University / HEI",
  startup: "Startup",
  industry: "Industry",
  research_lab: "Research lab"
};
const roleRoutes = {
  citizen: "/citizen",
  community_organization: "/community-organization",
  local_body: "/local-body",
  government_agency: "/government",
  university: "/university",
  startup: "/startup",
  industry: "/industry",
  research_lab: "/research-lab"
};
const routeForRole = (role) => roleRoutes[role] || "/login";
const registrationRouteForRole = (role) => role === "local_body" ? "/register/local-body" : role === "government_agency" ? "/register/government-agency" : `/register/${role}`;
const readRegisteredUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem("sahaya_registered_users") || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sahaya_user") || "null");
      return saved && ROLE_IDS.includes(saved.role) ? saved : null;
    } catch {
      return null;
    }
  });

  const loginAs = (role) => {
    if (!ROLE_IDS.includes(role)) return;
    const demoUser = [...readRegisteredUsers(), ...mockUsers].find((u) => u.role === role);
    if (!demoUser) return;
    setUser(demoUser);
    localStorage.setItem("sahaya_user", JSON.stringify(demoUser));
  };

  const login = ({ role, identifier }) => {
    if (!ROLE_IDS.includes(role)) return;
    const normalized = String(identifier || "").trim().toLowerCase();
    const account = [...readRegisteredUsers(), ...mockUsers].find((candidate) => {
      if (candidate.role !== role) return false;
      if (!normalized) return true;
      return [candidate.email, candidate.contact, candidate.mobile, candidate.identifier]
        .filter(Boolean).some((value) => String(value).toLowerCase() === normalized);
    });
    loginAs(account ? account.role : role);
  };

  const registerUser = (role, profile) => {
    if (!ROLE_IDS.includes(role)) return null;
    const { password, ...safeProfile } = profile || {};
    const registered = {
      id: `USR-${role.slice(0, 3).toUpperCase()}-${Date.now()}`,
      role,
      status: "verification_pending",
      ...safeProfile
    };
    const users = readRegisteredUsers().filter((candidate) => candidate.email !== registered.email);
    localStorage.setItem("sahaya_registered_users", JSON.stringify([...users, registered]));
    return registered;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sahaya_user");
  };

  const value = useMemo(() => ({
    user,
    loginAs,
    login,
    registerUser,
    logout,
    data: { mockUsers, mockOrganizations, mockChallenges, mockProjects, mockNotifications }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() { return useContext(AuthContext); }

function RoleGuard({ allowed, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

function AppShell({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role;

  const navItems = role === "citizen"
    ? [
        { label: "Home", path: "/citizen" },
        { label: "Report a Problem", path: "/citizen/report" },
        { label: "Community Challenges", path: "/citizen/challenges" },
        { label: "My Challenges", path: "/citizen/my-challenges" },
        { label: "Notifications", path: "/citizen/notifications" },
        { label: "Profile", path: "/citizen/profile" }
      ]
    : role === "community_organization"
    ? [
        { label: "Overview", path: "/community-organization" },
        { label: "Report a Challenge", path: "/community-organization/report" },
        { label: "Challenges", path: "/community-organization/challenges" },
        { label: "Under Review", path: "/community-organization/under-review" },
        { label: "Implementation", path: "/community-organization/implementation" },
        { label: "Resolved", path: "/community-organization/resolved" },
        { label: "Collaborations", path: "/community-organization/collaborations" },
        { label: "Notifications", path: "/community-organization/notifications" },
        { label: "Profile", path: "/community-organization/profile" }
      ]
    : role === "university"
      ? [
          { label: "Overview", path: "/university" },
          { label: "Challenges", path: "/university/challenges" },
          { label: "Problems to Implement", path: "/university/problems" },
          { label: "Implemented Problems", path: "/university/implemented" },
          { label: "Projects", path: "/university/projects" },
          { label: "Student Teams", path: "/university/teams" },
          { label: "Notifications", path: "/university/notifications" },
          { label: "Profile", path: "/university/profile" }
        ]
      : role === "local_body"
      ? [
          { label: "Dashboard", path: "/local-body" },
          { label: "Submit Challenge", path: "/local-body/report" },
          { label: "Pending Review", path: "/local-body/pending" },
          { label: "Prioritized", path: "/local-body/prioritized" },
          { label: "Assigned", path: "/local-body/assigned" },
          { label: "Implementation", path: "/local-body/implementation" },
          { label: "Resolved", path: "/local-body/resolved" },
          { label: "Reports", path: "/local-body/reports" },
          { label: "Notifications", path: "/local-body/notifications" },
          { label: "Profile", path: "/local-body/profile" }
        ]
      : role === "government_agency"
      ? [
          { label: "Dashboard", path: "/government" },
          { label: "Submit Challenge", path: "/government/submit" },
          { label: "Validation Queue", path: "/government/validation" },
          { label: "Prioritized", path: "/government/prioritized" },
          { label: "Matching", path: "/government/matching" },
          { label: "Proposals", path: "/government/proposals" },
          { label: "Projects", path: "/government/projects" },
          { label: "Monitoring", path: "/government/monitoring" },
          { label: "Escalations", path: "/government/escalations" },
          { label: "Reports", path: "/government/reports" },
          { label: "Notifications", path: "/government/notifications" },
          { label: "Profile", path: "/government/profile" }
        ]
      : role === "startup"
      ? [
          { label: "Dashboard", path: "/startup" },
          { label: "Browse Challenges", path: "/startup/problems" },
          { label: "My Interests", path: "/startup/interests" },
          { label: "Implemented Problems", path: "/startup/implemented" },
          { label: "Active Pilots", path: "/startup/pilots" },
          { label: "Proposals", path: "/startup/proposals" },
          { label: "Notifications", path: "/startup/notifications" },
          { label: "Profile", path: "/startup/profile" }
        ]
      : role === "industry" ? [
        { label: "Dashboard", path: "/industry" },
        { label: "Browse Challenges", path: "/industry/problems" },
        { label: "My Interests", path: "/industry/interests" },
        { label: "Profile", path: "/industry/profile" }
      ] : role === "research_lab" ? [
        { label: "Dashboard", path: "/research-lab" },
        { label: "Browse Challenges", path: "/research-lab/problems" },
        { label: "My Interests", path: "/research-lab/interests" },
        { label: "Profile", path: "/research-lab/profile" }
      ] : role ? [
        { label: "Workspace Home", path: routeForRole(role) },
        { label: "Challenges", path: `${routeForRole(role)}/challenges` },
        { label: "Projects", path: `${routeForRole(role)}/projects` },
        { label: "Notifications", path: `${routeForRole(role)}/notifications` }
      ] : [];

  return (
    <div className={`app-shell ${role ? `role-${role}` : ""}`}>
      <header className="topbar">
        <Link className="brand" to={role ? routeForRole(role) : "/login"}>
          <span className="brand-mark">S</span>
          <span><strong>Sahaya</strong><small>Societal Innovation Network</small></span>
        </Link>
        {user && <div className="topbar-right"><span className="role-pill">{roleLabels[role]}</span><button className="ghost-button" onClick={logout}>Logout</button></div>}
      </header>

      {user && <aside className="sidebar">
        <div className="workspace-title">{roleLabels[role]}</div>
        <nav aria-label="Workspace navigation">
          {navItems.map((item) => <Link key={item.path} className={`nav-link ${location.pathname === item.path ? "active" : ""}`} to={item.path}>{item.label}</Link>)}
        </nav>
        <div className="sidebar-note"><strong>Prototype mode</strong><p>Mock authentication and data only. Citizen submissions are stored locally in this browser.</p></div>
      </aside>}

      <main className={user ? "main-content with-sidebar" : "main-content"}>{children}</main>
      <footer className="footer"><span>© 2026 Sahaya Tech</span><span>SIH 2026 · Problem Statement 26043</span></footer>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("citizen");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const submit = (e) => { e.preventDefault(); login({ role, identifier, password }); navigate(routeForRole(role)); };

  return <section className="auth-page">
    <div className="auth-hero">
      <div className="eyebrow">SMART INDIA HACKATHON 2026 · PS 26043</div>
      <h1>One ecosystem for societal problems, collaboration and measurable impact.</h1>
      <p>Citizens surface challenges. Government validates and routes them. Universities solve. Startups build. Industry enables scale.</p>
      <div className="flow-strip"><span>Problem</span><b>→</b><span>Validation</span><b>→</b><span>Collaboration</span><b>→</b><span>Solution</span><b>→</b><span>Impact</span></div>
    </div>
    <div className="auth-card">
      <div className="card-heading"><span className="brand-mark large">S</span><div><h2>Sign in to Sahaya</h2><p>Use one shared login for every Sahaya participant.</p></div></div>
      <form onSubmit={submit}>
        <label>Email / Mobile<input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com" required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></label>
        <div className="form-row"><label className="checkbox"><input type="checkbox" /> Remember me</label><button type="button" className="text-button">Forgot password?</button></div>
        <label>Demo Login As<select value={role} onChange={(e) => setRole(e.target.value)}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <button className="primary-button full" type="submit">Login</button>
      </form>
      <div className="divider"><span>New to Sahaya?</span></div>
      <Link className="secondary-button full" to={registrationRouteForRole(role)}>Create {roleLabels[role]} account</Link>
      <p className="demo-hint">Any credentials are accepted in prototype mode; the selected role controls the mock session.</p>
    </div>
  </section>;
}

const registrationFields = {
  citizen: [["name", "Full name", "text"], ["contact", "Email / mobile", "text"], ["district", "District", "text"], ["password", "Password", "password"]],
  community_organization: [["name", "Organization name", "text"], ["contact", "Contact person", "text"], ["email", "Email", "email"], ["district", "District / community served", "text"], ["focus", "Community focus", "text"], ["password", "Password", "password"]],
  local_body: [["authority", "Local body name", "text"], ["jurisdiction", "Jurisdiction", "text"], ["email", "Official email", "email"], ["designation", "Authorized representative", "text"], ["services", "Services / departments", "text"], ["password", "Password", "password"]],
  government_agency: [["authority", "Department / agency", "text"], ["jurisdiction", "Jurisdiction", "text"], ["email", "Official email", "email"], ["designation", "Designation", "text"], ["mandate", "Mandate / sectors", "text"], ["password", "Password", "password"]],
  startup: [["name", "Startup name", "text"], ["domain", "Industry / domain", "text"], ["hq", "Headquarters", "text"], ["email", "Official email", "email"], ["representative", "Representative", "text"], ["technologies", "Technologies / products", "text"], ["sectors", "Sectors served", "text"], ["deployment", "Deployment capability", "text"], ["trl", "Technology Readiness Level (TRL)", "text"], ["geography", "Geographic coverage", "text"], ["password", "Password", "password"]],
  industry: [["company", "Company name", "text"], ["sector", "Industry sector", "text"], ["location", "Location", "text"], ["email", "Official email", "email"], ["representative", "Representative", "text"], ["capabilities", "Capabilities", "text"], ["csr", "CSR / innovation interests", "text"], ["password", "Password", "password"]],
  research_lab: [["name", "Research lab name", "text"], ["institution", "Parent institution", "text"], ["email", "Official email", "email"], ["lead", "Lab lead", "text"], ["domains", "Research domains", "text"], ["facilities", "Facilities / equipment", "text"], ["password", "Password", "password"]]
};

function RegisterRoleSelection() {
  return <section className="form-page role-selection-page"><div className="page-intro"><div className="eyebrow">JOIN SAHAYA</div><h1>Choose your account type</h1><p>Every participant uses the same secure registration architecture and receives a role-specific onboarding form.</p></div><div className="role-selection-grid">{ROLE_IDS.map((role) => <Link className="role-selection-card" to={registrationRouteForRole(role)} key={role}><strong>{roleLabels[role]}</strong><span>Register as a {roleLabels[role].toLowerCase()}</span><b>→</b></Link>)}</div><Link className="secondary-button" to="/login">Back to login</Link></section>;
}

function UniversityDocumentSection({ files, setFiles, role = "university" }) {
  const categories = [
    ["pastProjects", "Already solved problems / past projects", "Project reports, case studies, implementation evidence"],
    ["licenses", "Licenses & registrations", "Institutional registrations or statutory documents"],
    ["certifications", "Certifications", "Accreditation, quality or technical certifications"],
    ["awards", "Awards & recognition", "Awards, rankings or innovation recognitions"]
  ];
  const addFiles = (category, event) => {
    const selected = Array.from(event.target.files || []);
    setFiles((current) => ({ ...current, [category]: [...current[category], ...selected.map((f) => ({ name: f.name, size: f.size, type: f.type }))] }));
    event.target.value = "";
  };
  const remove = (category, name) => setFiles((current) => ({ ...current, [category]: current[category].filter((f) => f.name !== name) }));
  return <section className="document-upload-section">
    <div className="section-title"><h2>{role === "startup" ? "Startup documents" : "Institutional documents"}</h2><p>Upload evidence that helps Sahaya understand your implementation capability. Files are private and shown only to authorized reviewers.</p></div>
    <div className="document-category-grid">{categories.map(([key, title, help]) => <div className="registration-document" key={key}>
      <div><strong>{title}</strong><p>{help}</p></div>
      <label className="upload-inline"><span>＋ Choose files</span><input type="file" multiple onChange={(e) => addFiles(key, e)} /></label>
      {files[key].length > 0 && <div className="registration-file-list">{files[key].map((file) => <div key={file.name}><span>▤</span><strong title={file.name}>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small><button type="button" className="remove-button" onClick={() => remove(key, file.name)}>Remove</button></div>)}</div>}
    </div>)}</div>
  </section>;
}

function CommunityDocumentSection({ files, setFiles }) {
  const categories = [
    ["registration", "Registration / legal proof", "Trust registration, society certificate or community authorization"],
    ["authorization", "Community authorization", "Gram sabha resolution, mandate or partner letter"],
    ["impact", "Past community work", "Impact notes, project reports or outcome evidence"]
  ];
  const addFiles = (category, event) => {
    const selected = Array.from(event.target.files || []);
    setFiles((current) => ({ ...current, [category]: [...(current[category] || []), ...selected.map((file) => ({ name: file.name, size: file.size, type: file.type }))] }));
    event.target.value = "";
  };
  const remove = (category, name) => setFiles((current) => ({ ...current, [category]: (current[category] || []).filter((file) => file.name !== name) }));
  return <section className="document-upload-section">
    <div className="section-title"><h2>Community organization documents</h2><p>Private verification evidence helps Sahaya understand your mandate and community relationships.</p></div>
    <div className="document-category-grid">{categories.map(([key, title, help]) => <div className="registration-document" key={key}>
      <div><strong>{title}</strong><p>{help}</p></div>
      <label className="upload-inline"><span>＋ Choose files</span><input type="file" multiple onChange={(event) => addFiles(key, event)} /></label>
      {(files[key] || []).length > 0 && <div className="registration-file-list">{files[key].map((file) => <div key={file.name}><span>▤</span><strong title={file.name}>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small><button type="button" className="remove-button" onClick={() => remove(key, file.name)}>Remove</button></div>)}</div>}
    </div>)}</div>
  </section>;
}

function LocalBodyDocumentSection({ files, setFiles }) {
  const categories = [
    ["registration", "Establishment / registration proof", "Government notification, ULB act or establishment order"],
    ["authorization", "Officer authorization", "Appointment order or authorization for the nominated representative"],
    ["serviceProfile", "Service and jurisdiction profile", "Ward map, service charter or department directory"],
    ["compliance", "Compliance and past work", "Audit, service-level or completed-work evidence"]
  ];
  const addFiles = (category, event) => {
    const selected = Array.from(event.target.files || []);
    setFiles((current) => ({ ...current, [category]: [...(current[category] || []), ...selected.map((file) => ({ name: file.name, size: file.size, type: file.type }))] }));
    event.target.value = "";
  };
  const remove = (category, name) => setFiles((current) => ({ ...current, [category]: (current[category] || []).filter((file) => file.name !== name) }));
  return <section className="document-upload-section local-body-documents">
    <div className="section-title"><h2>Local body verification documents</h2><p>These documents establish authority, jurisdiction and the ability to coordinate civic services. They remain private to authorized reviewers.</p></div>
    <div className="document-category-grid">{categories.map(([key, title, help]) => <div className="registration-document" key={key}>
      <div><strong>{title}</strong><p>{help}</p></div>
      <label className="upload-inline"><span>＋ Choose files</span><input type="file" multiple onChange={(event) => addFiles(key, event)} /></label>
      {(files[key] || []).length > 0 && <div className="registration-file-list">{files[key].map((file) => <div key={file.name}><span>▤</span><strong title={file.name}>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small><button type="button" className="remove-button" onClick={() => remove(key, file.name)}>Remove</button></div>)}</div>}
    </div>)}</div>
  </section>;
}

function GovernmentDocumentSection({ files, setFiles }) {
  const categories = [
    ["registration", "Agency registration / notification", "Government notification, department order or statutory registration"],
    ["authorization", "Representative authorization", "Nomination, appointment or authorization for the agency representative"],
    ["jurisdiction", "Jurisdiction and service profile", "Service map, mandate, department directory or coverage note"],
    ["compliance", "Compliance and past work", "Audit, procurement, programme or completed-work evidence"]
  ];
  const addFiles = (category, event) => {
    const selected = Array.from(event.target.files || []);
    setFiles((current) => ({ ...current, [category]: [...(current[category] || []), ...selected.map((file) => ({ name: file.name, size: file.size, type: file.type }))] }));
    event.target.value = "";
  };
  const remove = (category, name) => setFiles((current) => ({ ...current, [category]: (current[category] || []).filter((file) => file.name !== name) }));
  return <section className="document-upload-section government-documents">
    <div className="section-title"><h2>Government agency verification documents</h2><p>Documents are private and available only to authorized reviewers. They support agency identity, representative authority and jurisdiction checks.</p></div>
    <div className="document-category-grid">{categories.map(([category, title, help]) => <div className="registration-document" key={category}><div><strong>{title}</strong><p>{help}</p></div><label className="upload-inline"><span>＋ Choose files</span><input type="file" multiple onChange={(event) => addFiles(category, event)} /></label>{(files[category] || []).length > 0 && <div className="registration-file-list">{files[category].map((file) => <div key={file.name}><span>▤</span><strong title={file.name}>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB</small><button type="button" className="remove-button" onClick={() => remove(category, file.name)}>Remove</button></div>)}</div>}</div>)}</div>
  </section>;
}

function RegisterPage() {
  const { loginAs, registerUser } = useAuth(); const navigate = useNavigate(); const { role: routeRole } = useParams(); const role = routeRole === "local-body" ? "local_body" : routeRole === "government-agency" ? "government_agency" : routeRole;
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState({ pastProjects: [], licenses: [], certifications: [], awards: [] });
  const [localBodyFiles, setLocalBodyFiles] = useState({ registration: [], authorization: [], serviceProfile: [], compliance: [] });
  const [governmentFiles, setGovernmentFiles] = useState({ registration: [], authorization: [], jurisdiction: [], compliance: [] });
  const [form, setForm] = useState({ institution: "", type: "University / HEI", state: "Jharkhand", district: "Ranchi", email: "", admin: "", domains: "", departments: "", faculty: "", labs: "", capacity: "", password: "" });
  if (!role) return <RegisterRoleSelection />;
  if (!ROLE_IDS.includes(role)) return <Navigate to="/register" replace />;
  if (submitted) return <section className="center-page"><div className="success-card"><div className="success-icon">✓</div><h1>Registration submitted</h1><p>Your <strong>{roleLabels[role]}</strong> account is now in <strong>Verification pending</strong> mock state. Your details are stored locally for this prototype.</p>{["university", "startup", "research_lab", "local_body", "government_agency"].includes(role) && <div className="registration-progress-card"><div className="panel-heading"><h2>{roleLabels[role]} profile progress</h2><strong>{role === "local_body" ? "90%" : role === "government_agency" ? "86%" : "72%"}</strong></div><div className="profile-progress"><span style={{ width: role === "local_body" ? "90%" : role === "government_agency" ? "86%" : "72%" }} /></div><div className="profile-progress-list"><div>✓ Organization and agency identity</div><div>✓ Jurisdiction and mandate</div><div>✓ Contact and representative</div><div>✓ Registration submitted for review</div><div>○ Capability and document verification</div></div></div>}<div className="button-row"><button className="primary-button" onClick={() => { loginAs(role); navigate(routeForRole(role)); }}>Continue to {roleLabels[role]} workspace</button><Link className="secondary-button" to="/login">Back to login</Link></div></div></section>;
  if (role === "government_agency") return <section className="form-page university-registration government-registration"><div className="page-intro"><div className="eyebrow">GOVERNMENT AGENCY REGISTRATION · PS 26043</div><h1>Register your government agency</h1><p>Create a verified public authority profile for challenge validation, prioritization, partner matching and accountable monitoring.</p></div><form className="registration-card university-registration-card" onSubmit={(e) => { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget).entries()); const documentCount = Object.values(governmentFiles).reduce((total, items) => total + items.length, 0); registerUser(role, { ...values, name: values.agencyName, authority: values.agencyName, email: values.officialEmail, representative: values.representativeName, profileCompletion: Math.min(100, 66 + (documentCount ? 20 : 0)), files: governmentFiles }); setSubmitted(true); }}>
    <div className="registration-full registration-section-heading"><h2>Agency identity</h2><p>Official identity and parent ministry details used for role verification.</p></div>
    <label>Agency / department name<input name="agencyName" required placeholder="Department, ministry, mission or statutory agency" /></label>
    <label>Agency type<select name="agencyType" defaultValue="State department"><option>Central ministry / department</option><option>State department</option><option>District administration</option><option>Statutory authority</option><option>Mission / programme office</option><option>Other public agency</option></select></label>
    <label>Parent ministry / government<input name="ministry" required placeholder="Government of Jharkhand / ministry name" /></label>
    <label>Registration / notification number<input name="registrationNumber" required placeholder="Official notification, department or establishment number" /></label>
    <label>Official email<input name="officialEmail" required type="email" placeholder="nodal@department.gov.in" /></label>
    <label>Official phone / helpline<input name="phone" required placeholder="+91..." /></label>
    <div className="registration-full registration-section-heading"><h2>Authorized representative</h2><p>Identify the nodal officer responsible for decisions and follow-up.</p></div>
    <label>Representative name<input name="representativeName" required placeholder="Full name" /></label>
    <label>Designation<input name="representativeDesignation" required placeholder="State Nodal Officer / Director / Commissioner" /></label>
    <label>Representative email<input name="representativeEmail" required type="email" placeholder="officer@department.gov.in" /></label>
    <label>Representative phone<input name="representativePhone" required placeholder="+91..." /></label>
    <div className="registration-full registration-section-heading"><h2>Jurisdiction and mandate</h2><p>Describe where the agency operates, what it delivers and which units can own responses.</p></div>
    <label>State / UT<input name="state" required defaultValue="Jharkhand" /></label>
    <label>Primary district / headquarters<input name="district" required defaultValue="Ranchi" /></label>
    <label>Jurisdiction description<input name="jurisdiction" required placeholder="State-wide, districts, blocks, facilities or populations covered" /></label>
    <label>Service areas<input name="serviceAreas" required placeholder="Water, health, agriculture, education..." /></label>
    <label>Departments / nodal units<input name="departments" required placeholder="Departments, missions or units that can respond" /></label>
    <label>Statutory mandate<textarea name="mandate" required rows="4" placeholder="Responsibilities and authority relevant to societal challenges" /></label>
    <label>Website<input name="website" type="url" placeholder="https://" /></label>
    <label>Password<input name="password" required type="password" minLength="8" /></label>
    <div className="registration-full"><GovernmentDocumentSection files={governmentFiles} setFiles={setGovernmentFiles} /></div>
    <div className="privacy-note registration-full"><strong>Government verification:</strong> agency, representative, jurisdiction and document details are stored locally in this prototype and represented as verification pending.</div>
    <button className="primary-button full registration-full" type="submit">Submit Government Agency Registration</button><Link className="secondary-button full registration-full" to="/login">Back to login</Link>
  </form></section>;
  if (role === "local_body") return <section className="form-page university-registration local-body-registration"><div className="page-intro"><div className="eyebrow">LOCAL BODY REGISTRATION · PS 26043</div><h1>Register your local body</h1><p>Create an institutional authority profile for jurisdiction validation, civic challenge review and accountable implementation.</p></div><form className="registration-card university-registration-card" onSubmit={(e) => { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget).entries()); const documentCount = Object.values(localBodyFiles).reduce((total, items) => total + items.length, 0); registerUser(role, { ...values, name: values.authority, email: values.officialEmail, profileCompletion: Math.min(100, 70 + (documentCount ? 20 : 0)), files: localBodyFiles }); setSubmitted(true); }}>
    <label>Local body / authority name<input name="authority" required defaultValue={localBodyProfile.authority} placeholder="Municipal corporation, municipality, panchayat..." /></label>
    <label>Local body type<select name="bodyType" defaultValue={localBodyProfile.bodyType}><option>Municipal Corporation</option><option>Municipality / Nagar Parishad</option><option>Gram Panchayat</option><option>Block / District authority</option><option>Other statutory local body</option></select></label>
    <label>Establishment / registration number<input name="registrationNumber" required placeholder="Official registration or notification number" /></label>
    <label>State<input name="state" required defaultValue={localBodyProfile.state} /></label>
    <label>District<input name="district" required defaultValue={localBodyProfile.district} /></label>
    <label>Jurisdiction description<input name="jurisdiction" required placeholder="City, block, panchayat or service area" /></label>
    <label>Wards / villages covered<input name="wards" required placeholder="Ward numbers, villages or habitations" /></label>
    <label>Official email<input name="officialEmail" required type="email" placeholder="official@authority.gov.in" /></label>
    <label>Official phone / helpline<input name="phone" required placeholder="+91..." /></label>
    <label>Authorized representative<input name="authorizedOfficer" required placeholder="Name of officer" /></label>
    <label>Designation<input name="designation" required placeholder="Commissioner, BDO, Panchayat Secretary..." /></label>
    <label>Departments / nodal units<input name="departments" required placeholder="Water, roads, sanitation, health..." /></label>
    <label>Service areas<input name="serviceAreas" required placeholder="Services delivered by this authority" /></label>
    <label>Statutory mandate<textarea name="mandate" required rows="3" placeholder="What responsibilities does the local body hold?"></textarea></label>
    <label>Website<input name="website" type="url" placeholder="https://" /></label>
    <label>Password<input name="password" required type="password" minLength="8" /></label>
    <div className="registration-full"><LocalBodyDocumentSection files={localBodyFiles} setFiles={setLocalBodyFiles} /></div>
    <div className="privacy-note registration-full"><strong>Authority verification:</strong> submitted details and documents are private. Verification is represented as a mock pending state in this frontend prototype.</div>
    <button className="primary-button full registration-full" type="submit">Submit Local Body Registration</button><Link className="secondary-button full registration-full" to="/login">Back to login</Link>
  </form></section>;
  if (role === "startup") return <section className="form-page university-registration"><div className="page-intro"><div className="eyebrow">STARTUP REGISTRATION · PS 26043</div><h1>Register your startup</h1><p>Build a verified technology and deployment profile so validated societal challenges can be matched to your startup.</p></div><form className="registration-card university-registration-card" onSubmit={(e) => { e.preventDefault(); registerUser(role, { ...form, name: form.institution, files }); setSubmitted(true); }}>
    <label>Startup name<input required value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Startup / company name" /></label>
    <label>Industry / domain<input required value={form.domains} onChange={(e) => setForm({ ...form, domains: e.target.value })} placeholder="Agritech, WaterTech, HealthTech..." /></label>
    <label>Headquarters<input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="City, State" /></label>
    <label>Official email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
    <label>Founder / representative<input required value={form.admin} onChange={(e) => setForm({ ...form, admin: e.target.value })} /></label>
    <label>Technologies / products<input value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} placeholder="IoT, AI, GIS, sensors..." /></label>
    <label>Deployment capability<input value={form.labs} onChange={(e) => setForm({ ...form, labs: e.target.value })} placeholder="Pilot teams, field deployment, integration..." /></label>
    <label>Technology Readiness Level (TRL)<input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="e.g. TRL 7" /></label>
    <label>Geographic coverage<input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="Jharkhand / India / districts served" /></label>
    <label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
    <div className="registration-full"><UniversityDocumentSection role="startup" files={files} setFiles={setFiles} /></div>
    <div className="privacy-note registration-full"><strong>Privacy by design:</strong> licenses, certifications, awards and past deployment evidence are private and available only to authorized reviewers.</div>
    <button className="primary-button full registration-full" type="submit">Submit Startup Registration</button><Link className="secondary-button full registration-full" to="/login">Back to login</Link>
  </form></section>;
  if (role === "community_organization") return <section className="form-page university-registration"><div className="page-intro"><div className="eyebrow">COMMUNITY ORGANIZATION REGISTRATION · PS 26043</div><h1>Register your community organization</h1><p>Tell Sahaya who your organization serves, what community evidence you bring and how partners can reach you.</p></div><form className="registration-card university-registration-card" onSubmit={(e) => { e.preventDefault(); registerUser(role, { ...form, name: form.institution, organizationName: form.institution, contactPerson: form.admin, phone: form.phone, files }); setSubmitted(true); }}>
    <label>Organization name<input required value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Registered organization / collective name" /></label>
    <label>Organization type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Community-based organization</option><option>Self-help group federation</option><option>Non-profit / trust</option><option>Resident or producer collective</option></select></label>
    <label>District / block served<input required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder="District and blocks / wards" /></label>
    <label>Communities served<input required value={form.communitiesServed || ""} onChange={(e) => setForm({ ...form, communitiesServed: e.target.value })} placeholder="Villages, wards or groups represented" /></label>
    <label>Official email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
    <label>Phone / WhatsApp<input required value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
    <label>Authorized contact person<input required value={form.admin} onChange={(e) => setForm({ ...form, admin: e.target.value })} placeholder="Name and role" /></label>
    <label>Community focus areas<input required value={form.domains} onChange={(e) => setForm({ ...form, domains: e.target.value })} placeholder="Water, livelihoods, health, education..." /></label>
    <label>Registration / authorization number<input value={form.registrationNumber || ""} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} placeholder="Optional if informal collective" /></label>
    <label>Short organization description<textarea required value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" placeholder="What does your organization do with and for the community?" /></label>
    <label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
    <div className="registration-full"><CommunityDocumentSection files={files} setFiles={setFiles} /></div>
    <div className="privacy-note registration-full"><strong>Privacy by design:</strong> contact details and documents are shared only with authorized reviewers and relevant collaborators.</div>
    <button className="primary-button full registration-full" type="submit">Submit Community Organization Registration</button><Link className="secondary-button full registration-full" to="/login">Back to login</Link>
  </form></section>;
  if (role === "university") return <section className="form-page university-registration"><div className="page-intro"><div className="eyebrow">UNIVERSITY / HEI REGISTRATION · PS 26043</div><h1>Register your institution</h1><p>Build a capability profile so validated societal challenges can be matched to your departments, faculty, labs and past implementation experience.</p></div><form className="registration-card university-registration-card" onSubmit={(e) => { e.preventDefault(); registerUser(role, { ...form, name: form.institution, files }); setSubmitted(true); }}>
    <label>Institution name<input required value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="University / College / HEI name" /></label>
    <label>Institution type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>University / HEI</option><option>College</option><option>Research-focused institute</option><option>Autonomous institution</option></select></label>
    <label>State<input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></label>
    <label>District<input required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></label>
    <label>Official email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
    <label>University administrator<input required value={form.admin} onChange={(e) => setForm({ ...form, admin: e.target.value })} /></label>
    <label>Departments<input value={form.departments} onChange={(e) => setForm({ ...form, departments: e.target.value })} placeholder="Water Engineering, CSE, Agriculture..." /></label>
    <label>Research domains<input value={form.domains} onChange={(e) => setForm({ ...form, domains: e.target.value })} placeholder="Hydrology, AI, Renewable Energy..." /></label>
    <label>Faculty expertise<input value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} placeholder="Faculty names / expertise areas" /></label>
    <label>Laboratories & facilities<input value={form.labs} onChange={(e) => setForm({ ...form, labs: e.target.value })} placeholder="Water testing lab, IoT lab, fabrication lab..." /></label>
    <label>Student teams & current capacity<input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="Available multidisciplinary teams / capacity" /></label>
    <label>Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
    <div className="registration-full"><UniversityDocumentSection files={files} setFiles={setFiles} /></div>
    <div className="privacy-note registration-full"><strong>Privacy by design:</strong> institutional documents are private and remain available to authorized Sahaya reviewers. Registration is a frontend prototype; no real verification is performed.</div>
    <button className="primary-button full registration-full" type="submit">Submit University Registration</button><Link className="secondary-button full registration-full" to="/login">Back to login</Link>
  </form></section>;
  const fields = registrationFields[role] || registrationFields.citizen;
  return <section className="form-page"><div className="page-intro"><div className="eyebrow">ACCOUNT REGISTRATION</div><h1>Create a {roleLabels[role]} account</h1><p>Organization-aware onboarding keeps identities, capabilities and permissions separate.</p></div><form className="registration-card" onSubmit={(e) => { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget).entries()); registerUser(role, values); setSubmitted(true); }}>{fields.map(([name, label, type]) => <label key={name}>{label}<input name={name} type={type} required /></label>)}<div className="privacy-note"><strong>Privacy by design:</strong> personal contact details and private documents are not exposed on public challenge views.</div><button className="primary-button full" type="submit">Submit registration</button><Link className="secondary-button full" to="/login">Back to login</Link></form></section>;
}

function getCitizenSubmissions(userId) {
  try {
    const all = JSON.parse(localStorage.getItem("sahaya_citizen_submissions") || "[]");
    return userId ? all.filter((item) => item.submittedBy === userId) : all;
  } catch { return []; }
}
function saveCitizenSubmissions(items) {
  const existing = (() => { try { return JSON.parse(localStorage.getItem("sahaya_citizen_submissions") || "[]"); } catch { return []; } })();
  const byId = new Map(existing.map((item) => [item.id, item]));
  items.forEach((item) => byId.set(item.id, item));
  localStorage.setItem("sahaya_citizen_submissions", JSON.stringify([...byId.values()]));
}
function startOfWeek(date = new Date()) {
  const d = new Date(date); const day = d.getDay(); const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + diff); return d;
}
function endOfWeek(date = new Date()) { const d = startOfWeek(date); d.setDate(d.getDate() + 6); d.setHours(23, 59, 59, 999); return d; }
function weeklySubmissionCount(items) { const start = startOfWeek(); return items.filter((item) => new Date(item.createdAt) >= start).length; }
function weekLabel() {
  const start = startOfWeek(); const end = endOfWeek();
  return `${start.toLocaleDateString(undefined, { day: "2-digit", month: "short" })} – ${end.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}`;
}
function lifecycleIndex(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("resolved") || normalized.includes("closed") || normalized.includes("impact")) return CHALLENGE_LIFECYCLE.length - 1;
  if (normalized.includes("initial screening") || normalized === "screening" || normalized.includes("under review")) return 0;
  if (normalized.includes("government validation") || normalized.includes("validated")) return 2;
  if (normalized.includes("resolution")) return 3;
  if (normalized.includes("matching") || normalized.includes("capability")) return 4;
  if (normalized.includes("solution") || normalized.includes("development")) return 5;
  if (normalized.includes("pilot")) return 6;
  if (normalized.includes("implementation") || normalized.includes("deployment")) return 7;
  return 0;
}
function lifecycleTimeline(challenge) {
  const current = lifecycleIndex(challenge.status);
  const base = new Date(challenge.createdAt || Date.now());
  return CHALLENGE_LIFECYCLE.map((label, index) => ({
    label,
    done: index < current,
    current: index === current,
    date: index <= current ? new Date(base.getTime() + index * 86400000 * 2).toISOString() : null
  }));
}
function mockAiAnalysis(form) {
  const text = `${form.title} ${form.description} ${form.affected || ""}`.toLowerCase();
  let domain = "Public Services";
  if (text.includes("water") || text.includes("handpump") || text.includes("drinking")) domain = "Water & Sanitation";
  else if (text.includes("crop") || text.includes("farmer") || text.includes("agriculture")) domain = "Agriculture";
  else if (text.includes("school") || text.includes("student") || text.includes("education")) domain = "Education";
  else if (text.includes("road") || text.includes("streetlight") || text.includes("drain")) domain = "Urban Infrastructure";
  else if (text.includes("health") || text.includes("hospital") || text.includes("clinic")) domain = "Healthcare";
  else if (text.includes("waste") || text.includes("garbage")) domain = "Environment & Waste";
  else if (text.includes("disability") || text.includes("accessible")) domain = "Accessibility";
  const requirements = {
    "Water & Sanitation": ["Water Engineering", "Water Testing", "IoT Monitoring"],
    Agriculture: ["Agronomy", "Data / Computer Vision", "Field Deployment"],
    Education: ["Education Technology", "Accessibility", "Community Engagement"],
    "Urban Infrastructure": ["Civil Engineering", "GIS", "Municipal Operations"],
    Healthcare: ["Public Health", "Digital Health", "Field Operations"],
    "Environment & Waste": ["Environmental Engineering", "Route Optimization", "Community Operations"],
    Accessibility: ["Universal Design", "Civil Engineering", "Assistive Technology"],
    "Public Services": ["Process Improvement", "Digital Services", "Community Operations"]
  }[domain];
  return {
    domain,
    category: domain,
    priority: form.priority,
    duplicateCandidates: text.length > 70 ? 2 : 1,
    suggestedJurisdiction: `${form.district} District Administration`,
    requiredCapabilities: requirements,
    confidence: form.description.length > 120 ? 91 : 84,
    resolution: form.priority === "Critical" ? "Government Action + Multi-Stakeholder" : "Government Review + Capability Matching"
  };
}

function CitizenHome() {
  const { user, data } = useAuth();
  const [submissions, setSubmissions] = useState(() => getCitizenSubmissions(user.id));
  const weekCount = weeklySubmissionCount(submissions);
  const remaining = Math.max(CITIZEN_WEEKLY_LIMIT - weekCount, 0);
  const ownedMock = data.mockChallenges.find((c) => c.submittedBy === user.id);
  const allMine = [...submissions, ...(ownedMock ? [ownedMock] : [])];
  const latest = allMine[0];
  const visibleChallenges = data.mockChallenges.filter((c) => c.visibleTo.includes("citizen"));
  const statusCount = (predicate) => allMine.filter(predicate).length;
  return <section className="workspace citizen-home">
    <div className="workspace-header">
      <div><div className="eyebrow">CITIZEN HUB · PS 26043</div><h1>Welcome back, {user.name.split(" ")[0]}</h1><p>Report a local problem, add evidence and follow its journey from validation to impact.</p></div>
      <Link className={`primary-button ${remaining === 0 ? "disabled-button" : ""}`} to={remaining > 0 ? "/citizen/report" : "#"} onClick={(e) => { if (remaining === 0) e.preventDefault(); }}>+ Submit a Problem</Link>
    </div>

    <div className="limit-banner prominent-limit"><div><strong>Weekly problem-submission limit</strong><span>You can submit up to <b>{CITIZEN_WEEKLY_LIMIT} problem statements per week.</b> This limit helps keep validation focused and prevents duplicate or spam submissions.</span><small>Current week: {weekLabel()}</small></div><div className="limit-meter"><strong>{weekCount} / {CITIZEN_WEEKLY_LIMIT} used</strong><div><span style={{ width: `${Math.min((weekCount / CITIZEN_WEEKLY_LIMIT) * 100, 100)}%` }} /></div><small>{remaining > 0 ? `${remaining} submission${remaining === 1 ? "" : "s"} remaining this week` : "Limit reached · resets next Monday"}</small></div></div>

    <div className="citizen-actions"><Link className={`action-card ${remaining === 0 ? "action-disabled" : ""}`} to={remaining > 0 ? "/citizen/report" : "#"} onClick={(e) => { if (remaining === 0) e.preventDefault(); }}><span className="action-icon">＋</span><div><strong>Report a Problem</strong><p>Title, description, priority, location, voice and evidence.</p></div><b>→</b></Link><Link className="action-card" to="/citizen/challenges"><span className="action-icon">⌕</span><div><strong>Explore Community Challenges</strong><p>Search public problems by district, domain, priority and status.</p></div><b>→</b></Link></div>

    <div className="metric-grid citizen-metrics">
      <Metric label="Submitted" value={allMine.length} /><Metric label="Under review" value={statusCount(c => lifecycleIndex(c.status) <= 2)} /><Metric label="In progress" value={statusCount(c => lifecycleIndex(c.status) >= 3 && lifecycleIndex(c.status) < 8)} /><Metric label="Resolved" value={statusCount(c => /resolved|closed/i.test(c.status))} />
    </div>

    <div className="citizen-grid">
      <section className="panel">
        <div className="panel-heading"><div><h2>My latest problem progress</h2><span>Transparent lifecycle</span></div><Link className="text-link" to="/citizen/my-challenges">View all</Link></div>
        {latest ? <ChallengeProgress challenge={latest} /> : <EmptyState title="You haven't submitted any challenges yet." text="Your problem statement, status and weekly submission history will appear here." action="Report a Problem" href="/citizen/report" />}
      </section>
      <section className="panel">
        <div className="panel-heading"><div><h2>Community challenges</h2><span>{visibleChallenges.length} available</span></div><Link className="text-link" to="/citizen/challenges">Explore</Link></div>
        <div className="challenge-list">{visibleChallenges.slice(0, 4).map((c) => <Link className="challenge-row clickable-row" to={`/citizen/challenges/${c.id}`} key={c.id}><div><strong>{c.title}</strong><p>{c.district} · {(c.affectedPopulation || 0).toLocaleString()} people affected</p></div><span className={`priority ${String(c.priority).toLowerCase()}`}>{c.priority}</span></Link>)}</div>
      </section>
    </div>

    <section className="panel citizen-how-it-works"><div className="panel-heading"><div><h2>What happens after you submit?</h2><span>Your contribution stays traceable</span></div></div><div className="citizen-flow"><div><b>01</b><strong>Screening</strong><span>Completeness and relevance check</span></div><div><b>02</b><strong>Government validation</strong><span>Jurisdiction and responsibility confirmed</span></div><div><b>03</b><strong>Resolution pathway</strong><span>Government, research, innovation or collaboration</span></div><div><b>04</b><strong>Solution & impact</strong><span>Projects, pilots, implementation and measurable outcomes</span></div></div></section>
  </section>;
}

function StatusMini({ label, value }) { return <div className="status-mini"><span>{label}</span><strong>{value}</strong></div>; }
function EmptyState({ title, text, action, href }) { return <div className="inline-empty"><div className="empty-icon small">○</div><strong>{title}</strong><p>{text}</p><Link className="secondary-button" to={href}>{action}</Link></div>; }

function ChallengeProgress({ challenge, detailed = false }) {
  const timeline = lifecycleTimeline(challenge); const current = lifecycleIndex(challenge.status);
  return <div className={`progress-card ${detailed ? "progress-detailed" : ""}`}>
    <div className="progress-card-head"><div><span className="challenge-id">{challenge.id}</span><h3>{challenge.title}</h3><p>{challenge.district} · Priority: <strong>{challenge.priority}</strong></p></div><span className="status-badge">{challenge.status}</span></div>
    <div className="progress-track">{timeline.map((item, i) => <div key={item.label} className={`progress-step ${item.done ? "done" : ""} ${item.current ? "current" : ""}`}><span>{item.done ? "✓" : i + 1}</span><small>{item.label}</small>{detailed && item.date && <em>{new Date(item.date).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}</em>}</div>)}</div>
    <div className="progress-explain"><strong>Current stage: {challenge.status}</strong><span>{progressMessage(challenge.status)}</span></div>
    {detailed && <div className="timeline-list">{timeline.map((item, i) => <div className={`timeline-row ${item.done ? "done" : ""} ${item.current ? "current" : ""}`} key={item.label}><div className="timeline-marker">{item.done ? "✓" : item.current ? "●" : "○"}</div><div><strong>{item.label}</strong><p>{item.current ? progressMessage(challenge.status) : item.done ? "Completed in the Sahaya workflow." : "This stage will become active when the previous stage is completed."}</p></div>{item.date && <time>{new Date(item.date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</time>}</div>)}</div>}
  </div>;
}
function progressMessage(status) {
  const messages = {
    "Initial Screening": "Your submission has been received and is being screened for completeness and relevance.",
    "Government Validation": "The responsible government authority is reviewing and validating the problem.",
    "Under Review": "Your challenge is currently being evaluated before the next pathway is selected.",
    "Validated": "The challenge has been validated and can move toward a suitable resolution pathway.",
    "Resolution pathway": "The responsible authority is deciding whether government action, research, innovation or collaboration is required.",
    "Matching": "Relevant universities, startups and other organizations are being identified from their capabilities.",
    "Solution development": "A solution team is working on the challenge.",
    "Pilot": "The solution is being tested in a real community setting.",
    "Implementation": "The approved solution is being deployed.",
    "Resolved": "The challenge has reached a resolution and impact can now be measured."
  };
  return messages[status] || "Your challenge is moving through the Sahaya ecosystem.";
}

function ReportProblem() {
  const navigate = useNavigate(); const { user } = useAuth();
  const [submissions, setSubmissions] = useState(() => getCitizenSubmissions(user.id));
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium", affected: "", duration: "", district: "Ranchi", locality: "", location: "", landmark: "", mapLocation: "" });
  const [media, setMedia] = useState([]); const [documents, setDocuments] = useState([]); const [voice, setVoice] = useState(null); const [recording, setRecording] = useState(false); const [error, setError] = useState(""); const [submitted, setSubmitted] = useState(null);
  const mediaInput = useRef(null); const documentInput = useRef(null); const recorderRef = useRef(null); const chunksRef = useRef([]); const voiceUrlRef = useRef(null);
  const weekCount = weeklySubmissionCount(submissions); const remaining = Math.max(CITIZEN_WEEKLY_LIMIT - weekCount, 0);
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const addMedia = (e) => {
    const selected = Array.from(e.target.files || []);
    if (media.length + selected.length > 3) { setError("Maximum 3 photos/videos are allowed per problem statement. Remove a file before adding another."); e.target.value = ""; return; }
    const invalid = selected.find((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"));
    if (invalid) { setError("Only photos and videos can be added in this section."); return; }
    setError(""); setMedia((current) => [...current, ...selected.map((file) => ({ name: file.name, type: file.type, size: file.size, url: URL.createObjectURL(file) }))]); e.target.value = "";
  };
  const addDocuments = (e) => { const selected = Array.from(e.target.files || []); setDocuments((current) => [...current, ...selected.map((file) => ({ name: file.name, type: file.type, size: file.size }))]); e.target.value = ""; };
  const removeMedia = (name) => setMedia((items) => items.filter((item) => item.name !== name)); const removeDocument = (name) => setDocuments((items) => items.filter((item) => item.name !== name));
  const useCurrentLocation = () => { if (!navigator.geolocation) { setError("Location access is not supported by this browser."); return; } navigator.geolocation.getCurrentPosition((pos) => update("mapLocation", `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`), () => setError("Location permission was not granted. You can enter the location manually.")); };
  const startRecording = async () => { setError(""); if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError("Voice recording is not supported by this browser. You can use the audio upload option instead."); return; } try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const recorder = new MediaRecorder(stream); recorderRef.current = recorder; chunksRef.current = []; recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); }; recorder.onstop = () => { const blob = new Blob(chunksRef.current, { type: "audio/webm" }); if (voiceUrlRef.current) URL.revokeObjectURL(voiceUrlRef.current); voiceUrlRef.current = URL.createObjectURL(blob); setVoice({ name: `voice-message-${Date.now()}.webm`, type: "audio/webm", recorded: true, url: voiceUrlRef.current }); stream.getTracks().forEach((t) => t.stop()); setRecording(false); }; recorder.start(); setRecording(true); } catch { setError("Microphone permission was not granted. You can continue without a voice message."); } };
  const stopRecording = () => recorderRef.current?.stop();
  const addVoiceFile = (e) => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith("audio/")) { setError("Please select an audio file for the voice message."); return; } setVoice({ name: file.name, type: file.type, recorded: false, size: file.size, url: URL.createObjectURL(file) }); e.target.value = ""; };
  const next = () => { setError(""); if (step === 1 && (!form.title.trim() || !form.description.trim())) { setError("Please enter both the problem statement/title and a description."); return; } if (step === 2 && (!form.district || !form.locality.trim() || !form.location.trim())) { setError("Please provide district, village/town/ward and the specific location."); return; } if (step < 4) setStep(step + 1); };
  const submit = () => {
    setError(""); if (remaining <= 0) { setError(`Weekly limit reached. You can submit only ${CITIZEN_WEEKLY_LIMIT} problem statements per week.`); return; }
    const now = new Date().toISOString(); const number = 128 + getCitizenSubmissions().length + 1; const ai = mockAiAnalysis(form);
    const challenge = { id: `SC-2026-${String(number).padStart(5, "0")}`, title: form.title.trim(), description: form.description.trim(), priority: form.priority, status: "Initial Screening", district: form.district, locality: form.locality, specificLocation: form.location, landmark: form.landmark, mapLocation: form.mapLocation, affected: form.affected, duration: form.duration, mediaCount: media.length, media: media.map(({ name, type, size }) => ({ name, type, size })), documents: documents.map(({ name, type, size }) => ({ name, type, size })), voiceMessage: Boolean(voice), voiceName: voice?.name || "", submittedBy: user.id, createdAt: now, aiAnalysis: ai, supportCount: 0 };
    const nextItems = [challenge, ...getCitizenSubmissions(user.id)]; setSubmissions(nextItems); saveCitizenSubmissions(nextItems); setSubmitted(challenge);
  };
  if (submitted) return <section className="center-page"><div className="success-card submission-success"><div className="success-icon">✓</div><div className="eyebrow">CHALLENGE SUBMITTED</div><h1>Problem statement received</h1><p>Your community problem has entered <strong>Initial Screening</strong>. You have <strong>{Math.max(CITIZEN_WEEKLY_LIMIT - weeklySubmissionCount(getCitizenSubmissions(user.id)), 0)}</strong> submission(s) remaining this week.</p><div className="submission-id"><span>Challenge ID</span><strong>{submitted.id}</strong></div><ChallengeProgress challenge={submitted} /><div className="button-row"><Link className="primary-button" to="/citizen">Back to Citizen Home</Link><Link className="secondary-button" to="/citizen/my-challenges">Track my challenges</Link></div></div></section>;
  return <section className="report-page"><div className="report-header"><div><div className="eyebrow">REPORT A COMMUNITY PROBLEM · PS 26043</div><h1>Submit a problem statement</h1><p>Describe the issue naturally. Sahaya will later assist with domain, priority, duplicate, jurisdiction and capability analysis.</p></div><div className="limit-chip"><strong>{weekCount}/{CITIZEN_WEEKLY_LIMIT}</strong><span>used this week</span></div></div>
    {remaining === 0 ? <div className="limit-block"><div className="limit-block-icon">!</div><strong>Weekly submission limit reached</strong><p>You have already submitted {CITIZEN_WEEKLY_LIMIT} problem statements during <strong>{weekLabel()}</strong>. New submissions open next Monday.</p><Link className="secondary-button" to="/citizen">Return to Home</Link></div> : <>
      <div className="weekly-rule"><strong>Weekly rule:</strong> You may submit <b>up to {CITIZEN_WEEKLY_LIMIT} problem statements per week.</b> You have {remaining} remaining this week. A new week starts every Monday.</div>
      <div className="stepper">{["Describe", "Location", "Evidence", "Review & Submit"].map((label, i) => <div key={label} className={`stepper-item ${i + 1 === step ? "active" : ""} ${i + 1 < step ? "done" : ""}`}><span>{i + 1 < step ? "✓" : i + 1}</span><small>{label}</small></div>)}</div>
      <div className="report-card">
        {step === 1 && <div className="form-section"><SectionTitle title="Describe the problem" subtitle="Use everyday language. You do not need to understand technical categories." /><label>Problem statement / title<input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Example: Drinking water is unavailable in our village" maxLength={120} /></label><label>Description<textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Explain what is happening, where you noticed it and what the community is experiencing." rows="7" maxLength={2000} /><small className="field-help">{form.description.length}/2000 characters</small></label><div className="two-col"><label>Priority<select value={form.priority} onChange={(e) => update("priority", e.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select><small className="field-help">Your perception of urgency. Final priority may be assisted by reviewers.</small></label><label>Who is affected?<input value={form.affected} onChange={(e) => update("affected", e.target.value)} placeholder="Students, farmers, elderly residents..." /></label></div><label>How long has this been happening?<input value={form.duration} onChange={(e) => update("duration", e.target.value)} placeholder="Example: 6 months / every monsoon" /></label></div>}
        {step === 2 && <div className="form-section"><SectionTitle title="Where is the problem?" subtitle="Location helps the responsible government authority validate and route the challenge." /><div className="two-col"><label>District<select value={form.district} onChange={(e) => update("district", e.target.value)}>{["Ranchi","Dhanbad","Khunti","Jamshedpur","Hazaribagh","Gumla","Simdega","Deoghar","West Singhbhum","Bokaro","Dumka","Giridih"].map((d) => <option key={d}>{d}</option>)}</select></label><label>Village / Town / Ward<input value={form.locality} onChange={(e) => update("locality", e.target.value)} placeholder="Ward 12 / Village name / Panchayat" /></label></div><label>Specific location<input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Road, school, handpump, health centre, field, etc." /></label><label>Landmark (optional)<input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} placeholder="Near the primary school" /></label><div className="map-placeholder"><span>⌖</span><div><strong>Optional map location</strong><p>{form.mapLocation ? `Location captured: ${form.mapLocation}` : "Use your device location or leave this blank. Exact sensitive locations should not be exposed publicly."}</p></div><button type="button" className="secondary-button" onClick={useCurrentLocation}>{form.mapLocation ? "Update location" : "Use my location"}</button></div></div>}
        {step === 3 && <div className="form-section"><SectionTitle title="Add evidence" subtitle="Photos/videos are limited to 3 files in total. Supporting documents are separate." /><div className="upload-box" onClick={() => mediaInput.current?.click()}><div className="upload-icon">＋</div><strong>Add photos or videos</strong><p>JPG, PNG, MP4 and other browser-supported formats</p><span>{media.length}/3 selected · Maximum 3 total</span><input ref={mediaInput} hidden type="file" accept="image/*,video/*" multiple onChange={addMedia} /></div>{media.length > 0 && <div className="media-list">{media.map((file) => <div className="media-item" key={file.name}><span>{file.type.startsWith("video/") ? "▶" : "▧"}</span><div>{file.type.startsWith("image/") && <img className="media-thumb" src={file.url} alt="" />}<strong>{file.name}</strong><small>{file.type.startsWith("video/") ? "Video" : "Photo"} · {(file.size / 1024 / 1024).toFixed(2)} MB</small></div><button type="button" className="remove-button" onClick={() => removeMedia(file.name)}>Remove</button></div>)}</div>}
          <div className="evidence-secondary"><div className="voice-box"><div><strong>Voice message (optional)</strong><p>Explain the issue in your own words. You can record or upload an audio message.</p></div>{recording ? <button type="button" className="primary-button recording" onClick={stopRecording}>● Stop recording</button> : <button type="button" className="secondary-button" onClick={startRecording}>🎙 Record voice</button>}{voice && <div className="voice-ready">✓ {voice.name}{voice.url && <audio controls src={voice.url} />}</div>}<label className="audio-upload">Upload audio<input type="file" accept="audio/*" onChange={addVoiceFile} /></label></div>
          <div className="document-box"><div><strong>Supporting documents (optional)</strong><p>Reports, letters or other relevant evidence. These are private by default.</p></div><button type="button" className="secondary-button" onClick={() => documentInput.current?.click()}>＋ Add documents</button><input ref={documentInput} hidden type="file" multiple onChange={addDocuments} />{documents.length > 0 && <div className="document-list">{documents.map((file) => <div key={file.name}><span>▤</span><strong>{file.name}</strong><button type="button" className="remove-button" onClick={() => removeDocument(file.name)}>Remove</button></div>)}</div>}</div></div>
        </div>}
        {step === 4 && <ReviewSubmission form={form} media={media} documents={documents} voice={voice} />}
        
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="report-actions">{step > 1 ? <button className="secondary-button" type="button" onClick={() => setStep(step - 1)}>Back</button> : <Link className="secondary-button" to="/citizen">Cancel</Link>}{step < 4 ? <button className="primary-button" type="button" onClick={next}>Continue</button> : <button className="primary-button" type="button" onClick={submit}>Submit Problem Statement</button>}</div>
      </div>
    </>}
  </section>;
}
function SectionTitle({ title, subtitle }) { return <div className="section-title"><h2>{title}</h2><p>{subtitle}</p></div>; }
function ReviewSubmission({ form, media, documents, voice }) { const ai = mockAiAnalysis(form); return <div className="form-section"><SectionTitle title="Review & submit" subtitle="Check everything before sending your problem statement for Initial Screening." /><div className="review-grid"><ReviewItem label="Problem statement" value={form.title} /><ReviewItem label="Description" value={form.description} /><ReviewItem label="Priority" value={form.priority} /><ReviewItem label="Who is affected" value={form.affected || "Not specified"} /><ReviewItem label="Duration" value={form.duration || "Not specified"} /><ReviewItem label="Location" value={`${form.district} · ${form.locality} · ${form.location}${form.landmark ? ` · ${form.landmark}` : ""}`} /><ReviewItem label="Evidence" value={`${media.length}/3 photo/video files · ${documents.length} document(s)${voice ? " · voice message" : ""}`} /></div><div className="ai-preview"><div className="ai-label">AI-ASSISTED ANALYSIS · MOCK PREVIEW</div><div className="ai-grid"><div><span>Detected domain</span><strong>{ai.domain}</strong></div><div><span>Priority assistance</span><strong>{ai.priority}</strong></div><div><span>Duplicate candidates</span><strong>{ai.duplicateCandidates}</strong></div><div><span>Suggested jurisdiction</span><strong>{ai.suggestedJurisdiction}</strong></div><div className="wide"><span>Potential capabilities</span><strong>{ai.requiredCapabilities.join(" · ")}</strong></div><div><span>Confidence</span><strong>{ai.confidence}%</strong></div></div></div><div className="privacy-note"><strong>Privacy & safety:</strong> Public challenge views show the problem and appropriate location. Personal contact details, sensitive exact locations and private documents are restricted to authorized workflows.</div></div>; }
function ReviewItem({ label, value }) { return <div className="review-item"><span>{label}</span><strong>{value}</strong></div>; }

function CitizenChallengeDetail() {
  const { data, user } = useAuth(); const { id } = useParams();
  const challenge = data.mockChallenges.find((c) => c.id === id) || getCitizenSubmissions().find((c) => c.id === id);
  const [supported, setSupported] = useState(() => localStorage.getItem(`sahaya_support_${id}_${user.id}`) === "1");
  if (!challenge) return <section className="empty-page"><div className="empty-icon">?</div><h1>Challenge not found</h1><p>This challenge may have been removed or is not available to your account.</p><Link className="primary-button" to="/citizen/challenges">Back to Community Challenges</Link></section>;
  const toggleSupport = () => { const next = !supported; setSupported(next); localStorage.setItem(`sahaya_support_${id}_${user.id}`, next ? "1" : "0"); };
  const ai = challenge.aiAnalysis;
  return <section className="workspace challenge-detail-page">
    <div className="breadcrumb"><Link to="/citizen/challenges">Community Challenges</Link><span>›</span><span>{challenge.id}</span></div>
    <div className="detail-header"><div><div className="eyebrow">CHALLENGE {challenge.id}</div><h1>{challenge.title}</h1><p>{challenge.district} · {challenge.locality || "Community"} · {ai?.domain || challenge.domain || "Community issue"}</p></div><span className={`priority ${String(challenge.priority).toLowerCase()}`}>{challenge.priority} priority</span></div>
    <div className="detail-layout">
      <div className="detail-main">
        <section className="panel"><div className="panel-heading"><div><h2>Problem statement</h2><span>Community contribution</span></div><span>{challenge.status}</span></div><p className="detail-description">{challenge.description || "This community challenge was submitted to Sahaya for structured evaluation and collaborative resolution."}</p><div className="detail-facts"><div><span>People affected</span><strong>{(challenge.affectedPopulation || 0).toLocaleString()}</strong></div><div><span>District</span><strong>{challenge.district}</strong></div><div><span>Priority</span><strong>{challenge.priority}</strong></div><div><span>Submitted</span><strong>{new Date(challenge.createdAt).toLocaleDateString()}</strong></div></div></section>
        <section className="panel"><div className="panel-heading"><div><h2>Progress</h2><span>Every stage is visible</span></div><span>Transparent tracking</span></div><ChallengeProgress challenge={challenge} detailed /></section>
        {ai && <section className="panel"><div className="panel-heading"><div><h2>AI-assisted analysis</h2><span>Mock presentation only · not a real AI decision</span></div></div><div className="ai-grid detail-ai"><div><span>Detected domain</span><strong>{ai.domain}</strong></div><div><span>Category</span><strong>{ai.category}</strong></div><div><span>Priority assistance</span><strong>{ai.priority}</strong></div><div><span>Duplicate candidates</span><strong>{ai.duplicateCandidates}</strong></div><div><span>Suggested jurisdiction</span><strong>{ai.suggestedJurisdiction}</strong></div><div><span>Confidence</span><strong>{ai.confidence}%</strong></div><div className="wide"><span>Required capabilities</span><strong>{ai.requiredCapabilities.join(" · ")}</strong></div></div></section>}
        <section className="panel"><div className="panel-heading"><div><h2>What happens next?</h2><span>Shared challenge lifecycle</span></div></div><div className="next-steps"><div><span>01</span><div><strong>Government validation</strong><p>The responsible authority reviews the problem, evidence and jurisdiction.</p></div></div><div><span>02</span><div><strong>Resolution pathway</strong><p>The challenge may need government action, research, innovation, startup support or multi-stakeholder collaboration.</p></div></div><div><span>03</span><div><strong>Capability matching</strong><p>Universities, startups, MSMEs, industry, CSR and research labs can be invited when their capabilities are required.</p></div></div></div></section>
      </div>
      <aside className="detail-side"><section className="panel"><div className="panel-heading"><h2>Community signal</h2></div><p className="side-copy">If you are also affected, add your support as a community signal. Support helps show community relevance but does not automatically increase government priority.</p><button className={`secondary-button full ${supported ? "selected-button" : ""}`} onClick={toggleSupport}>{supported ? "✓ I'm also affected" : "I'm also affected"}</button></section><section className="panel"><div className="panel-heading"><h2>Evidence</h2></div><div className="evidence-summary"><strong>{challenge.mediaCount || 0}/3</strong><span>photos/videos</span><strong>{challenge.documents?.length || 0}</strong><span>documents</span><strong>{challenge.voiceMessage ? "Yes" : "No"}</strong><span>voice message</span></div></section><section className="panel"><div className="panel-heading"><h2>Public information</h2></div><ul className="detail-list"><li>Personal phone and email are not shown publicly.</li><li>Exact sensitive locations can remain private.</li><li>Private documents are shared only with authorized reviewers.</li></ul></section></aside>
    </div>
  </section>;
}

function CitizenNotifications() {
  const { data, user } = useAuth(); const notifications = data.mockNotifications.filter((n) => n.role === "citizen"); const submissions = getCitizenSubmissions(user.id); const dynamic = submissions.map((s) => ({ id: `local-${s.id}`, title: `${s.id} is now in Initial Screening`, body: `Your problem statement “${s.title}” has been received and is being screened.`, createdAt: s.createdAt, unread: true })); const items = [...dynamic, ...notifications];
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">NOTIFICATIONS</div><h1>Updates about your community problems</h1><p>Important status changes and ecosystem updates appear here.</p></div></div><div className="notification-list">{items.length ? items.map((n) => <article className={`notification-card ${n.unread ? "unread" : ""}`} key={n.id}><div className="notification-dot">•</div><div><strong>{n.title || n.message}</strong><p>{n.body || n.message || "Sahaya has an update for you."}</p><small>{new Date(n.createdAt || Date.now()).toLocaleString()}</small></div></article>) : <section className="panel"><EmptyState title="No notifications yet" text="You'll see status changes when your submitted challenges move through the Sahaya lifecycle." action="Report a Problem" href="/citizen/report" /></section>}</div></section>;
}
function CitizenProfile() { const { user } = useAuth(); return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">PROFILE</div><h1>Your citizen profile</h1><p>Manage the basic information used for your Sahaya account.</p></div></div><div className="profile-grid"><section className="panel profile-card"><div className="avatar">{user.name.split(" ").map((x) => x[0]).slice(0,2).join("")}</div><h2>{user.name}</h2><span className="status-badge">Citizen</span><div className="profile-fields"><div><span>Email / Mobile</span><strong>{user.email || user.contact || "Demo citizen account"}</strong></div><div><span>District</span><strong>{user.district || "Ranchi"}</strong></div></div></section><section className="panel"><div className="panel-heading"><h2>Privacy & submission policy</h2></div><ul className="check-list"><li>You can submit up to {CITIZEN_WEEKLY_LIMIT} problem statements per week.</li><li>Your personal contact details are not displayed on public challenge cards.</li><li>Exact sensitive locations and private documents are not public by default.</li><li>Government officers receive only information needed for validation and routing.</li><li>Prototype data is stored locally in this browser.</li></ul></section></div></section>; }
function CitizenChallenges() {
  const { data } = useAuth(); const [query, setQuery] = useState(""); const [district, setDistrict] = useState("All districts"); const [domain, setDomain] = useState("All domains"); const [priority, setPriority] = useState("All priorities"); const [status, setStatus] = useState("All statuses"); const [sort, setSort] = useState("priority");
  const challenges = data.mockChallenges.filter((c) => c.visibleTo.includes("citizen")); const domains = [...new Set(challenges.map((c) => c.domain).filter(Boolean))]; const districts = [...new Set(challenges.map((c) => c.district).filter(Boolean))];
  const priorityRank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const filtered = challenges.filter((c) => { const hay = `${c.title} ${c.description || ""} ${c.district} ${c.domain || ""}`.toLowerCase(); return (!query || hay.includes(query.toLowerCase())) && (district === "All districts" || c.district === district) && (domain === "All domains" || c.domain === domain) && (priority === "All priorities" || c.priority === priority) && (status === "All statuses" || c.status === status); }).sort((a,b) => sort === "priority" ? (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0) : sort === "impact" ? (b.affectedPopulation || 0) - (a.affectedPopulation || 0) : new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">COMMUNITY CHALLENGES</div><h1>Problems from communities</h1><p>Explore public challenges and understand their current status, priority and community impact.</p></div></div><section className="panel challenge-filters"><div className="filter-grid"><label>Search<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Water, school, waste..." /></label><label>District<select value={district} onChange={(e) => setDistrict(e.target.value)}><option>All districts</option>{districts.map((d) => <option key={d}>{d}</option>)}</select></label><label>Domain<select value={domain} onChange={(e) => setDomain(e.target.value)}><option>All domains</option>{domains.map((d) => <option key={d}>{d}</option>)}</select></label><label>Priority<select value={priority} onChange={(e) => setPriority(e.target.value)}><option>All priorities</option>{["Critical","High","Medium","Low"].map((p) => <option key={p}>{p}</option>)}</select></label><label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option>All statuses</option>{[...new Set(challenges.map((c) => c.status))].map((s) => <option key={s}>{s}</option>)}</select></label><label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="priority">Priority</option><option value="impact">Affected population</option><option value="recent">Most recent</option></select></label></div></section><div className="challenge-results-head"><strong>{filtered.length} challenge{filtered.length === 1 ? "" : "s"} found</strong><span>Community support is a signal, not an automatic priority score.</span></div>{filtered.length ? <div className="challenge-grid">{filtered.map((c) => <Link className="challenge-card" to={`/citizen/challenges/${c.id}`} key={c.id}><div className="challenge-card-top"><span className="challenge-id">{c.id}</span><span className={`priority ${String(c.priority).toLowerCase()}`}>{c.priority}</span></div><h3>{c.title}</h3><p>{c.district} · {c.domain || "Community issue"}</p><div className="challenge-impact"><strong>{(c.affectedPopulation || 0).toLocaleString()}</strong><span>people affected</span></div><div className="challenge-card-bottom"><span className="status-badge">{c.status}</span><span>View challenge →</span></div></Link>)}</div> : <section className="panel"><EmptyState title="No challenges match your filters." text="Try a different district, domain, status or search term." action="Clear filters" href="/citizen/challenges" /></section>}</section>;
}
function MyChallenges() { const { user } = useAuth(); const submissions = getCitizenSubmissions(user.id); return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">MY CHALLENGES</div><h1>Track your problem statements</h1><p>Follow every submission through screening, validation, matching, solution, pilot, implementation and impact.</p></div><Link className={`primary-button ${weeklySubmissionCount(submissions) >= CITIZEN_WEEKLY_LIMIT ? "disabled-button" : ""}`} to={weeklySubmissionCount(submissions) < CITIZEN_WEEKLY_LIMIT ? "/citizen/report" : "#"} onClick={(e) => { if (weeklySubmissionCount(submissions) >= CITIZEN_WEEKLY_LIMIT) e.preventDefault(); }}>+ Submit a Problem</Link></div><div className="limit-summary"><strong>{weeklySubmissionCount(submissions)}/{CITIZEN_WEEKLY_LIMIT} submissions used this week</strong><span>{CITIZEN_WEEKLY_LIMIT - weeklySubmissionCount(submissions)} remaining · resets next Monday</span></div>{submissions.length ? <div className="tracking-list">{submissions.map((c) => <div className="tracking-card" key={c.id}><ChallengeProgress challenge={c} detailed /></div>)}</div> : <section className="panel"><EmptyState title="You haven't submitted any challenges yet." text="Start by reporting a local problem that your community is facing." action="Report a Problem" href="/citizen/report" /></section>}</section>; }


function readUniversityStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(`sahaya_university_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}
function writeUniversityStorage(key, value) {
  localStorage.setItem(`sahaya_university_${key}`, JSON.stringify(value));
}
function useUniversityStorage(key, fallback) {
  const [value, setValue] = useState(() => readUniversityStorage(key, fallback));
  useEffect(() => { writeUniversityStorage(key, value); }, [key, value]);
  return [value, setValue];
}
function universityProjectFor(problemId, projects) {
  return projects.find((project) => project.problemId === problemId);
}
function UniversityProgress({ progress }) {
  const stages = ["Evaluation", "Team formation", "Proposal", "Approval", "Prototype", "Testing", "Pilot", "Implementation"];
  const active = Math.min(Math.floor(progress / 12.5), stages.length - 1);
  return <div className="university-progress"><div className="progress-card-head"><strong>Implementation progress</strong><span>{progress}%</span></div><div className="profile-progress"><span style={{ width: `${progress}%` }} /></div><div className="university-progress-stages">{stages.map((stage, i) => <span className={i <= active && progress > 0 ? "done" : i === active ? "current" : ""} key={stage}>{i < active ? "✓" : i === active && progress > 0 ? "●" : "○"} {stage}</span>)}</div></div>;
}
function UniversityProblemCard({ problem, implemented = false }) {
  return <article className="university-problem-card"><div className="problem-card-top"><span className="challenge-id">{problem.id}</span><span className={`priority ${String(problem.priority || "Medium").toLowerCase()}`}>{problem.status}</span></div><h3>{problem.title}</h3><p>{problem.district} · {problem.domain}</p><p className="problem-summary">{problem.summary}</p><div className="problem-meta-grid"><span><small>Complexity</small><strong>{problem.complexity || "Medium"}</strong></span><span><small>Submitted</small><strong>{problem.submittedAt || "Recently"}</strong></span><span><small>University match</small><strong>{problem.matchPercentage || 70}%</strong></span></div><div className="capability-chips">{(problem.requiredCapabilities || problem.capabilities || []).map((x) => <span key={x}>{x}</span>)}</div>{implemented ? <div className="implemented-facts"><span><strong>{problem.beneficiaries}</strong> beneficiaries</span><span>{problem.partners?.length || 0} partners</span></div> : <div className="implemented-facts"><span><strong>{(problem.affectedPopulation || 0).toLocaleString()}</strong> potentially affected</span><span>{problem.government}</span></div>}<UniversityProgress progress={problem.progress} />{!implemented && <div className="button-row left"><Link className="primary-button" to={`/university/problems/${problem.id}`}>Evaluate problem</Link><Link className="secondary-button" to={`/university/challenges#${problem.id}`}>View requirements</Link></div>}</article>;
}
function UniversityHome() {
  const [projects] = useUniversityStorage("projects", universityProjects);
  const [profile] = useUniversityStorage("profile", universityProfile);
  const profileDone = universityProfileSections.reduce((total, section) => total + (profile[section.key] || (section.key === "pastProjects" ? readUniversityStorage("documents", universityDocuments).pastProjects?.length : 0) ? section.weight : 0), 0);
  return <section className="workspace university-home"><div className="workspace-header"><div><div className="eyebrow">UNIVERSITY INNOVATION HUB · PS 26043</div><h1>What can our institution solve?</h1><p>Discover validated societal problems that match your departments, faculty, laboratories and previous implementation experience.</p></div><Link className="primary-button" to="/university/problems">View problems to implement</Link></div><div className="info-banner university-banner"><strong>Capability-first matching.</strong><span>Government routes the challenge to the right authority; your institution is considered separately based on expertise, facilities and implementation capacity.</span></div><div className="metric-grid"><Metric label="Problems to implement" value={universityProblems.length} /><Metric label="Accepted projects" value={projects.length} /><Metric label="Student teams" value={readUniversityStorage("teams", universityTeams).length} /><Metric label="Profile completion" value={`${Math.min(profileDone, 100)}%`} /></div><div className="university-grid"><section className="panel"><div className="panel-heading"><div><h2>Problems needing implementation</h2><span>Validated opportunities</span></div><Link className="text-link" to="/university/problems">View all</Link></div><div className="university-problem-list">{universityProblems.slice(0,2).map((p) => <UniversityProblemCard problem={p} key={p.id} />)}</div></section><section className="panel"><div className="panel-heading"><div><h2>Accepted implementation projects</h2><span>Active delivery work</span></div><Link className="text-link" to="/university/projects">View all</Link></div><div className="university-project-list">{projects.slice(0,2).map((project) => <UniversityProjectCard key={project.id} project={project} />)}</div></section></div><section className="panel"><div className="panel-heading"><div><h2>University profile progress</h2><span>Matching readiness</span></div><Link className="text-link" to="/university/profile">Complete profile</Link></div><div className="profile-progress"><span style={{ width: `${Math.min(profileDone, 100)}%` }} /></div><div className="profile-progress-labels"><strong>{Math.min(profileDone, 100)}% complete</strong><span>Profile and private evidence are persisted in this browser.</span></div></section></section>;
}
function UniversityProblemsPage({ implemented = false }) {
  const list = implemented ? implementedUniversityProblems : universityProblems;
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">{implemented ? "IMPLEMENTED PROBLEMS" : "PROBLEMS TO IMPLEMENT"}</div><h1>{implemented ? "Problems our institution has implemented" : "Validated problems that need implementation"}</h1><p>{implemented ? "Keep a record of completed societal solutions and the capabilities demonstrated." : "Review validated challenges and decide which ones fit your institution's capabilities."}</p></div>{!implemented && <Link className="secondary-button" to="/university/challenges">Browse all challenges</Link>}</div><div className="university-problem-grid">{list.map((p) => <UniversityProblemCard problem={p} implemented={implemented} key={p.id} />)}</div></section>;
}
function UniversityProfile() {
  const [profile, setProfile] = useUniversityStorage("profile", universityProfile);
  const [documents, setDocuments] = useUniversityStorage("documents", universityDocuments);
  const [saved, setSaved] = useState(false);
  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  const addDocuments = (category, event) => {
    const files = Array.from(event.target.files || []).map((file) => ({ name: file.name, size: file.size, type: file.type }));
    setDocuments((current) => ({ ...current, [category]: [...(current[category] || []), ...files] }));
    event.target.value = "";
  };
  const removeDocument = (category, name) => setDocuments((current) => ({ ...current, [category]: (current[category] || []).filter((file) => file.name !== name) }));
  const completed = universityProfileSections.reduce((total, section) => total + ((profile[section.key] || (documents[section.key] || []).length) ? section.weight : 0), 0);
  const fields = [["institution", "University name"], ["type", "Institution type"], ["state", "State"], ["district", "Location / district"], ["email", "Official email"], ["admin", "University administrator"], ["departments", "Departments"], ["faculty", "Faculty expertise"], ["capacity", "Student capacity"], ["technologyCapabilities", "Technology capabilities"], ["researchAreas", "Research areas"], ["labs", "Infrastructure"], ["pastProjects", "Past projects"], ["certifications", "Certifications"], ["awards", "Awards"], ["licenses", "Licenses"], ["patents", "Patents"]];
  const categories = [["pastProjects", "Past solved problems / projects"], ["licenses", "Licenses & registrations"], ["certifications", "Certifications"], ["awards", "Awards & recognition"], ["researchPapers", "Research papers"], ["patents", "Patents"], ["technologyCapabilities", "Technology capabilities"]];
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">UNIVERSITY PROFILE</div><h1>Institution capability profile</h1><p>Keep your profile and evidence up to date so matching recommendations have an explainable basis.</p></div><span className="status-badge">{completed}% complete</span></div><section className="panel profile-editor"><div className="panel-heading"><h2>Institution details</h2><span>Saved locally</span></div><div className="profile-form-grid">{fields.map(([key, label]) => <label key={key}>{label}{key === "type" ? <select value={profile[key] || ""} onChange={(e) => update(key, e.target.value)}><option>University / HEI</option><option>College</option><option>Research-focused institute</option></select> : <input value={profile[key] || ""} onChange={(e) => update(key, e.target.value)} />}</label>)}</div><div className="button-row left"><button className="primary-button" type="button" onClick={() => { writeUniversityStorage("profile", profile); setSaved(true); setTimeout(() => setSaved(false), 1800); }}>Save profile</button>{saved && <span className="save-confirmation">Profile saved</span>}</div></section><div className="profile-progress-card"><div className="panel-heading"><h2>Profile completion</h2><strong>{completed}%</strong></div><div className="profile-progress"><span style={{ width: `${completed}%` }} /></div><div className="profile-progress-list">{universityProfileSections.map((item) => <div key={item.key}><span>{profile[item.key] || (documents[item.key] || []).length ? "✓" : "○"}</span>{item.label}</div>)}</div></div><section className="panel"><div className="panel-heading"><h2>Private documents</h2><span>Only authorized reviewers can access these files</span></div><div className="document-category-grid">{categories.map(([key, title]) => <div className="registration-document" key={key}><strong>{title}</strong><label className="upload-inline"><span>＋ Add document</span><input type="file" multiple onChange={(e) => addDocuments(key, e)} /></label>{(documents[key] || []).map((file) => <div className="saved-document" key={file.name}><span>▤</span><strong>{file.name}</strong><button className="remove-button" type="button" onClick={() => removeDocument(key, file.name)}>Remove</button></div>)}</div>)}</div></section></section>;
}

function UniversityChallenges() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains"); const [district, setDistrict] = useState("All districts"); const [priority, setPriority] = useState("All priorities"); const [capability, setCapability] = useState("All capabilities"); const [sort, setSort] = useState("match");
  const domains = [...new Set(universityProblems.map((problem) => problem.domain))]; const districts = [...new Set(universityProblems.map((problem) => problem.district))]; const capabilities = [...new Set(universityProblems.flatMap((problem) => problem.requiredCapabilities))];
  const challenges = universityProblems.filter((problem) => `${problem.title} ${problem.domain} ${problem.district}`.toLowerCase().includes(query.toLowerCase()) && (domain === "All domains" || problem.domain === domain) && (district === "All districts" || problem.district === district) && (priority === "All priorities" || problem.priority === priority) && (capability === "All capabilities" || problem.requiredCapabilities.includes(capability))).sort((a, b) => sort === "date" ? new Date(b.submittedAt) - new Date(a.submittedAt) : (b.matchPercentage || 0) - (a.matchPercentage || 0));
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">UNIVERSITY CHALLENGE CATALOG</div><h1>Validated challenges matched to your capabilities</h1><p>Review the problem context, required capabilities and implementation expectations before evaluating an opportunity.</p></div><Link className="primary-button" to="/university/teams">Manage student teams</Link></div><section className="panel challenge-filters"><div className="filter-grid"><label>Search challenges<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Water, agriculture, waste..." /></label><label>Domain<select value={domain} onChange={(e) => setDomain(e.target.value)}><option>All domains</option>{domains.map((item) => <option key={item}>{item}</option>)}</select></label><label>District<select value={district} onChange={(e) => setDistrict(e.target.value)}><option>All districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label><label>Priority<select value={priority} onChange={(e) => setPriority(e.target.value)}><option>All priorities</option>{["Critical","High","Medium","Low"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Required capability<select value={capability} onChange={(e) => setCapability(e.target.value)}><option>All capabilities</option>{capabilities.map((item) => <option key={item}>{item}</option>)}</select></label><label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="match">Match percentage</option><option value="date">Date submitted</option></select></label></div></section><div className="challenge-results-head"><strong>{challenges.length} challenge{challenges.length === 1 ? "" : "s"} found</strong><span>Sorted by capability match</span></div><div className="university-problem-grid">{challenges.map((problem) => <UniversityProblemCard key={problem.id} problem={problem} />)}</div></section>;
}

function UniversityEvaluation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = universityProblems.find((item) => item.id === id);
  const [evaluations, setEvaluations] = useUniversityStorage("evaluations", []);
  const [decision, setDecision] = useState("Evaluate");
  const [notes, setNotes] = useState("");
  if (!problem) return <section className="empty-page"><div className="empty-icon">?</div><h1>Problem not found</h1><Link className="primary-button" to="/university/problems">Back to problems</Link></section>;
  const submit = (event) => {
    event.preventDefault();
    const record = { id: `EVAL-${Date.now()}`, problemId: problem.id, decision, notes, createdAt: new Date().toISOString() };
    setEvaluations((current) => [record, ...current.filter((item) => item.problemId !== problem.id)]);
    if (decision === "Accept for implementation") {
      const projects = readUniversityStorage("projects", universityProjects);
      if (!universityProjectFor(problem.id, projects)) {
        const milestones = [
          { id: "m1", title: "Confirm scope, baseline and field partners", status: "Not started", due: "15 Apr 2026" },
          { id: "m2", title: "Build and validate the first prototype", status: "Not started", due: "15 May 2026" },
          { id: "m3", title: "Run community pilot and document outcomes", status: "Not started", due: "30 Jun 2026" }
        ];
        const project = { id: `UPRJ-${Date.now()}`, problemId: problem.id, title: problem.title, status: "Accepted", phase: "Team formation", progress: 0, teamId: "", milestones };
        writeUniversityStorage("projects", [project, ...projects]);
        const notices = readUniversityStorage("notifications", []);
        writeUniversityStorage("notifications", [{ id: `UN-${Date.now()}`, title: `Implementation accepted: ${problem.title}`, body: "Assign a student team and start the first milestone.", unread: true, createdAt: new Date().toISOString() }, ...notices]);
        navigate(`/university/projects/${project.id}`);
        return;
      }
    }
    navigate("/university/problems");
  };
  const existing = evaluations.find((item) => item.problemId === problem.id);
  return <section className="workspace"><div className="breadcrumb"><Link to="/university/problems">Problems to implement</Link><span>›</span><span>{problem.id}</span></div><div className="detail-header"><div><div className="eyebrow">EVALUATE OPPORTUNITY</div><h1>{problem.title}</h1><p>{problem.district} · {problem.domain} · {problem.government}</p></div><span className={`priority ${String(problem.priority).toLowerCase()}`}>{problem.priority} priority</span></div><div className="detail-layout"><div className="detail-main"><section className="panel"><div className="panel-heading"><h2>Complete problem brief</h2><span>{problem.status}</span></div><p className="detail-description">{problem.description || problem.summary}</p><div className="detail-facts"><div><span>Location</span><strong>{problem.district}</strong></div><div><span>Affected people</span><strong>{problem.affectedPopulation.toLocaleString()}</strong></div><div><span>Priority</span><strong>{problem.priority}</strong></div><div><span>Submitted</span><strong>{problem.submittedAt || "Recently"}</strong></div></div><h3>Evidence</h3><ul className="detail-list">{(problem.evidence || ["Evidence available to authorized reviewers"]).map((item) => <li key={item}>{item}</li>)}</ul><h3>Required capabilities</h3><div className="capability-chips evaluation-capabilities">{problem.requiredCapabilities.map((capability) => <span key={capability}>{capability}</span>)}</div><div className="ai-preview"><div className="ai-label">AI CLASSIFICATION · MOCK</div><div className="ai-grid"><div><span>Domain</span><strong>{problem.domain}</strong></div><div><span>Complexity</span><strong>{problem.complexity || "Medium"}</strong></div><div><span>University match</span><strong>{problem.matchPercentage || 70}%</strong></div><div><span>Duplicates</span><strong>{problem.duplicateInformation || "No duplicate information"}</strong></div><div className="wide"><span>Suggested solution direction</span><strong>{problem.suggestedSolution || problem.summary}</strong></div></div></div></section><section className="panel"><div className="panel-heading"><h2>Evaluation decision</h2><span>Action required</span></div><form onSubmit={submit}><label>Action<select value={decision} onChange={(e) => setDecision(e.target.value)}><option>Evaluate</option><option>Accept for implementation</option><option>Reject</option><option>Request more information</option></select></label><label>Notes for the Sahaya coordination team<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the department, lab or field capacity you would bring..." /></label><div className="button-row left"><button className="primary-button" type="submit">Save action</button><Link className="secondary-button" to="/university/problems">Cancel</Link></div></form>{existing && <p className="field-help">Last decision: {existing.decision} · {new Date(existing.createdAt).toLocaleDateString()}</p>}</section></div><aside className="detail-side"><section className="panel"><div className="panel-heading"><h2>Government / jurisdiction</h2></div><p className="side-copy"><strong>{problem.government}</strong> is responsible for validation and coordination in {problem.district}.</p></section><section className="panel"><div className="panel-heading"><h2>Evaluation checklist</h2></div><ul className="check-list"><li>Review required capabilities and affected population.</li><li>Confirm a faculty lead and student team can be assigned.</li><li>Record constraints before accepting the opportunity.</li><li>Accepted opportunities become implementation projects.</li></ul></section></aside></div></section>;
}

function UniversityProjectCard({ project }) {
  const problem = universityProblems.find((item) => item.id === project.problemId);
  return <Link className="project-card" to={`/university/projects/${project.id}`}><div className="project-card-head"><span className="challenge-id">{project.id}</span><span className="status-badge">{project.status}</span></div><h3>{project.title}</h3><p>{problem ? `${problem.district} · ${problem.domain}` : "University implementation project"}</p><div className="implementation-row"><span>{project.phase}</span><strong>{project.progress}%</strong></div><div className="profile-progress"><span style={{ width: `${project.progress}%` }} /></div><small>{project.milestones?.filter((milestone) => milestone.status === "Complete").length || 0} of {project.milestones?.length || 0} milestones complete · {project.teamId ? "Team assigned" : "Team needed"}</small></Link>;
}

function UniversityProjects() {
  const [projects] = useUniversityStorage("projects", universityProjects);
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">ACCEPTED IMPLEMENTATION PROJECTS</div><h1>Projects owned by the university</h1><p>Accepted opportunities become trackable projects with a student team, milestones and evidence of impact.</p></div><Link className="secondary-button" to="/university/problems">Accept another problem</Link></div>{projects.length ? <div className="project-grid">{projects.map((project) => <UniversityProjectCard key={project.id} project={project} />)}</div> : <section className="panel"><EmptyState title="No accepted projects yet" text="Evaluate a validated problem to create your first implementation project." action="Browse problems" href="/university/problems" /></section>}</section>;
}

function UniversityProjectDetail() {
  const { id } = useParams();
  const [projects, setProjects] = useUniversityStorage("projects", universityProjects);
  const [teams] = useUniversityStorage("teams", universityTeams);
  const project = projects.find((item) => item.id === id);
  if (!project) return <section className="empty-page"><div className="empty-icon">?</div><h1>Project not found</h1><Link className="primary-button" to="/university/projects">Back to projects</Link></section>;
  const problem = universityProblems.find((item) => item.id === project.problemId);
  const updateProject = (changes) => setProjects((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  const assignTeam = (event) => updateProject({ teamId: event.target.value, phase: event.target.value ? "Prototype" : "Team formation" });
  const toggleMilestone = (milestoneId) => {
    const milestones = project.milestones.map((milestone) => milestone.id === milestoneId ? { ...milestone, status: milestone.status === "Completed" ? "In Progress" : "Completed", progress: milestone.status === "Completed" ? 0 : 100 } : milestone);
    const progress = Math.round((milestones.filter((milestone) => milestone.status === "Completed").length / milestones.length) * 100);
    updateProject({ milestones, progress, phase: progress === 100 ? "Implementation" : progress > 0 ? "Prototype" : project.phase, status: progress === 100 ? "Completed" : "Active" });
  };
  const stages = ["Problem Accepted", "Requirement Analysis", "Solution Design", "Prototype", "Testing", "Pilot", "Deployment", "Completed"]; const activeStage = project.status === "Completed" ? 7 : Math.min(Math.floor(project.progress / 15), 6);
  return <section className="workspace"><div className="breadcrumb"><Link to="/university/projects">Projects</Link><span>›</span><span>{project.id}</span></div><div className="workspace-header"><div><div className="eyebrow">IMPLEMENTATION PROJECT</div><h1>{project.title}</h1><p>{problem ? `${problem.id} · ${problem.government}` : "University-led societal implementation"}</p></div><span className="status-badge">{project.status}</span></div><div className="project-detail-grid"><div className="detail-main"><section className="panel"><div className="panel-heading"><h2>Project progress timeline</h2><strong>{project.progress}%</strong></div><div className="stage-timeline">{stages.map((stage, index) => <div className={index <= activeStage ? "stage-item active" : "stage-item"} key={stage}><span>{index < activeStage ? "✓" : index === activeStage ? "●" : index + 1}</span><small>{stage}</small></div>)}</div><div className="profile-progress"><span style={{ width: `${project.progress}%` }} /></div><p className="field-help">{project.phase} · Expected completion: {project.expectedCompletion || "30 Jun 2026"}</p></section><section className="panel"><div className="panel-heading"><h2>Project brief</h2><span>{problem?.domain || "Societal innovation"}</span></div><p className="detail-description">{project.description || problem?.description || problem?.summary}</p><div className="detail-facts"><div><span>Faculty coordinator</span><strong>{project.facultyCoordinator || "To be assigned"}</strong></div><div><span>Department</span><strong>{project.department || "Multidisciplinary"}</strong></div><div><span>Resources</span><strong>{project.requiredResources || "Field access, lab and student team"}</strong></div></div></section><section className="panel"><div className="panel-heading"><h2>Milestones</h2><span>{project.milestones.length} delivery checkpoints</span></div><div className="milestone-list">{project.milestones.map((milestone) =>   <label className={`milestone-row ${milestone.status === "Completed" || milestone.status === "Complete" ? "complete" : ""}`} key={milestone.id}><input type="checkbox" checked={milestone.status === "Completed" || milestone.status === "Complete"} onChange={() => toggleMilestone(milestone.id)} /><span><strong>{milestone.title}</strong><small>{milestone.description || "Delivery checkpoint"} · Due {milestone.due} · {milestone.status}</small></span></label>)}</div></section></div><aside className="detail-side"><section className="panel"><div className="panel-heading"><h2>Student team</h2><Link className="text-link" to="/university/teams">Manage</Link></div><label>Assign a team<select value={project.teamId || ""} onChange={assignTeam}><option value="">Choose a student team</option>{teams.map((team) => <option key={team.id} value={team.id}>{team.name} · {team.members} students</option>)}</select></label>{project.teamId && <p className="field-help">{teams.find((team) => team.id === project.teamId)?.capabilities.join(" · ")}</p>}</section><section className="panel"><div className="panel-heading"><h2>Next action</h2></div><p className="side-copy">{project.progress === 100 ? "All milestones are complete. Add implementation evidence to close the project." : project.teamId ? "Work with the assigned team and mark each verified milestone complete." : "Assign a multidisciplinary team before starting delivery."}</p></section></aside></div></section>;
}

function UniversityTeams() {
  const [teams, setTeams] = useUniversityStorage("teams", universityTeams);
  const [name, setName] = useState("");
  const [lead, setLead] = useState("");
  const [capabilities, setCapabilities] = useState("");
  const [student, setStudent] = useState({ name: "", id: "", department: "", year: "", skills: "", role: "Team Lead" });
  const addTeam = (event) => {
    event.preventDefault();
    if (!name.trim() || !lead.trim()) return;
    const member = student.name.trim() ? [{ ...student, name: student.name.trim(), skills: student.skills.split(",").map((item) => item.trim()).filter(Boolean) }] : [];
    setTeams((current) => [...current, { id: `TEAM-U-${Date.now()}`, name: name.trim(), lead: lead.trim(), members: member.length, memberDetails: member, capabilities: capabilities.split(",").map((item) => item.trim()).filter(Boolean), availability: "Available" }]);
    setName(""); setLead(""); setCapabilities(""); setStudent({ name: "", id: "", department: "", year: "", skills: "", role: "Team Lead" });
  };
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">STUDENT TEAMS</div><h1>Build implementation capacity</h1><p>Create multidisciplinary teams and assign them to accepted projects.</p></div><Link className="secondary-button" to="/university/projects">View projects</Link></div><div className="team-layout"><section className="panel"><div className="panel-heading"><h2>Teams on record</h2><span>{teams.length} teams</span></div><div className="team-list">{teams.map((team) => <article className="team-card" key={team.id}><div className="team-card-head"><div className="team-avatar">{team.name.slice(0, 1)}</div><div><h3>{team.name}</h3><p>Faculty lead: {team.lead}</p></div></div><div className="capability-chips">{team.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div>{team.memberDetails?.map((item) => <small key={item.id || item.name}>{item.name} · {item.role} · {item.department} · Year {item.year}</small>)}<small>{team.members} students · {team.availability}</small></article>)}</div></section><section className="panel"><div className="panel-heading"><h2>Create a student team</h2><span>Persisted locally</span></div><form onSubmit={addTeam}><label>Team name<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Rural Water Studio" /></label><label>Faculty lead<input value={lead} onChange={(e) => setLead(e.target.value)} required placeholder="Name and department" /></label><label>Capabilities<input value={capabilities} onChange={(e) => setCapabilities(e.target.value)} placeholder="Comma-separated capabilities" /></label><div className="section-title"><h2>Add student</h2><p>Optionally add the first member while creating the team.</p></div><label>Student name<input value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} placeholder="Student name" /></label><label>Student ID<input value={student.id} onChange={(e) => setStudent({ ...student, id: e.target.value })} placeholder="Student ID" /></label><div className="two-col"><label>Department<input value={student.department} onChange={(e) => setStudent({ ...student, department: e.target.value })} /></label><label>Year<input value={student.year} onChange={(e) => setStudent({ ...student, year: e.target.value })} /></label></div><label>Skills<input value={student.skills} onChange={(e) => setStudent({ ...student, skills: e.target.value })} placeholder="AI, GIS, field research" /></label><label>Role<select value={student.role} onChange={(e) => setStudent({ ...student, role: e.target.value })}>{["Team Lead","Developer","Researcher","UI/UX","Data/AI","Field Coordinator"].map((item) => <option key={item}>{item}</option>)}</select></label><button className="primary-button" type="submit">Add student team</button></form></section></div></section>;
}

function UniversityNotifications() {
  const defaults = mockNotifications.filter((notification) => notification.role === "university").map((notification) => ({ ...notification, unread: true }));
  const [notifications, setNotifications] = useUniversityStorage("notifications", []);
  const items = [...notifications, ...defaults.filter((item) => !notifications.some((notification) => notification.id === item.id))];
  const markRead = (id) => setNotifications((current) => current.some((notification) => notification.id === id) ? current.map((notification) => notification.id === id ? { ...notification, unread: false } : notification) : [...current, { ...defaults.find((notification) => notification.id === id), unread: false }]);
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">UNIVERSITY NOTIFICATIONS</div><h1>Updates for your institution</h1><p>Evaluation decisions, project actions and matching opportunities appear here.</p></div><span className="status-badge">{items.filter((item) => item.unread).length} unread</span></div><div className="notification-list">{items.length ? items.map((item) => <article className={`notification-card ${item.unread ? "unread" : ""}`} key={item.id} onClick={() => markRead(item.id)}><div className="notification-dot">•</div><div><strong>{item.title || item.message}</strong><p>{item.body || item.message || "Sahaya has an update for your institution."}</p><small>{new Date(item.createdAt || Date.now()).toLocaleString()} · {item.unread ? "Click to mark read" : "Read"}</small></div></article>) : <section className="panel"><EmptyState title="No notifications yet" text="New capability matches and project updates will appear here." action="Browse challenges" href="/university/challenges" /></section>}</div></section>;
}


function StartupProblemCard({ problem, implemented = false }) {
  return <article className="university-problem-card"><div className="problem-card-top"><span className="challenge-id">{problem.id}</span><span className={`priority ${String(problem.priority).toLowerCase()}`}>{problem.status}</span></div><h3>{problem.title}</h3><p>{problem.district} · {problem.domain}</p><div className="capability-tags">{problem.requiredCapabilities.map(c => <span key={c}>{c}</span>)}</div><div className="implementation-row"><span>Implementation progress</span><strong>{problem.progress}%</strong></div><div className="profile-progress"><span style={{width:`${problem.progress}%`}} /></div><div className="problem-meta"><span>Authority: {problem.authority}</span><span>{implemented ? "Implemented" : "Opportunity"}</span></div>{!implemented && <button className="secondary-button" type="button">Evaluate opportunity</button>}</article>;
}
function StartupProgress({ progress }) {
  const stages = ["Evaluation","Interest","Proposal","Approval","Pilot","Deployment","Impact"];
  const active = Math.min(Math.floor(progress / (100 / stages.length)), stages.length - 1);
  return <div className="university-progress"><div className="profile-progress"><span style={{width:`${progress}%`}} /></div><div className="progress-percent">{progress}% complete</div><div className="lifecycle">{stages.map((stage,i)=><div className={i<active?"lifecycle-step current":i===active&&progress>0?"lifecycle-step current":"lifecycle-step"} key={stage}><span>{i<active?"✓":i===active&&progress>0?"●":"○"}</span>{stage}</div>)}</div></div>;
}
function StartupHome() {
  const needs = mockChallenges.filter((challenge) => challenge.visibleTo?.includes("startup")).length, implemented = implementedStartupProblems.length;
  const { user } = useAuth();
  const interests = (() => { try { const saved = JSON.parse(localStorage.getItem("sahaya_startup_interests") || "[]"); return Array.isArray(saved) ? saved.filter((item) => item.startupId === user.id) : []; } catch { return []; } })();
  const completed = startupProfileSections.slice(0,5).reduce((a,b)=>a+b.weight,0);
  return <section className="workspace university-home"><div className="workspace-header"><div><div className="eyebrow">STARTUP OPPORTUNITY HUB · PS 26043</div><h1>Where can our technology create impact?</h1><p>Discover validated societal problems that need technology, pilots and deployment.</p></div><span className="status-badge">Startup workspace</span></div>
  <div className="metric-grid"><Metric label="Available opportunities" value={needs}/><Metric label="Interests submitted" value={interests.length}/><Metric label="Under review" value={interests.filter((item) => item.status === "Under Review").length}/><Metric label="Profile completion" value={`${completed}%`}/></div>
  <div className="university-grid">  <section className="panel"><div className="panel-heading"><div><h2>Available opportunities</h2><span>Shared challenges for solver participation</span></div><Link className="text-link" to="/startup/problems">Browse all</Link></div><div className="university-problem-list">{mockChallenges.filter((challenge) => challenge.visibleTo?.includes("startup")).slice(0,2).map((problem) => <StartupProblemCard problem={{ ...problem, matchPercentage: 70, summary: problem.description || "Shared societal challenge available for solution participation." }} key={problem.id}/>)}</div></section>
  <section className="panel"><div className="panel-heading"><div><h2>Implemented problems</h2><span>Past deployments</span></div><Link className="text-link" to="/startup/implemented">View all</Link></div><div className="university-problem-list">{implementedStartupProblems.slice(0,1).map(p=><StartupProblemCard problem={p} implemented key={p.id}/>)}</div></section></div>
  <section className="panel"><div className="panel-heading"><div><h2>Startup profile progress</h2><span>Matching readiness</span></div><strong>{completed}%</strong></div><StartupProgress progress={completed}/><p className="field-help">Complete technology, product, deployment and document details so Sahaya can recommend better opportunities.</p></section></section>;
}
function StartupProblemsPage({ implemented=false }) { const { user } = useAuth(); return <StartupChallengesPage user={user} implemented={implemented} />; }
function StartupProfile() {
 const progress=startupProfileSections.slice(0,5).reduce((a,b)=>a+b.weight,0);
 return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">STARTUP PROFILE</div><h1>Capability & registration progress</h1><p>Keep your technology, deployment evidence and documents ready for capability matching.</p></div><strong className="status-badge">{progress}% complete</strong></div><section className="panel"><div className="panel-heading"><h2>Profile progress</h2><strong>{progress}%</strong></div><div className="profile-progress"><span style={{width:`${progress}%`}} /></div><div className="profile-progress-list">{startupProfileSections.map((x,i)=><div key={x.key}>{i<5?"✓":"○"} {x.label}</div>)}</div></section><section className="panel"><div className="panel-heading"><h2>Documents</h2><span>Private verification evidence</span></div><div className="document-grid"><div className="upload-box"><strong>Already solved problems / past deployments</strong><span>Project reports, case studies, deployment evidence</span><input type="file" multiple /></div><div className="upload-box"><strong>Licenses & registrations</strong><span>Business and statutory documents</span><input type="file" multiple /></div><div className="upload-box"><strong>Certifications</strong><span>Technology, quality or industry certifications</span><input type="file" multiple /></div><div className="upload-box"><strong>Awards & recognition</strong><span>Startup awards, innovation recognition and achievements</span><input type="file" multiple /></div></div></section></section>;
}
function StartupChallengeRoute() { const { user } = useAuth(); return <StartupChallengeDetails user={user} />; }
function StartupInterestsRoute() { const { user } = useAuth(); return <StartupInterests user={user} />; }
function IndustryHomeRoute() { const { user } = useAuth(); return <IndustryHome user={user} />; }
function IndustryChallengeRoute() { const { user } = useAuth(); return <IndustryChallengeDetails user={user} />; }
function IndustryInterestsRoute() { const { user } = useAuth(); return <IndustryInterests user={user} />; }
function IndustryProfileRoute() { const { user } = useAuth(); return <IndustryProfile user={user} />; }
function ResearchLabHomeRoute() { const { user } = useAuth(); return <ResearchLabHome user={user} />; }
function ResearchLabChallengeRoute() { const { user } = useAuth(); return <ResearchLabChallengeDetails user={user} />; }
function ResearchLabInterestsRoute() { const { user } = useAuth(); return <ResearchLabInterests user={user} />; }
function ResearchLabProfileRoute() { const { user } = useAuth(); return <ResearchLabProfile user={user} />; }
function readCommunityStorage(key, fallback) { try { const saved = localStorage.getItem(`sahaya_community_${key}`); return saved ? JSON.parse(saved) : fallback; } catch { return fallback; } }
function writeCommunityStorage(key, value) { localStorage.setItem(`sahaya_community_${key}`, JSON.stringify(value)); }
function useCommunityStorage(key, fallback) { const [value, setValue] = useState(() => readCommunityStorage(key, fallback)); useEffect(() => { writeCommunityStorage(key, value); }, [key, value]); return [value, setValue]; }
function communityChallengesFor(userId) { const local = readCommunityStorage("challenges", []); const merged = [...local, ...communityOrganizationChallenges]; return merged.filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index && (!userId || item.submittedBy === userId || communityOrganizationChallenges.includes(item))); }
function communityLifecycleIndex(status) { const value = String(status || "").toLowerCase(); if (value.includes("resolved")) return 5; if (value.includes("implementation")) return 4; if (value.includes("collaboration") || value.includes("matching")) return 3; if (value.includes("validated")) return 2; if (value.includes("review") || value.includes("screening")) return 1; return 0; }
function communityMessage(index) { return ["Your challenge is recorded with the community evidence you provided.", "Sahaya is checking completeness, relevance and responsible jurisdiction.", "The challenge is validated and ready for a coordinated response.", "Potential partners are discussing capability, scope and community safeguards.", "A partner team is delivering the agreed intervention with community feedback.", "The outcome has been recorded and the challenge is closed."][index]; }
function CommunityProgress({ challenge, detailed = false }) { const current = communityLifecycleIndex(challenge.status); return <div className={`progress-card ${detailed ? "progress-detailed" : ""}`}><div className="progress-card-head"><div><span className="challenge-id">{challenge.id}</span><h3>{challenge.title}</h3><p>{challenge.district} · {challenge.locality || "Community"} · Priority: <strong>{challenge.priority}</strong></p></div><span className="status-badge">{challenge.status}</span></div><div className="community-progress-track">{communityOrganizationLifecycle.map((stage, index) => <div className={`community-progress-step ${index < current ? "done" : ""} ${index === current ? "current" : ""}`} key={stage}><span>{index < current ? "✓" : index + 1}</span><small>{stage}</small></div>)}</div><div className="progress-explain"><strong>Current stage: {challenge.status}</strong><span>{communityMessage(current)}</span></div>{detailed && <div className="timeline-list">{communityOrganizationLifecycle.map((stage, index) => <div className={`timeline-row ${index < current ? "done" : ""} ${index === current ? "current" : ""}`} key={stage}><div className="timeline-marker">{index < current ? "✓" : index === current ? "●" : "○"}</div><div><strong>{stage}</strong><p>{index === current ? communityMessage(current) : index < current ? "This stage was recorded in the Sahaya workflow." : "This stage will become active after the previous review."}</p></div></div>)}</div>}</div>; }
function CommunityProfileMeter() { const { user } = useAuth(); const profile = readCommunityStorage("profile", { ...communityOrganizationProfile, ...user }); const documents = readCommunityStorage("documents", communityOrganizationProfile.documents); const completed = communityOrganizationProfileSections.reduce((total, section) => total + ((section.key === "documents" ? Object.values(documents || {}).some((files) => files?.length) : profile[section.key]) ? section.weight : 0), 0); return <><div className="profile-progress"><span style={{ width: `${completed}%` }} /></div><div className="profile-progress-labels"><strong>{completed}% complete</strong><span>Complete the profile to help partners understand your mandate.</span></div></>; }
function CommunityHome() { const { user } = useAuth(); const challenges = communityChallengesFor(user.id); const collaborations = readCommunityStorage("collaborations", communityOrganizationCollaborations); const counts = (predicate) => challenges.filter(predicate).length; return <section className="workspace community-home"><div className="workspace-header"><div><div className="eyebrow">COMMUNITY ORGANIZATION HUB · PS 26043</div><h1>Community evidence, organized for action.</h1><p>Submit lived problems with context, follow reviews and work with the right partners without losing community ownership.</p></div><Link className="primary-button" to="/community-organization/report">+ Report a Challenge</Link></div><div className="info-banner community-banner"><strong>Community-led reporting.</strong><span>Your context, existing attempts and trusted contacts travel with the challenge so reviewers can respond responsibly.</span></div><div className="metric-grid"><Metric label="Challenges submitted" value={counts((c) => c.submittedBy === user.id)} /><Metric label="Under review" value={counts((c) => /review|submitted|validated/i.test(c.status))} /><Metric label="In implementation" value={counts((c) => /implementation/i.test(c.status))} /><Metric label="Resolved" value={counts((c) => /resolved/i.test(c.status))} /></div><div className="community-action-grid"><Link className="action-card" to="/community-organization/report"><span className="action-icon">＋</span><div><strong>Report a community challenge</strong><p>Share context, evidence, existing attempts and safe contacts.</p></div><b>→</b></Link><Link className="action-card" to="/community-organization/collaborations"><span className="action-icon">↔</span><div><strong>Manage collaborations</strong><p>See universities, startups and authorities connected to your work.</p></div><b>→</b></Link></div><div className="community-grid"><section className="panel"><div className="panel-heading"><div><h2>Recent challenge activity</h2><span>Traceable lifecycle</span></div><Link className="text-link" to="/community-organization/challenges">View all</Link></div><div className="tracking-list">{challenges.slice(0, 3).map((challenge) => <Link className="tracking-card community-tracking-link" to={`/community-organization/challenges/${challenge.id}`} key={challenge.id}><CommunityProgress challenge={challenge} /></Link>)}</div></section><section className="panel"><div className="panel-heading"><div><h2>Collaboration pulse</h2><span>{collaborations.length} connections</span></div><Link className="text-link" to="/community-organization/collaborations">View</Link></div><div className="challenge-list">{collaborations.slice(0, 4).map((item) => <div className="challenge-row" key={item.id}><div><strong>{item.partner}</strong><p>{item.title} · {item.status}</p></div><span className="status-badge">{item.type}</span></div>)}</div></section></div><section className="panel"><div className="panel-heading"><div><h2>Community organization readiness</h2><span>Keep your public identity and private documents current</span></div><Link className="text-link" to="/community-organization/profile">Manage profile</Link></div><CommunityProfileMeter /></section></section>; }

function CommunityReport() {
  const { user } = useAuth(); const navigate = useNavigate(); const [step, setStep] = useState(1); const [error, setError] = useState(""); const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", domain: "Water & Sanitation", priority: "Medium", district: "Ranchi", locality: "", affectedPopulation: "", communityContext: "", existingAttempts: "", requestedSupport: "", contactName: user.name || "", contactEmail: user.email || "", contactPhone: "" }); const [media, setMedia] = useState([]); const [documents, setDocuments] = useState([]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const addMedia = (event) => { const selected = Array.from(event.target.files || []); if (media.length + selected.length > 3) { setError("A challenge can include a maximum of 3 photos or videos."); event.target.value = ""; return; } if (selected.some((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"))) { setError("Only photos and videos can be added as challenge media."); return; } setError(""); setMedia((current) => [...current, ...selected.map((file) => ({ name: file.name, type: file.type, size: file.size }))]); event.target.value = ""; };
  const next = () => { setError(""); if (step === 1 && (!form.title.trim() || !form.description.trim())) return setError("Add a clear challenge title and description."); if (step === 2 && (!form.district || !form.locality.trim() || !form.communityContext.trim())) return setError("Add the community location and context."); if (step === 3 && (!form.existingAttempts.trim() || !form.contactName.trim() || !form.contactEmail.trim())) return setError("Add existing attempts and a trusted contact."); setStep((current) => Math.min(4, current + 1)); };
  const submit = () => { const number = communityChallengesFor().length + 1; const challenge = { id: `CO-2026-${String(number).padStart(3, "0")}`, ...form, title: form.title.trim(), description: form.description.trim(), affectedPopulation: Number(form.affectedPopulation) || 0, status: "Submitted", submittedBy: user.id, createdAt: new Date().toISOString(), mediaCount: media.length, media, documents, contacts: `${form.contactName} · ${form.contactEmail}${form.contactPhone ? ` · ${form.contactPhone}` : ""}`, visibleTo: ["community_organization", "citizen", "local_body", "government_agency", "university", "startup", "industry", "research_lab"], requiredCapabilities: ["Community Operations"] }; writeCommunityStorage("challenges", [challenge, ...readCommunityStorage("challenges", [])]); writeCommunityStorage("notifications", [{ id: `CON-${Date.now()}`, title: `${challenge.id} submitted`, body: `${challenge.title} is now queued for review.`, createdAt: challenge.createdAt, unread: true }, ...readCommunityStorage("notifications", [])]); setSubmitted(challenge); };
  if (submitted) return <section className="center-page"><div className="success-card submission-success"><div className="success-icon">✓</div><div className="eyebrow">CHALLENGE SUBMITTED</div><h1>Community challenge received</h1><p>Your organization’s challenge is now in <strong>Submitted</strong> status. Reviewers can see the problem, community context and evidence you chose to share.</p><div className="submission-id"><span>Generated challenge ID</span><strong>{submitted.id}</strong></div><CommunityProgress challenge={submitted} /><div className="button-row"><button className="primary-button" onClick={() => navigate("/community-organization")}>Back to overview</button><Link className="secondary-button" to="/community-organization/challenges">Track challenges</Link></div></div></section>;
  return <section className="report-page community-report"><div className="report-header"><div><div className="eyebrow">COMMUNITY ORGANIZATION · CHALLENGE INTAKE</div><h1>Report a community challenge</h1><p>Capture the community's experience and what has already been tried. This is an organization workflow, not an individual citizen report.</p></div><span className="limit-chip">Private context protected</span></div><div className="stepper community-stepper">{["Challenge", "Community context", "Attempts & contacts", "Review & submit"].map((label, index) => <div className={`stepper-item ${index + 1 === step ? "active" : ""} ${index + 1 < step ? "done" : ""}`} key={label}><span>{index + 1 < step ? "✓" : index + 1}</span><small>{label}</small></div>)}</div><div className="report-card">
    {step === 1 && <div className="form-section"><SectionTitle title="What challenge is the community facing?" subtitle="Use a specific title and explain the lived experience." /><label>Challenge title<input value={form.title} onChange={(event) => update("title", event.target.value)} maxLength={120} placeholder="Example: Safe drinking water for summer months" /></label><label>Description<textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows="7" maxLength={2500} placeholder="What is happening, who experiences it and what would improve?" /></label><div className="two-col"><label>Domain<select value={form.domain} onChange={(event) => update("domain", event.target.value)}>{["Water & Sanitation", "Livelihoods", "Health & Nutrition", "Education", "Accessibility", "Environment", "Public Services", "Other"].map((domain) => <option key={domain}>{domain}</option>)}</select></label><label>Community priority<select value={form.priority} onChange={(event) => update("priority", event.target.value)}>{["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority}>{priority}</option>)}</select></label></div><label>Estimated people / households affected<input type="number" min="0" value={form.affectedPopulation} onChange={(event) => update("affectedPopulation", event.target.value)} placeholder="Approximate number" /></label></div>}
    {step === 2 && <div className="form-section"><SectionTitle title="Add community context" subtitle="Context helps reviewers understand local priorities and avoid duplicate interventions." /><div className="two-col"><label>District<select value={form.district} onChange={(event) => update("district", event.target.value)}>{["Ranchi", "Khunti", "Dhanbad", "Jamshedpur", "Hazaribagh", "Gumla", "Simdega", "Bokaro", "Dumka", "Other"].map((district) => <option key={district}>{district}</option>)}</select></label><label>Village / ward / block<input value={form.locality} onChange={(event) => update("locality", event.target.value)} placeholder="Communities or geography represented" /></label></div><label>Community context<textarea value={form.communityContext} onChange={(event) => update("communityContext", event.target.value)} rows="6" placeholder="How did the organization learn about this? What voices or groups should be included?" /></label><div className="upload-box community-upload"><strong>Add up to 3 photos or videos</strong><span>{media.length}/3 selected · evidence is private by default</span><input type="file" accept="image/*,video/*" multiple onChange={addMedia} /></div>{media.length > 0 && <div className="media-list">{media.map((file) => <div className="media-item" key={file.name}><span>▧</span><div><strong>{file.name}</strong><small>{file.type} · {(file.size / 1024 / 1024).toFixed(2)} MB</small></div><button type="button" className="remove-button" onClick={() => setMedia((items) => items.filter((item) => item.name !== file.name))}>Remove</button></div>)}</div>}</div>}
    {step === 3 && <div className="form-section"><SectionTitle title="What has already been tried?" subtitle="Existing attempts prevent duplication and help partners build on local knowledge." /><label>Existing attempts, requests or resources<textarea value={form.existingAttempts} onChange={(event) => update("existingAttempts", event.target.value)} rows="6" placeholder="Repairs, meetings, petitions, local funds, pilots or other actions already taken" /></label><label>Support or partner request<textarea value={form.requestedSupport} onChange={(event) => update("requestedSupport", event.target.value)} rows="4" placeholder="Engineering, research, funding, service coordination..." /></label><div className="two-col"><label>Trusted contact name<input value={form.contactName} onChange={(event) => update("contactName", event.target.value)} /></label><label>Contact email<input type="email" value={form.contactEmail} onChange={(event) => update("contactEmail", event.target.value)} /></label></div><label>Contact phone / WhatsApp<input value={form.contactPhone} onChange={(event) => update("contactPhone", event.target.value)} /></label><div className="document-box"><div><strong>Supporting evidence (optional)</strong><p>Upload minutes, maps, letters or reports. These remain restricted.</p></div><label className="upload-inline"><span>＋ Add documents</span><input type="file" multiple onChange={(event) => setDocuments((current) => [...current, ...Array.from(event.target.files || []).map((file) => ({ name: file.name, type: file.type, size: file.size }))])} /></label>{documents.length > 0 && <div className="document-list">{documents.map((file) => <div key={file.name}><span>▤</span><strong>{file.name}</strong><button type="button" className="remove-button" onClick={() => setDocuments((items) => items.filter((item) => item.name !== file.name))}>Remove</button></div>)}</div>}</div></div>}
    {step === 4 && <div className="form-section"><SectionTitle title="Review & submit" subtitle="Confirm what will be shared with authorized reviewers and potential partners." /><div className="review-grid"><ReviewItem label="Challenge" value={form.title} /><ReviewItem label="Domain / priority" value={`${form.domain} · ${form.priority}`} /><ReviewItem label="Location" value={`${form.district} · ${form.locality}`} /><ReviewItem label="Affected" value={`${form.affectedPopulation || "Not specified"} people / households`} /><ReviewItem label="Community context" value={form.communityContext} /><ReviewItem label="Existing attempts" value={form.existingAttempts} /><ReviewItem label="Contacts" value={`${form.contactName} · ${form.contactEmail}${form.contactPhone ? ` · ${form.contactPhone}` : ""}`} /><ReviewItem label="Evidence" value={`${media.length}/3 photos or videos · ${documents.length} documents`} /></div><div className="privacy-note"><strong>Community consent:</strong> Confirm that the organization is authorized to share this information and sensitive personal details have been omitted.</div></div>}
    {error && <div className="form-error" role="alert">{error}</div>}<div className="report-actions">{step > 1 ? <button className="secondary-button" type="button" onClick={() => setStep((current) => current - 1)}>Back</button> : <Link className="secondary-button" to="/community-organization">Cancel</Link>}{step < 4 ? <button className="primary-button" type="button" onClick={next}>Continue</button> : <button className="primary-button" type="button" onClick={submit}>Submit Community Challenge</button>}</div>
  </div></section>;
}

function CommunityChallenges({ statusFilter = "All statuses" }) {
  const { user } = useAuth(); const [query, setQuery] = useState(""); const [district, setDistrict] = useState("All districts"); const [domain, setDomain] = useState("All domains"); const [priority, setPriority] = useState("All priorities"); const [status, setStatus] = useState(statusFilter); const challenges = communityChallengesFor(user.id); const districts = [...new Set(challenges.map((item) => item.district).filter(Boolean))]; const domains = [...new Set(challenges.map((item) => item.domain).filter(Boolean))]; const statuses = [...new Set(challenges.map((item) => item.status).filter(Boolean))]; const filtered = challenges.filter((item) => { const hay = `${item.title} ${item.description} ${item.communityContext} ${item.domain} ${item.district}`.toLowerCase(); const statusMatches = status === "All statuses" || (statusFilter === "Under Review" ? ["Submitted", "Under Review"].includes(item.status) : item.status === status); return (!query || hay.includes(query.toLowerCase())) && (district === "All districts" || item.district === district) && (domain === "All domains" || item.domain === domain) && (priority === "All priorities" || item.priority === priority) && statusMatches; }); const heading = statusFilter === "All statuses" ? "Challenges and community submissions" : statusFilter;
  return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">COMMUNITY CHALLENGES</div><h1>{heading}</h1><p>Filter your organization's submissions and shared challenge records by lifecycle stage, priority and geography.</p></div><Link className="primary-button" to="/community-organization/report">+ Report a Challenge</Link></div><section className="panel challenge-filters"><div className="filter-grid"><label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Water, livelihoods, ward..." /></label><label>District<select value={district} onChange={(event) => setDistrict(event.target.value)}><option>All districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label><label>Domain<select value={domain} onChange={(event) => setDomain(event.target.value)}><option>All domains</option>{domains.map((item) => <option key={item}>{item}</option>)}</select></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}><option>All priorities</option>{["Critical", "High", "Medium", "Low"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div></section><div className="challenge-results-head"><strong>{filtered.length} challenge{filtered.length === 1 ? "" : "s"} found</strong><span>Organization contact details remain restricted.</span></div>{filtered.length ? <div className="community-challenge-grid">{filtered.map((challenge) => <Link className="community-challenge-card" to={`/community-organization/challenges/${challenge.id}`} key={challenge.id}><div className="challenge-card-top"><span className="challenge-id">{challenge.id}</span><span className={`priority ${String(challenge.priority).toLowerCase()}`}>{challenge.priority}</span></div><h3>{challenge.title}</h3><p>{challenge.district} · {challenge.domain}</p><div className="community-card-context">{challenge.communityContext || challenge.description}</div><div className="challenge-card-bottom"><span className="status-badge">{challenge.status}</span><span>{challenge.mediaCount || 0}/3 media · View →</span></div></Link>)}</div> : <section className="panel"><EmptyState title="No challenges match these filters." text="Try a different status, district, domain or search term." action="Clear filters" href="/community-organization/challenges" /></section>}</section>;
}
function CommunityChallengeDetail() {
  const { user } = useAuth(); const { id } = useParams(); const challenge = communityChallengesFor(user.id).find((item) => item.id === id);
  if (!challenge) return <section className="empty-page"><div className="empty-icon">?</div><h1>Challenge not found</h1><p>This record is not available to your organization.</p><Link className="primary-button" to="/community-organization/challenges">Back to challenges</Link></section>;
  return <section className="workspace challenge-detail-page"><div className="breadcrumb"><Link to="/community-organization/challenges">Community challenges</Link><span>›</span><span>{challenge.id}</span></div><div className="detail-header"><div><div className="eyebrow">ORGANIZATION CHALLENGE · {challenge.id}</div><h1>{challenge.title}</h1><p>{challenge.district} · {challenge.locality || "Community"} · {challenge.domain}</p></div><span className={`priority ${String(challenge.priority).toLowerCase()}`}>{challenge.priority} priority</span></div><div className="detail-layout"><div className="detail-main"><section className="panel"><div className="panel-heading"><div><h2>Community problem brief</h2><span>Organization-owned context</span></div><span className="status-badge">{challenge.status}</span></div><p className="detail-description">{challenge.description}</p><div className="detail-facts"><div><span>People affected</span><strong>{(challenge.affectedPopulation || 0).toLocaleString()}</strong></div><div><span>District</span><strong>{challenge.district}</strong></div><div><span>Submitted</span><strong>{new Date(challenge.createdAt).toLocaleDateString()}</strong></div></div></section><section className="panel"><div className="panel-heading"><div><h2>Lifecycle tracking</h2><span>Every transition is visible</span></div></div><CommunityProgress challenge={challenge} detailed /></section><section className="panel"><div className="panel-heading"><h2>Community context and prior attempts</h2><span>Shared with authorized workflows</span></div><div className="detail-context-grid"><div><span>Community context</span><p>{challenge.communityContext || "Not provided"}</p></div><div><span>Existing attempts</span><p>{challenge.existingAttempts || "Not provided"}</p></div><div><span>Requested support</span><p>{challenge.requestedSupport || "Partner conversations can be added as the challenge progresses."}</p></div></div></section></div><aside className="detail-side"><section className="panel"><div className="panel-heading"><h2>Evidence</h2></div><div className="evidence-summary"><strong>{challenge.mediaCount || 0}/3</strong><span>photos/videos</span><strong>{challenge.documents?.length || 0}</strong><span>documents</span></div><p className="side-copy">Evidence stays restricted to authorized reviewers and collaborators.</p></section><section className="panel"><div className="panel-heading"><h2>Organization contact</h2></div><p className="side-copy">{challenge.contacts || "Your saved organization contact is used for coordination."}</p></section><section className="panel"><div className="panel-heading"><h2>Safeguards</h2></div><ul className="detail-list"><li>Community context is retained alongside the challenge.</li><li>Contact details are not displayed on public cards.</li><li>Partners should confirm consent before field activity.</li></ul></section></aside></div></section>;
}
function CommunityStatusPage({ status }) { return <CommunityChallenges statusFilter={status} />; }
function CommunityCollaborations() { const [items] = useCommunityStorage("collaborations", communityOrganizationCollaborations); return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">COLLABORATIONS</div><h1>Partners around your challenges</h1><p>Keep track of conversations, active pilots and completed partner work.</p></div><Link className="primary-button" to="/community-organization/challenges">Browse challenges</Link></div><div className="collaboration-grid">{items.map((item) => <article className="panel collaboration-card" key={item.id}><div className="collaboration-card-top"><span className="status-badge">{item.status}</span><span>{item.type}</span></div><h2>{item.title}</h2><strong>{item.partner}</strong><p>{item.nextStep}</p><small>{item.challengeId} · Updated {item.updatedAt}</small><Link className="text-link" to={`/community-organization/challenges/${item.challengeId}`}>Open challenge →</Link></article>)}</div></section>; }
function CommunityNotifications() { const [custom, setCustom] = useCommunityStorage("notifications", []); const defaults = communityOrganizationNotifications; const items = [...custom, ...defaults.filter((item) => !custom.some((saved) => saved.id === item.id))]; const markRead = (id) => setCustom((current) => current.some((item) => item.id === id) ? current.map((item) => item.id === id ? { ...item, unread: false } : item) : [...current, { ...defaults.find((item) => item.id === id), unread: false }]); return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">NOTIFICATIONS</div><h1>Updates for your organization</h1><p>Review requests, status changes and partner activity.</p></div><span className="status-badge">{items.filter((item) => item.unread).length} unread</span></div><div className="notification-list">{items.map((item) => <article className={`notification-card ${item.unread ? "unread" : ""}`} key={item.id} onClick={() => markRead(item.id)}><div className="notification-dot">•</div><div><strong>{item.title}</strong><p>{item.body}</p><small>{new Date(item.createdAt).toLocaleString()} · {item.unread ? "Click to mark read" : "Read"}</small></div></article>)}</div></section>; }

function CommunityProfile() { const { user } = useAuth(); const [profile, setProfile] = useCommunityStorage("profile", { ...communityOrganizationProfile, ...user }); const [documents, setDocuments] = useCommunityStorage("documents", communityOrganizationProfile.documents); const [saved, setSaved] = useState(false); const update = (key, value) => setProfile((current) => ({ ...current, [key]: value })); const addDocuments = (category, event) => { const files = Array.from(event.target.files || []).map((file) => ({ name: file.name, size: file.size, type: file.type })); setDocuments((current) => ({ ...current, [category]: [...(current[category] || []), ...files] })); event.target.value = ""; }; const removeDocument = (category, name) => setDocuments((current) => ({ ...current, [category]: (current[category] || []).filter((file) => file.name !== name) })); const completed = communityOrganizationProfileSections.reduce((total, section) => total + ((section.key === "documents" ? Object.values(documents || {}).some((files) => files?.length) : profile[section.key]) ? section.weight : 0), 0); const fields = [["organizationName", "Organization name"], ["organizationType", "Organization type"], ["registrationNumber", "Registration / authorization number"], ["district", "District / block served"], ["communitiesServed", "Communities served"], ["focusAreas", "Focus areas"], ["contactPerson", "Authorized contact"], ["email", "Official email"], ["phone", "Phone / WhatsApp"], ["website", "Website"], ["description", "Organization description"]]; const categories = [["registration", "Registration / legal proof"], ["authorization", "Community authorization"], ["impact", "Past community work"]]; return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">COMMUNITY ORGANIZATION PROFILE</div><h1>Organization identity and readiness</h1><p>Keep community details and private verification documents current for responsible matching.</p></div><span className="status-badge">{completed}% complete</span></div><section className="panel profile-editor community-profile-editor"><div className="panel-heading"><h2>Organization details</h2><span>Saved locally</span></div><div className="profile-form-grid">{fields.map(([key, label]) => <label key={key}>{label}{key === "description" ? <textarea rows="4" value={profile[key] || ""} onChange={(event) => update(key, event.target.value)} /> : <input value={profile[key] || ""} onChange={(event) => update(key, event.target.value)} />}</label>)}</div><div className="button-row left"><button className="primary-button" type="button" onClick={() => { writeCommunityStorage("profile", profile); setSaved(true); setTimeout(() => setSaved(false), 1800); }}>Save profile</button>{saved && <span className="save-confirmation">Profile saved</span>}</div></section><div className="profile-progress-card community-profile-progress"><div className="panel-heading"><h2>Profile completion</h2><strong>{completed}%</strong></div><div className="profile-progress"><span style={{ width: `${completed}%` }} /></div><div className="profile-progress-list">{communityOrganizationProfileSections.map((item) => <div key={item.key}><span>{(item.key === "documents" ? Object.values(documents || {}).some((files) => files?.length) : profile[item.key]) ? "✓" : "○"}</span>{item.label}</div>)}</div></div><section className="panel"><div className="panel-heading"><h2>Private documents</h2><span>Only authorized reviewers can access these files</span></div><div className="document-category-grid">{categories.map(([key, title]) => <div className="registration-document" key={key}><strong>{title}</strong><label className="upload-inline"><span>＋ Add document</span><input type="file" multiple onChange={(event) => addDocuments(key, event)} /></label>{(documents[key] || []).map((file) => <div className="saved-document" key={file.name}><span>▤</span><strong>{file.name}</strong><button className="remove-button" type="button" onClick={() => removeDocument(key, file.name)}>Remove</button></div>)}</div>)}</div></section></section>; }

function WorkspaceFoundation({ role }) { const { data } = useAuth(); const roleChallenges = data.mockChallenges.filter(c => c.visibleTo.includes(role) || c.visibleTo.includes("all")); const notifications = data.mockNotifications.filter(n => n.role === role); return <section className="workspace"><div className="workspace-header"><div><div className="eyebrow">FOUNDATION WORKSPACE</div><h1>{roleLabels[role]} workspace foundation</h1><p>Phase 1 shell is ready. Role-specific dashboards and workflows are intentionally deferred.</p></div><span className="status-badge">Mock session active</span></div><div className="info-banner"><strong>Central object: Challenge.</strong><span>This shell is prepared for the shared lifecycle: submission → validation → matching → collaboration → project → impact.</span></div><div className="metric-grid"><Metric label="Visible challenges" value={roleChallenges.length} /><Metric label="Mock organizations" value={data.mockOrganizations.length} /><Metric label="Active projects" value={data.mockProjects.filter(p => p.status === "active").length} /><Metric label="Notifications" value={notifications.length} /></div><div className="foundation-grid"><section className="panel"><div className="panel-heading"><h2>Shared challenge model</h2><span>Phase 1</span></div><div className="lifecycle">{CHALLENGE_LIFECYCLE.map((x, i) => <div className={i === 0 ? "lifecycle-step current" : "lifecycle-step"} key={x}><span>{i + 1}</span>{x}</div>)}</div></section><section className="panel"><div className="panel-heading"><h2>Role permissions</h2><span>Prototype</span></div><ul className="check-list"><li>Route access through <code>{routeForRole(role)}/*</code></li><li>Role selected from mock authenticated user</li><li>Unauthorized role access redirects safely</li><li>Organization data remains separate from users</li></ul></section></div></section>; }
function Metric({ label, value }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong></div>; }
function PlaceholderPage({ title }) { return <section className="empty-page"><div className="empty-icon">◌</div><h1>{title}</h1><p>This route is reserved for a later implementation phase.</p></section>; }
function Unauthorized() { return <section className="empty-page"><div className="empty-icon">!</div><h1>Access restricted</h1><p>Your mock account does not have permission to access this workspace.</p><Link className="primary-button" to="/login">Return to login</Link></section>; }
function LocalBodyRoute({ component: Component, ...props }) { const auth = useAuth(); return <Component auth={auth} {...props} />; }

function App() { return <AuthProvider><AppShell><Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/register/:role" element={<RegisterPage />} />
  <Route path="/register/local-body" element={<RegisterPage />} />
  <Route path="/register/government-agency" element={<RegisterPage />} />
  <Route path="/unauthorized" element={<Unauthorized />} />
  <Route path="/citizen" element={<RoleGuard allowed={["citizen"]}><CitizenHome /></RoleGuard>} />
  <Route path="/citizen/report" element={<RoleGuard allowed={["citizen"]}><ReportProblem /></RoleGuard>} />
  <Route path="/citizen/challenges" element={<RoleGuard allowed={["citizen"]}><CitizenChallenges /></RoleGuard>} />
  <Route path="/citizen/challenges/:id" element={<RoleGuard allowed={["citizen"]}><CitizenChallengeDetail /></RoleGuard>} />
  <Route path="/citizen/my-challenges" element={<RoleGuard allowed={["citizen"]}><MyChallenges /></RoleGuard>} />
  <Route path="/citizen/notifications" element={<RoleGuard allowed={["citizen"]}><CitizenNotifications /></RoleGuard>} />
  <Route path="/citizen/profile" element={<RoleGuard allowed={["citizen"]}><CitizenProfile /></RoleGuard>} />
  <Route path="/community-organization" element={<RoleGuard allowed={["community_organization"]}><CommunityHome /></RoleGuard>} />
  <Route path="/community-organization/report" element={<RoleGuard allowed={["community_organization"]}><CommunityReport /></RoleGuard>} />
  <Route path="/community-organization/challenges" element={<RoleGuard allowed={["community_organization"]}><CommunityChallenges /></RoleGuard>} />
  <Route path="/community-organization/challenges/:id" element={<RoleGuard allowed={["community_organization"]}><CommunityChallengeDetail /></RoleGuard>} />
  <Route path="/community-organization/under-review" element={<RoleGuard allowed={["community_organization"]}><CommunityStatusPage status="Under Review" /></RoleGuard>} />
  <Route path="/community-organization/implementation" element={<RoleGuard allowed={["community_organization"]}><CommunityStatusPage status="Implementation" /></RoleGuard>} />
  <Route path="/community-organization/resolved" element={<RoleGuard allowed={["community_organization"]}><CommunityStatusPage status="Resolved" /></RoleGuard>} />
  <Route path="/community-organization/collaborations" element={<RoleGuard allowed={["community_organization"]}><CommunityCollaborations /></RoleGuard>} />
  <Route path="/community-organization/notifications" element={<RoleGuard allowed={["community_organization"]}><CommunityNotifications /></RoleGuard>} />
  <Route path="/community-organization/profile" element={<RoleGuard allowed={["community_organization"]}><CommunityProfile /></RoleGuard>} />
  <Route path="/local-body" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyHomeView} /></RoleGuard>} />
  <Route path="/local-body/report" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyReportView} /></RoleGuard>} />
  <Route path="/local-body/challenges" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyChallengesView} /></RoleGuard>} />
  <Route path="/local-body/challenges/:id" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyChallengeDetailView} /></RoleGuard>} />
  <Route path="/local-body/pending" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyChallengesView} statusFilter="Pending Review" /></RoleGuard>} />
  <Route path="/local-body/prioritized" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyChallengesView} statusFilter="Prioritized" /></RoleGuard>} />
  <Route path="/local-body/assigned" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyChallengesView} statusFilter="Assigned" /></RoleGuard>} />
  <Route path="/local-body/implementation" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyChallengesView} statusFilter="Implementation" /></RoleGuard>} />
  <Route path="/local-body/resolved" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyChallengesView} statusFilter="Resolved" /></RoleGuard>} />
  <Route path="/local-body/reports" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyReportsView} /></RoleGuard>} />
  <Route path="/local-body/notifications" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyNotificationsView} /></RoleGuard>} />
  <Route path="/local-body/profile" element={<RoleGuard allowed={["local_body"]}><LocalBodyRoute component={LocalBodyProfileView} /></RoleGuard>} />
  <Route path="/government" element={<RoleGuard allowed={["government_agency"]}><LocalBodyRoute component={GovernmentHome} /></RoleGuard>} />
  <Route path="/government/submit" element={<RoleGuard allowed={["government_agency"]}><LocalBodyRoute component={GovernmentReport} /></RoleGuard>} />
  <Route path="/government/challenges" element={<RoleGuard allowed={["government_agency"]}><GovernmentChallenges /></RoleGuard>} />
  <Route path="/government/challenges/:id" element={<RoleGuard allowed={["government_agency"]}><GovernmentChallengeDetail /></RoleGuard>} />
  <Route path="/government/queue" element={<RoleGuard allowed={["government_agency"]}><GovernmentChallenges statusFilter="All" /></RoleGuard>} />
  <Route path="/government/validation" element={<RoleGuard allowed={["government_agency"]}><GovernmentChallenges statusFilter="Government Validation" /></RoleGuard>} />
  <Route path="/government/prioritized" element={<RoleGuard allowed={["government_agency"]}><GovernmentChallenges statusFilter="Prioritized" /></RoleGuard>} />
  <Route path="/government/matching" element={<RoleGuard allowed={["government_agency"]}><GovernmentMatching /></RoleGuard>} />
  <Route path="/government/proposals" element={<RoleGuard allowed={["government_agency"]}><GovernmentProposals /></RoleGuard>} />
  <Route path="/government/projects" element={<RoleGuard allowed={["government_agency"]}><GovernmentProjects /></RoleGuard>} />
  <Route path="/government/monitoring" element={<RoleGuard allowed={["government_agency"]}><GovernmentProjects monitoring /></RoleGuard>} />
  <Route path="/government/escalations" element={<RoleGuard allowed={["government_agency"]}><GovernmentEscalations /></RoleGuard>} />
  <Route path="/government/reports" element={<RoleGuard allowed={["government_agency"]}><GovernmentReports /></RoleGuard>} />
  <Route path="/government/notifications" element={<RoleGuard allowed={["government_agency"]}><GovernmentNotifications /></RoleGuard>} />
  <Route path="/government/profile" element={<RoleGuard allowed={["government_agency"]}><LocalBodyRoute component={GovernmentProfile} /></RoleGuard>} />
  <Route path="/university" element={<RoleGuard allowed={["university"]}><UniversityHome /></RoleGuard>} />
  <Route path="/university/challenges" element={<RoleGuard allowed={["university"]}><UniversityChallenges /></RoleGuard>} />
  <Route path="/university/problems" element={<RoleGuard allowed={["university"]}><UniversityProblemsPage /></RoleGuard>} />
  <Route path="/university/problems/:id" element={<RoleGuard allowed={["university"]}><UniversityEvaluation /></RoleGuard>} />
  <Route path="/university/implemented" element={<RoleGuard allowed={["university"]}><UniversityProblemsPage implemented /></RoleGuard>} />
  <Route path="/university/projects" element={<RoleGuard allowed={["university"]}><UniversityProjects /></RoleGuard>} />
  <Route path="/university/projects/:id" element={<RoleGuard allowed={["university"]}><UniversityProjectDetail /></RoleGuard>} />
  <Route path="/university/teams" element={<RoleGuard allowed={["university"]}><UniversityTeams /></RoleGuard>} />
  <Route path="/university/notifications" element={<RoleGuard allowed={["university"]}><UniversityNotifications /></RoleGuard>} />
  <Route path="/university/profile" element={<RoleGuard allowed={["university"]}><UniversityProfile /></RoleGuard>} />
  <Route path="/startup" element={<RoleGuard allowed={["startup"]}><StartupHome /></RoleGuard>} />
  <Route path="/startup/problems" element={<RoleGuard allowed={["startup"]}><StartupProblemsPage /></RoleGuard>} />
  <Route path="/startup/challenges/:id" element={<RoleGuard allowed={["startup"]}><StartupChallengeRoute /></RoleGuard>} />
  <Route path="/startup/interests" element={<RoleGuard allowed={["startup"]}><StartupInterestsRoute /></RoleGuard>} />
  <Route path="/startup/implemented" element={<RoleGuard allowed={["startup"]}><StartupProblemsPage implemented /></RoleGuard>} />
  <Route path="/startup/profile" element={<RoleGuard allowed={["startup"]}><StartupProfile /></RoleGuard>} />
  <Route path="/industry" element={<RoleGuard allowed={["industry"]}><IndustryHomeRoute /></RoleGuard>} />
  <Route path="/industry/problems" element={<RoleGuard allowed={["industry"]}><IndustryChallenges /></RoleGuard>} />
  <Route path="/industry/challenges/:id" element={<RoleGuard allowed={["industry"]}><IndustryChallengeRoute /></RoleGuard>} />
  <Route path="/industry/interests" element={<RoleGuard allowed={["industry"]}><IndustryInterestsRoute /></RoleGuard>} />
  <Route path="/industry/profile" element={<RoleGuard allowed={["industry"]}><IndustryProfileRoute /></RoleGuard>} />
  <Route path="/research-lab" element={<RoleGuard allowed={["research_lab"]}><ResearchLabHomeRoute /></RoleGuard>} />
  <Route path="/research-lab/problems" element={<RoleGuard allowed={["research_lab"]}><ResearchLabChallenges /></RoleGuard>} />
  <Route path="/research-lab/challenges/:id" element={<RoleGuard allowed={["research_lab"]}><ResearchLabChallengeRoute /></RoleGuard>} />
  <Route path="/research-lab/interests" element={<RoleGuard allowed={["research_lab"]}><ResearchLabInterestsRoute /></RoleGuard>} />
  <Route path="/research-lab/profile" element={<RoleGuard allowed={["research_lab"]}><ResearchLabProfileRoute /></RoleGuard>} />
  {["industry", "research_lab"].flatMap(role => [
    <Route key={`${role}-challenges`} path={`${routeForRole(role)}/challenges`} element={<RoleGuard allowed={[role]}><PlaceholderPage title="Challenges" /></RoleGuard>} />,
    <Route key={`${role}-projects`} path={`${routeForRole(role)}/projects`} element={<RoleGuard allowed={[role]}><PlaceholderPage title="Projects" /></RoleGuard>} />,
    <Route key={`${role}-notifications`} path={`${routeForRole(role)}/notifications`} element={<RoleGuard allowed={[role]}><PlaceholderPage title="Notifications" /></RoleGuard>} />
  ])}
  <Route path="/" element={<Navigate to="/login" replace />} /><Route path="*" element={<Navigate to="/login" replace />} />
</Routes></AppShell></AuthProvider>; }

createRoot(document.getElementById("root")).render(<React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>);
