export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b bg-white px-10 py-5">
        <h1 className="text-2xl font-bold text-emerald-600">
          SolveConnect
        </h1>

        <div className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="/" className="hover:text-emerald-600">
            Home
          </a>

          <a href="/report" className="hover:text-emerald-600">
            Report Challenge
          </a>

          <a href="/challenges" className="hover:text-emerald-600">
            Explore Challenges
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        
        <div className="mb-5 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          AI-Powered Societal Innovation Platform
        </div>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight text-slate-900">
          Turn Community Challenges into
          <span className="text-emerald-600"> Real Solutions</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          SolveConnect connects citizens, universities, industry partners,
          startups and government to collaboratively solve real-world
          societal challenges.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <a
            href="/report"
            className="rounded-xl bg-emerald-600 px-7 py-4 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Report a Challenge →
          </a>

          <a
            href="/challenges"
            className="rounded-xl border border-slate-300 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
          >
            Explore Challenges
          </a>

        </div>

        {/* Platform Features */}
        <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-3xl">👥</div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              Citizen Engagement
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Citizens can submit real societal challenges with location,
              descriptions and supporting evidence.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-3xl">🤖</div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              AI-Powered Matching
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              AI categorizes challenges and helps route them to suitable
              universities and experts.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="text-3xl">🤝</div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              Collaborative Innovation
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Universities, industries and startups collaborate to build
              practical solutions.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-10 py-6 text-center text-sm text-slate-500">
        © 2026 SolveConnect • Societal Innovation Collaboration Portal
      </footer>

    </main>
  );
}