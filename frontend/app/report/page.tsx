"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportChallenge() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !description || !category || !district) {
      alert("Please fill all required fields.");
      return;
    }

    const newChallenge = {
      id: Date.now(),
      title,
      description,
      category,
      location: location || district,
      district,
      priority: priority || "Medium",
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };

    const existingChallenges = JSON.parse(
      localStorage.getItem("challenges") || "[]"
    );

    localStorage.setItem(
      "challenges",
      JSON.stringify([...existingChallenges, newChallenge])
    );

    alert("Challenge submitted successfully!");

    router.push("/challenges");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
              S
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-950">
                SolveConnect
              </h1>

              <p className="text-xs text-slate-500">
                Societal Innovation Platform
              </p>
            </div>
          </a>

          <a
            href="/"
            className="text-sm font-semibold text-slate-600 hover:text-emerald-600"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Page */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <p className="font-semibold text-emerald-600">
            COMMUNITY VOICE
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-950">
            Report a Societal Challenge
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Tell us about a problem affecting your community. Your challenge
            can be reviewed, matched with experts and transformed into an
            actionable solution.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-950">
              Challenge Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Provide accurate details to help us understand the problem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Challenge Title *
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Lack of clean drinking water in our village"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Describe the Problem *
              </label>

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem, who is affected and how it impacts the community..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Category + District */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Challenge Category *
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-600 outline-none focus:border-emerald-500"
                >
                  <option value="">Select category</option>
                  <option value="Education">Education</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Water Resources">
                    Water Resources
                  </option>
                  <option value="Environment">Environment</option>
                  <option value="Energy">Energy</option>
                  <option value="Urban Development">
                    Urban Development
                  </option>
                  <option value="Accessibility">
                    Accessibility
                  </option>
                  <option value="Public Administration">
                    Public Administration
                  </option>
                  <option value="Rural Livelihoods">
                    Rural Livelihoods
                  </option>
                </select>
              </div>

              {/* District */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  District *
                </label>

                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-600 outline-none focus:border-emerald-500"
                >
                  <option value="">Select district</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Jamshedpur">Jamshedpur</option>
                  <option value="Dhanbad">Dhanbad</option>
                  <option value="Bokaro">Bokaro</option>
                  <option value="Hazaribagh">Hazaribagh</option>
                  <option value="Deoghar">Deoghar</option>
                  <option value="Giridih">Giridih</option>
                  <option value="Palamu">Palamu</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Specific Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Village / Town / Ward / Landmark"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Evidence */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Supporting Evidence
              </label>

              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-emerald-400">
                <div className="text-4xl">📎</div>

                <p className="mt-3 font-semibold text-slate-700">
                  Upload photos, videos or documents
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  PNG, JPG, MP4, PDF up to 10MB
                </p>

                <input
                  type="file"
                  multiple
                  className="mx-auto mt-5 block max-w-full text-sm text-slate-500"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                How urgent is this problem?
              </label>

              <div className="grid gap-3 sm:grid-cols-3">

                <label className="cursor-pointer rounded-xl border border-slate-200 p-4 hover:border-emerald-400">
                  <input
                    type="radio"
                    name="priority"
                    value="Low"
                    checked={priority === "Low"}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mr-2"
                  />
                  Low
                </label>

                <label className="cursor-pointer rounded-xl border border-slate-200 p-4 hover:border-emerald-400">
                  <input
                    type="radio"
                    name="priority"
                    value="Medium"
                    checked={priority === "Medium"}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mr-2"
                  />
                  Medium
                </label>

                <label className="cursor-pointer rounded-xl border border-slate-200 p-4 hover:border-emerald-400">
                  <input
                    type="radio"
                    name="priority"
                    value="High"
                    checked={priority === "High"}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mr-2"
                  />
                  High
                </label>

              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
              >
                Submit Challenge →
              </button>

            </div>

          </form>
        </div>
      </section>
    </main>
  );
}