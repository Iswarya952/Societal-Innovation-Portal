import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { mockChallenges } from "./mock/challenges";
import {
  calculateStartupMatch,
  challengeForStartup,
  readStartupInterests,
  startupCapabilities,
  startupInterestStatuses,
  writeStartupInterests
} from "./mock/startupStage1";

const priorityRank = { Critical: 4, High: 3, Medium: 2, Low: 1 };

function availableChallenges() {
  return mockChallenges.filter((challenge) => challenge.visibleTo?.includes("startup"));
}

function challengeDescription(challenge) {
  return challenge.description || `A ${challenge.priority?.toLowerCase() || "priority"} challenge affecting approximately ${(challenge.affectedPopulation || 0).toLocaleString()} people in ${challenge.district}.`;
}

function useInterests(startupId) {
  const [interests, setInterests] = useState(() => readStartupInterests());
  useEffect(() => {
    writeStartupInterests(interests);
  }, [interests]);
  return [interests.filter((interest) => interest.startupId === startupId), setInterests];
}

function MatchBadge({ challenge }) {
  return <span className="match-badge">{calculateStartupMatch(challenge)}% match</span>;
}

function StartupChallengeCard({ challenge, onEvaluate }) {
  return <article className="startup-challenge-card">
    <div className="problem-card-top"><span className="challenge-id">{challenge.id}</span><span className={`priority ${String(challenge.priority || "Medium").toLowerCase()}`}>{challenge.priority}</span></div>
    <div className="startup-card-heading"><h3>{challenge.title}</h3><MatchBadge challenge={challenge} /></div>
    <p>{challengeDescription(challenge)}</p>
    <div className="startup-challenge-facts"><span><small>Domain</small><strong>{challenge.domain || "Societal challenge"}</strong></span><span><small>Location</small><strong>{challenge.district || "Not specified"}</strong></span><span><small>Affected</small><strong>{(challenge.affectedPopulation || 0).toLocaleString()}</strong></span><span><small>Status</small><strong>{challenge.status}</strong></span></div>
    <div className="capability-chips">{(challenge.requiredCapabilities || []).map((capability) => <span key={capability}>{capability}</span>)}</div>
    <div className="button-row left"><Link className="secondary-button" to={`/startup/challenges/${challenge.id}`}>View Details</Link><button className="primary-button" type="button" onClick={() => onEvaluate(challenge)}>Evaluate Opportunity</button></div>
  </article>;
}

export function StartupChallengesPage({ user, implemented = false }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains");
  const [district, setDistrict] = useState("All districts");
  const [priority, setPriority] = useState("All priorities");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("match");
  const [evaluation, setEvaluation] = useState(null);
  const challenges = implemented ? [] : availableChallenges();
  const domains = [...new Set(challenges.map((challenge) => challenge.domain).filter(Boolean))];
  const districts = [...new Set(challenges.map((challenge) => challenge.district).filter(Boolean))];
  const statuses = [...new Set(challenges.map((challenge) => challenge.status).filter(Boolean))];
  const filtered = challenges.filter((challenge) => {
    const haystack = `${challenge.title} ${challengeDescription(challenge)} ${challenge.domain || ""} ${challenge.district || ""}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (domain === "All domains" || challenge.domain === domain)
      && (district === "All districts" || challenge.district === district)
      && (priority === "All priorities" || challenge.priority === priority)
      && (status === "All statuses" || challenge.status === status);
  }).sort((left, right) => sort === "match"
    ? calculateStartupMatch(right) - calculateStartupMatch(left)
    : sort === "priority"
      ? (priorityRank[right.priority] || 0) - (priorityRank[left.priority] || 0)
      : (right.affectedPopulation || 0) - (left.affectedPopulation || 0));

  return <section className="workspace startup-stage1"><div className="workspace-header"><div><div className="eyebrow">{implemented ? "IMPLEMENTED PROBLEMS" : "STARTUP CHALLENGE DISCOVERY"}</div><h1>{implemented ? "Implemented solutions" : "Find challenges where your startup can help"}</h1><p>{implemented ? "Completed Startup solutions will appear here in later implementation stages." : "Explore shared societal challenges. Your match score is a recommendation, not an assignment."}</p></div>{!implemented && <Link className="secondary-button" to="/startup/interests">My Interests</Link>}</div>
    {!implemented && <section className="panel challenge-filters"><div className="filter-grid"><label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search challenges..." /></label><label>Domain<select value={domain} onChange={(event) => setDomain(event.target.value)}><option>All domains</option>{domains.map((item) => <option key={item}>{item}</option>)}</select></label><label>District<select value={district} onChange={(event) => setDistrict(event.target.value)}><option>All districts</option>{districts.map((item) => <option key={item}>{item}</option>)}</select></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}><option>All priorities</option>{Object.keys(priorityRank).map((item) => <option key={item}>{item}</option>)}</select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="match">Best match</option><option value="priority">Priority</option><option value="impact">Affected population</option></select></label></div></section>}
    {!implemented && <div className="challenge-results-head"><strong>{filtered.length} challenge{filtered.length === 1 ? "" : "s"} found</strong><span>Showing challenges available to solver organizations.</span></div>}
    {filtered.length ? <div className="startup-challenge-grid">{filtered.map((challenge) => <StartupChallengeCard key={challenge.id} challenge={challenge} onEvaluate={setEvaluation} />)}</div> : <section className="panel"><EmptyState title={implemented ? "No implemented solutions yet." : "No challenges match your filters."} text={implemented ? "Accepted Startup projects will be listed here after later workflow stages." : "Try changing the search or filters."} /></section>}
    {evaluation && <EvaluationModal challenge={evaluation} onClose={() => setEvaluation(null)} />}
  </section>;
}

function EvaluationModal({ challenge, onClose }) {
  const match = calculateStartupMatch(challenge);
  const required = challenge.requiredCapabilities || [];
  const capabilityMatch = required.length ? Math.round((match / 99) * 100) : 60;
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="modal-card startup-evaluation" role="dialog" aria-modal="true" aria-labelledby="evaluation-title" onClick={(event) => event.stopPropagation()}><div className="panel-heading"><div><span className="eyebrow">OPPORTUNITY EVALUATION</span><h2 id="evaluation-title">{challenge.title}</h2></div><button className="ghost-button" type="button" onClick={onClose}>Close</button></div><div className="evaluation-grid"><div><span>Technology capability</span><strong>{capabilityMatch}%</strong></div><div><span>Domain suitability</span><strong>{challenge.domain ? "Relevant" : "To assess"}</strong></div><div><span>Deployment suitability</span><strong>{challenge.district ? "Suitable" : "To assess"}</strong></div><div><span>Overall recommendation</span><strong>{match}% match</strong></div></div><div className="capability-chips">{required.map((capability) => <span key={capability}>{startupCapabilities.includes(capability) ? "✓ " : ""}{capability}</span>)}</div><p className="privacy-note">Match score is a recommendation. Final selection is made through the official challenge and proposal workflow.</p><div className="button-row left"><Link className="primary-button" to={`/startup/challenges/${challenge.id}`} onClick={onClose}>View full challenge</Link><button className="secondary-button" type="button" onClick={onClose}>Continue browsing</button></div></section></div>;
}

export function StartupChallengeDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interests, setInterests] = useInterests(user.id);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showInterest, setShowInterest] = useState(false);
  const [success, setSuccess] = useState("");
  const challenge = challengeForStartup(availableChallenges(), id);
  const existing = interests.find((interest) => interest.challengeId === id);
  if (!challenge) return <section className="workspace"><EmptyState title="Challenge not found." text="This challenge may no longer be available to solver organizations." action="Browse challenges" href="/startup/problems" /></section>;
  const submitInterest = (values) => {
    const interest = { id: `INT-S-${Date.now()}`, challengeId: challenge.id, startupId: user.id, startupName: user.name, reason: values.reason, capabilities: values.capabilities, implementationApproach: values.implementationApproach, matchPercentage: calculateStartupMatch(challenge), status: "Interested", submittedAt: new Date().toISOString() };
    setInterests((current) => [...current, interest]);
    setShowInterest(false);
    setSuccess("Interest submitted successfully. The challenge remains in its current lifecycle until the official review process.");
  };
  return <section className="workspace startup-stage1"><div className="breadcrumb"><Link to="/startup/problems">Challenges</Link><span>›</span><span>{challenge.id}</span></div><div className="workspace-header"><div><div className="eyebrow">STARTUP CHALLENGE DETAILS</div><h1>{challenge.title}</h1><p>{challenge.id} · {challenge.district} · {challenge.domain}</p></div><MatchBadge challenge={challenge} /></div>{success && <div className="success-inline" role="status">✓ {success}</div>}<div className="startup-detail-grid"><div className="detail-main"><section className="panel"><div className="panel-heading"><h2>Problem statement</h2><span className="status-badge">{challenge.status}</span></div><p className="detail-description">{challengeDescription(challenge)}</p><div className="detail-facts"><div><span>Priority</span><strong>{challenge.priority}</strong></div><div><span>Affected population</span><strong>{(challenge.affectedPopulation || 0).toLocaleString()}</strong></div><div><span>Duration</span><strong>{challenge.duration || "Not specified"}</strong></div><div><span>Relevant authority</span><strong>{challenge.authority || challenge.submittedBy || "Public authority / provider"}</strong></div></div></section><section className="panel"><div className="panel-heading"><h2>Required capabilities</h2><span>Recommendation inputs</span></div><div className="capability-chips">{(challenge.requiredCapabilities || []).map((capability) => <span key={capability}>{capability}</span>)}</div><p className="field-help">Supporting evidence: {challenge.evidence?.length ? `${challenge.evidence.length} item(s) available` : "Evidence summary available to authorized reviewers."}</p></section><section className="panel"><div className="panel-heading"><h2>Challenge lifecycle</h2><span>Current status: {challenge.status}</span></div><div className="lifecycle startup-lifecycle">{["Submitted", "AI Analysis", "Under Review", "Validated", "Prioritized", "Matched", "Implementation", "Completed"].map((stage, index) => <div className={index === 0 ? "lifecycle-step current" : "lifecycle-step"} key={stage}><span>{index === 0 ? "●" : "○"}</span>{stage}</div>)}</div></section></div><aside className="detail-side"><section className="panel"><div className="panel-heading"><h2>Startup action</h2></div>{existing ? <div className="interest-status"><strong>Interest: {existing.status}</strong><span>Submitted {new Date(existing.submittedAt).toLocaleDateString()}</span><Link className="secondary-button" to="/startup/interests">View my interests</Link></div> : <div className="button-row left"><button className="primary-button" type="button" onClick={() => setShowEvaluation(true)}>Evaluate Opportunity</button><button className="secondary-button" type="button" onClick={() => setShowInterest(true)}>Express Interest</button></div>}</section><section className="panel"><div className="panel-heading"><h2>Recommendation</h2></div><p className="side-copy">{calculateStartupMatch(challenge)}% match based on capabilities, domain and deployment suitability. This does not automatically assign your startup.</p></section></aside></div>{showEvaluation && <EvaluationModal challenge={challenge} onClose={() => setShowEvaluation(false)} />}{showInterest && <InterestModal challenge={challenge} onClose={() => setShowInterest(false)} onSubmit={submitInterest} />}</section>;
}

function InterestModal({ challenge, onClose, onSubmit }) {
  const [form, setForm] = useState({ reason: "", capabilities: "", implementationApproach: "" });
  const [error, setError] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.reason.trim() || !form.capabilities.trim() || !form.implementationApproach.trim()) {
      setError("Complete all fields before submitting your interest.");
      return;
    }
    onSubmit(form);
  };
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="interest-title" onClick={(event) => event.stopPropagation()}><div className="panel-heading"><div><span className="eyebrow">EXPRESS INTEREST</span><h2 id="interest-title">{challenge.title}</h2></div><button className="ghost-button" type="button" onClick={onClose}>Cancel</button></div><form onSubmit={submit}><label>Why is your startup interested?<textarea value={form.reason} onChange={(event) => update("reason", event.target.value)} rows="4" required /></label><label>Relevant technology / capability<textarea value={form.capabilities} onChange={(event) => update("capabilities", event.target.value)} rows="3" required /></label><label>High-level implementation approach<textarea value={form.implementationApproach} onChange={(event) => update("implementationApproach", event.target.value)} rows="4" required /></label>{error && <div className="form-error" role="alert">{error}</div>}<div className="button-row left"><button className="primary-button" type="submit">Submit Interest</button><button className="secondary-button" type="button" onClick={onClose}>Cancel</button></div></form></section></div>;
}

export function StartupInterests({ user }) {
  const [interests] = useInterests(user.id);
  const challenges = availableChallenges();
  return <section className="workspace startup-stage1"><div className="workspace-header"><div><div className="eyebrow">MY INTERESTS</div><h1>Track submitted interests</h1><p>Follow opportunities where your startup has expressed an interest in participating.</p></div><Link className="primary-button" to="/startup/problems">Browse challenges</Link></div>{interests.length ? <div className="startup-interest-list">{interests.map((interest) => { const challenge = challenges.find((item) => item.id === interest.challengeId); return <article className="panel startup-interest-card" key={interest.id}><div className="panel-heading"><div><span className="challenge-id">{interest.challengeId}</span><h2>{challenge?.title || "Challenge unavailable"}</h2></div><span className="status-badge">{startupInterestStatuses.includes(interest.status) ? interest.status : "Interested"}</span></div><div className="startup-interest-facts"><span>{challenge?.domain || "Societal challenge"}</span><span>{interest.matchPercentage}% match</span><span>Submitted {new Date(interest.submittedAt).toLocaleDateString()}</span></div><p>{interest.reason}</p>{challenge && <Link className="secondary-button" to={`/startup/challenges/${challenge.id}`}>Open challenge details</Link>}</article>; })}</div> : <section className="panel"><EmptyState title="No interests submitted yet." text="Browse available challenges to find opportunities for your startup." action="Browse challenges" href="/startup/problems" /></section>}</section>;
}

function EmptyState({ title, text, action, href }) {
  return <div className="empty-state"><div className="empty-icon">◌</div><h2>{title}</h2><p>{text}</p>{action && <Link className="secondary-button" to={href}>{action}</Link>}</div>;
}
