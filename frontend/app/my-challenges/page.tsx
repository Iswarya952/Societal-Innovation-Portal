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
    priority: "High",
    status: "Under Review",
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
    priority: "Medium",
    status: "Submitted",
    createdAt: new Date().toISOString(),
  },
];

export default function MyChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const savedChallenges: Challenge[] = JSON.parse(
      localStorage.getItem("challenges") || "[]"
    );

    setChallenges([...savedChallenges, ...sampleChallenges]);
  }, []);

  const totalChallenges = challenges.length;

  const underReview = challenges.filter(
    (challenge) => challenge.status === "Under Review"
  ).length;

  const resolved = challenges.filter(
    (challenge) => challenge.status === "Resolved"
  ).length;

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
            className="hover:text-emerald-600"
          >
            Challenges
          </a>

          <a
            href="/my-challenges"
            className="font-semibold text-emerald-600"
          >
            My Challenges
          </a>

        </div>

      </nav>

      {/* Main Section */}
      <section className="mx-auto max-w-6xl px-6 py-12">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="font-semibold text-emerald-600">
              CITIZEN PORTAL
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-950">
              My Challenges
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Track the societal challenges you have submitted and
              monitor their progress towards a solution.
            </p>

          </div>

          <a
            href="/report"
            className="rounded-xl bg-emerald-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            + Report New Challenge
          </a>

        </div>

        {/* Statistics */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Submitted
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalChallenges}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                📋
              </div>

            </div>

          </div>

          {/* Under Review */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Under Review
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {underReview}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                ⏳
              </div>

            </div>

          </div>

          {/* Resolved */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Resolved
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {resolved}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                ✓
              </div>

            </div>

          </div>

        </div>

        {/* Challenge List */}
        <div className="mt-10">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Submitted Challenges
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and track your reported community problems.
              </p>
            </div>

          </div>

          <div className="space-y-5">

            {challenges.map((challenge) => (

              <div
                key={challenge.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
              >

                {/* Top Row */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

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

                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      {challenge.title}
                    </h3>

                  </div>

                  {/* Status */}
                  <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                      challenge.status === "Resolved"
                        ? "bg-blue-100 text-blue-700"
                        : challenge.status === "Under Review"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {challenge.status}
                  </span>

                </div>

                {/* Description */}
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {challenge.description}
                </p>

                {/* Info */}
                <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">

                  <span>
                    📍 {challenge.location}
                  </span>

                  <span>
                    🏛️ {challenge.district}
                  </span>

                  <span>
                    📅 Submitted
                  </span>

                </div>

                {/* Bottom */}
                <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">

                  <div>

                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Current Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {challenge.status}
                    </p>

                  </div>

                  <a
                    href={`/challenges/${challenge.id}`}
                    className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    View Details →
                  </a>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Empty State */}
        {challenges.length === 0 && (

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              📋
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Challenges Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't submitted any societal challenges yet.
              Report a problem affecting your community and help
              create meaningful solutions.
            </p>

            <a
              href="/report"
              className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Report a Challenge →
            </a>

          </div>

        )}

      </section>

    </main>
  );
}