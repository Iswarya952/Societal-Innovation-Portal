const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "The backend request failed.");
  }
  return data;
}

export function submitProblem(problem) {
  return request("/api/problems", {
    method: "POST",
    body: JSON.stringify(problem)
  });
}

export function getProblems(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  );
  return request(`/api/problems${query.toString() ? `?${query}` : ""}`);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}