"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function ChallengeDetails() {
  const params = useParams();
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const challengeId = Number(params.id);

    const savedChallenges: Challenge[] = JSON.parse(
      localStorage.getItem("challenges") || "[]"
    );

    const allChallenges = [...savedChallenges, ...sampleChallenges];

    const foundChallenge = allChallenges.find(
      (item) => item.id === challengeId
    );

    setChallenge(foundChallenge || null);
  }, [params.id]);

  if (!challenge) {
    return (
      <main className="min-h-screen bg-slate-50">
        <nav className="border-b bg-white px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold text-emerald-600"
          >
            SolveConnect
          </a>
        </nav>

        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Challenge Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            The requested challenge could not be found.
          </p>

          <a
            href="/challenges"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            ← Back to Challenges
          </a>
        </div>
      </main>
    );
  }

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

        <div className="flex gap-5 text-sm font-medium text-slate-600">
          <a href="/" className="hover:text-emerald-600">
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
        </div>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-6 py-10">

        {/* Back */}
        <a
          href="/challenges"
          className="text-sm font-semibold text-slate-600 hover:text-emerald-600"
        >
          ← Back to Challenges
        </a>

        {/* Challenge Header */}
        <div className="mt-6 rounded-3xl border bg-white p-8 shadow-sm">

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              {challenge.category}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                challenge.priority === "High"
                  ? "bg-red-100 text-red-600"
                  : challenge.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {challenge.priority} Priority
            </span>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {challenge.status}
            </span>

          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-950">
            {challenge.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-500">
            <span>📍 {challenge.location}</span>
            <span>🏛️ {challenge.district}</span>
          </div>

        </div>

        {/* Content Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Problem Description */}
          <div className="lg:col-span-2 rounded-3xl border bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Problem Description
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              {challenge.description}
            </p>

          </div>

          {/* Challenge Info */}
          <div className="rounded-3xl border bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Challenge Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Category
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {challenge.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  District
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {challenge.district}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Location
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {challenge.location}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Priority
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {challenge.priority}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Current Status
                </p>

                <p className="mt-1 font-semibold text-emerald-600">
                  {challenge.status}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* AI Analysis */}
        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-8">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
              AI
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                AI-Powered Analysis
              </h2>

              <p className="text-sm text-slate-600">
                Intelligent challenge assessment
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Detected Domain
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {challenge.category}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Priority Level
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {challenge.priority}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Suggested Action
              </p>

              <p className="mt-2 font-bold text-slate-900">
                Expert Evaluation
              </p>
            </div>

          </div>

        </div>

        {/* University Matching */}
        <div className="mt-6 rounded-3xl border bg-white p-8 shadow-sm">

          <p className="text-sm font-semibold text-emerald-600">
            COLLABORATION
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            University Matching
          </h2>

          <p className="mt-3 text-slate-600">
            This challenge can be matched with universities based on
            academic expertise, faculty specialization and research
            capabilities.
          </p>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <p className="font-semibold text-slate-700">
              University matching will be performed by the platform.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Recommended institutions and faculty experts will appear
              here after AI-based matching.
            </p>
          </div>

        </div>

        {/* Action */}
        <div className="mt-8 flex flex-wrap gap-4">

          <button className="rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white hover:bg-emerald-700">
            Collaborate on this Challenge
          </button>

          <a
            href="/challenges"
            className="rounded-xl border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← View All Challenges
          </a>

        </div>

      </section>
    </main>
  );
}