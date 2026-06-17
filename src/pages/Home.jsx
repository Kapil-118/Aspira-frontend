import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-24 md:py-36 px-4">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div className="relative max-w-6xl mx-auto text-center">
            <div className="inline-block mb-6 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
                Student Networking & Campus Community Platform
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Aspira
            </h1>

            <h2 className="text-2xl md:text-5xl font-bold mb-8">
              Connect • Learn • Grow
            </h2>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Connect with experienced mentors, recover lost items,
              build meaningful student relationships, and create a
              stronger campus community — all in one platform.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
              <Link
                to="/register"
                className="
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                hover:scale-105
                transition-all
                duration-300
                px-8
                py-4
                rounded-2xl
                font-semibold
                shadow-lg
                shadow-cyan-500/20
              "
              >
                Get Started Free
              </Link>

              <Link
                to="/mentors"
                className="
                border
                border-slate-700
                hover:border-cyan-400
                hover:bg-slate-900
                transition
                px-8
                py-4
                rounded-2xl
                font-semibold
              "
              >
                Explore Mentors
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center hover:border-cyan-500/30 transition">
              <h2 className="text-5xl font-bold text-cyan-400">500+</h2>
              <p className="text-slate-400 mt-3">
                Students Connected
              </p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center hover:border-green-500/30 transition">
              <h2 className="text-5xl font-bold text-green-400">50+</h2>
              <p className="text-slate-400 mt-3">
                Verified Mentors
              </p>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center hover:border-yellow-500/30 transition">
              <h2 className="text-5xl font-bold text-yellow-400">100+</h2>
              <p className="text-slate-400 mt-3">
                Items Recovered
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-center text-4xl md:text-5xl font-bold mb-16">
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="
              bg-slate-900/80
              border
              border-slate-800
              rounded-3xl
              p-8
              hover:-translate-y-2
              hover:border-cyan-500/30
              transition-all
            "
            >
              <div className="text-6xl mb-5">🎓</div>

              <h3 className="text-2xl font-bold mb-4">
                Mentor Network
              </h3>

              <p className="text-slate-400">
                Connect with seniors and experienced mentors for
                academics, placements, projects, and career guidance.
              </p>
            </div>

            <div
              className="
              bg-slate-900/80
              border
              border-slate-800
              rounded-3xl
              p-8
              hover:-translate-y-2
              hover:border-cyan-500/30
              transition-all
            "
            >
              <div className="text-6xl mb-5">📦</div>

              <h3 className="text-2xl font-bold mb-4">
                Lost & Found
              </h3>

              <p className="text-slate-400">
                Quickly report lost items, upload found items,
                and reconnect belongings with their owners.
              </p>
            </div>

            <div
              className="
              bg-slate-900/80
              border
              border-slate-800
              rounded-3xl
              p-8
              hover:-translate-y-2
              hover:border-cyan-500/30
              transition-all
            "
            >
              <div className="text-6xl mb-5">🤝</div>

              <h3 className="text-2xl font-bold mb-4">
                Campus Community
              </h3>

              <p className="text-slate-400">
                Build meaningful student connections,
                collaborate, share knowledge, and grow together.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div
            className="
            max-w-5xl
            mx-auto
            text-center
            bg-gradient-to-r
            from-cyan-600
            via-blue-600
            to-indigo-700
            rounded-3xl
            p-12
            shadow-2xl
          "
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join Aspira?
            </h2>

            <p className="text-slate-100 text-lg mb-10">
              Start connecting with mentors and students today.
            </p>

            <Link
              to="/register"
              className="
              inline-block
              bg-white
              text-slate-900
              px-8
              py-4
              rounded-2xl
              font-bold
              hover:scale-105
              transition
            "
            >
              Create Free Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-10 text-center">
          <h3 className="text-xl font-bold mb-2">Aspira</h3>

          <p className="text-slate-500">
            Connect • Learn • Grow
          </p>

          <p className="text-slate-600 text-sm mt-4">
            © 2026 Aspira. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

export default Home;