"use client";

import { useEffect, useState } from "react";

type Challenge = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  district: string;
  priority: string;
  status: string;
  createdAt: string;
};

const sampleChallenges: Challenge[] = [
  {
    id: 1,
    title: "Drinking Water Shortage",
    description:
      "Villagers are facing difficulties due to insufficient access to clean drinking water.",
    category: "Water Resources",
    location: "Ranchi, Jharkhand",
    district: "Ranchi",
    status: "Under Review",
    priority: "High",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Improper Waste Management",
    description:
      "Improper waste collection and disposal is creating environmental and health problems.",
    category: "Environment",
    location: "Dhanbad, Jharkhand",
    district: "Dhanbad",
    status: "Submitted",
    priority: "Medium",
    createdAt: new Date().toISOString(),
  },
];

export default function ChallengesPage() {
  const [challenges, setChallenges] =
    useState<Challenge[]>(sampleChallenges);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priority, setPriority] = useState("All Priorities");
  const [status, setStatus] = useState("All Status");

  useEffect(() => {
    const savedChallenges = JSON.parse(
      localStorage.getItem("challenges") || "[]"
    );

    setChallenges([...savedChallenges, ...sampleChallenges]);
  }, []);

  /* Search + Filter */
  const filteredChallenges = challenges.filter((challenge) => {
    const searchMatch =
      challenge.title.toLowerCase().includes(search.toLowerCase()) ||
      challenge.description.toLowerCase().includes(search.toLowerCase()) ||
      challenge.location.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      category === "All Categories" ||
      challenge.category === category;

    const priorityMatch =
      priority === "All Priorities" ||
      challenge.priority === priority;

    const statusMatch =
      status === "All Status" ||
      challenge.status === status;

    return (
      searchMatch &&
      categoryMatch &&
      priorityMatch &&
      statusMatch
    );
  });

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b bg-white px-6 py-5 sm:px-10">

        <a
          href="/"
          className="text-2xl font-bold text-emerald-600"
        >
          SolveConnect
        </a>

        <div className="flex gap-4 text-sm font-medium text-slate-600 sm:gap-6">

          <a
            href="/"
            className="hover:text-emerald-600"
          >
            Home
          </a>

          <a
            href="/report"
            className="hover:text-emerald-600"
          >
            Report Challenge
          </a>

          <a
            href="/challenges"
            className="font-semibold text-emerald-600"
          >
            Challenges
          </a>

          <a
            href="/my-challenges"
            className="hover:text-emerald-600"
          >
            My Challenges
          </a>

        </div>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-6 py-12">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="font-semibold text-emerald-600">
              COMMUNITY CHALLENGES
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Explore Societal Challenges
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Discover real-world problems submitted by communities
              and explore opportunities to collaborate on innovative
              solutions.
            </p>
          </div>

          <a
            href="/report"
            className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            + Report Challenge
          </a>

        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Challenges
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {challenges.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              High Priority
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {
                challenges.filter(
                  (challenge) => challenge.priority === "High"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Submitted
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {
                challenges.filter(
                  (challenge) => challenge.status === "Submitted"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Search & Filters */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-4">

            {/* Search */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search Challenges
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, problem or location..."
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

            </div>

            {/* Category */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              >
                <option>All Categories</option>
                <option>Education</option>
                <option>Agriculture</option>
                <option>Healthcare</option>
                <option>Water Resources</option>
                <option>Environment</option>
                <option>Energy</option>
                <option>Urban Development</option>
                <option>Accessibility</option>
                <option>Public Administration</option>
                <option>Rural Livelihoods</option>
              </select>

            </div>

            {/* Priority */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              >
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

            </div>

          </div>

          {/* Status + Clear */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">

            <div className="w-full sm:max-w-xs">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
              >
                <option>All Status</option>
                <option>Submitted</option>
                <option>Under Review</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

            </div>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setPriority("All Priorities");
                setStatus("All Status");
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Clear Filters
            </button>

          </div>

        </div>

        {/* Result Count */}
        <div className="mt-8 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Community Challenges
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredChallenges.length} of {challenges.length} challenges
            </p>
          </div>

        </div>

        {/* Challenge Cards */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {filteredChallenges.map((challenge) => (

            <div
              key={challenge.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Top */}
              <div className="flex items-center justify-between gap-2">

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {challenge.category}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    challenge.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : challenge.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {challenge.priority} Priority
                </span>

              </div>

              {/* Title */}
              <h2 className="mt-5 text-xl font-bold text-slate-900">
                {challenge.title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {challenge.description}
              </p>

              {/* Location */}
              <div className="mt-5 text-sm text-slate-500">
                📍 {challenge.location}
              </div>

              {/* Status */}
              <div className="mt-5 border-t pt-4">

                <p className="text-xs font-medium text-slate-400">
                  CURRENT STATUS
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {challenge.status}
                </p>

                <a
                  href={`/challenges/${challenge.id}`}
                  className="mt-4 block rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  View Challenge Details →
                </a>

              </div>

            </div>

          ))}

        </div>

        {/* No Results */}
        {filteredChallenges.length === 0 && (

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              🔍
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No Challenges Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter options.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setPriority("All Priorities");
                setStatus("All Status");
              }}
              className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Clear Filters
            </button>

          </div>

        )}

      </section>

    </main>
  );
}