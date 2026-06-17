import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalLostItems: 0,
    totalFoundItems: 0,
  });

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [statsRes, profileRes] = await Promise.all([
        API.get("/dashboard/stats"),
        API.get("/auth/profile"),
      ]);

      setStats(statsRes.data);

      setUser(profileRes.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletion = () => {
    if (!user) return 0;

    let completed = 0;

    if (user.name) completed++;

    if (user.email) completed++;

    if (user.department) completed++;

    if (user.year) completed++;

    if (user.bio) completed++;

    if (user.profilePhoto) completed++;

    return Math.round((completed / 6) * 100);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white px-4 md:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Hero */}
            <div
              className="
  relative
  overflow-hidden
  bg-gradient-to-r
  from-cyan-600
  via-blue-600
  to-indigo-700
  rounded-3xl
  p-8
  md:p-12
  mb-10
  shadow-2xl
  border
  border-cyan-400/20
"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                Welcome Back, {user?.name || "Student"} 👋
              </h1>

              <p className="text-slate-100">
                Manage mentors, lost & found, profile and future connections
                from one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                  🎓 Mentorship
                </span>

                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                  📦 Lost & Found
                </span>

                <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                  💬 Connections
                </span>
              </div>
            </div>

            {/* Profile Completion */}
            <div
              className="
  bg-slate-900/80
  backdrop-blur-xl
  border
  border-slate-700
  rounded-3xl
  p-6
  mb-10
  shadow-xl
"
            >
              <div className="flex justify-between mb-3">
                <h2 className="text-xl font-bold">Profile Completion</h2>

                <span className="text-cyan-400 font-bold">
                  {getCompletion()}%
                </span>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-cyan-500 h-3 rounded-full"
                  style={{
                    width: `${getCompletion()}%`,
                  }}
                />
              </div>

              {getCompletion() < 100 && (
                <Link
                  to="/profile"
                  className="
inline-block
mt-4
px-5
py-2.5
rounded-xl
bg-gradient-to-r
from-cyan-500
to-blue-600
hover:scale-105
transition
shadow-lg
"
                >
                  Complete Profile
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div
                className="bg-slate-900
border
border-slate-700
hover:border-cyan-400/40
hover:shadow-lg
hover:shadow-cyan-500/10 rounded-2xl p-6 text-center hover:scale-105 transition"
              >
                <div className="text-5xl mb-3">👥</div>

                <h2 className="text-4xl font-bold text-cyan-400">
                  {stats.totalUsers}
                </h2>

                <p className="text-gray-400">Total Users</p>
              </div>

              <div
                className="bg-slate-900
border
border-slate-700
hover:border-cyan-400/40
hover:shadow-lg
hover:shadow-cyan-500/10 rounded-2xl p-6 text-center hover:scale-105 transition"
              >
                <div className="text-5xl mb-3">🎓</div>

                <h2 className="text-4xl font-bold text-green-400">
                  {stats.totalMentors}
                </h2>

                <p className="text-gray-400">Mentors</p>
              </div>

              <div
                className="bg-slate-900
border
border-slate-700
hover:border-cyan-400/40
hover:shadow-lg
hover:shadow-cyan-500/10 rounded-2xl p-6 text-center hover:scale-105 transition"
              >
                <div className="text-5xl mb-3">📦</div>

                <h2 className="text-4xl font-bold text-red-400">
                  {stats.totalLostItems}
                </h2>

                <p className="text-gray-400">Lost Items</p>
              </div>

              <div
                className="bg-slate-900
border
border-slate-700
hover:border-cyan-400/40
hover:shadow-lg
hover:shadow-cyan-500/10 rounded-2xl p-6 text-center hover:scale-105 transition"
              >
                <div className="text-5xl mb-3">✅</div>

                <h2 className="text-4xl font-bold text-yellow-400">
                  {stats.totalFoundItems}
                </h2>

                <p className="text-gray-400">Found Items</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Quick Actions</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  to="/mentors"
                  className="
      bg-slate-900
      border border-slate-700
      hover:border-cyan-400/50
      hover:shadow-lg
      hover:shadow-cyan-500/10
      p-8
      rounded-2xl
      transition
      hover:scale-105
    "
                >
                  <div className="text-5xl mb-4">🎓</div>

                  <h3 className="text-xl font-bold">Mentors</h3>

                  <p className="text-gray-400 mt-2">Find mentors</p>
                </Link>

                <Link
                  to="/become-mentor"
                  className="
      bg-gradient-to-r
      from-cyan-500
      to-blue-600
      p-8
      rounded-2xl
      transition
      hover:scale-105
      shadow-xl
    "
                >
                  <div className="text-5xl mb-4">🌟</div>

                  <h3 className="text-xl font-bold">Become Mentor</h3>

                  <p className="text-slate-100 mt-2">
                    Apply to mentor students
                  </p>
                </Link>

                <Link
                  to="/profile"
                  className="
      bg-slate-900
      border border-slate-700
      hover:border-cyan-400/50
      hover:shadow-lg
      hover:shadow-cyan-500/10
      p-8
      rounded-2xl
      transition
      hover:scale-105
    "
                >
                  <div className="text-5xl mb-4">👤</div>

                  <h3 className="text-xl font-bold">Profile</h3>

                  <p className="text-gray-400 mt-2">Manage profile</p>
                </Link>

                <Link
                  to="/upload-item"
                  className="
      bg-slate-900
      border border-slate-700
      hover:border-cyan-400/50
      hover:shadow-lg
      hover:shadow-cyan-500/10
      p-8
      rounded-2xl
      transition
      hover:scale-105
    "
                >
                  <div className="text-5xl mb-4">📦</div>

                  <h3 className="text-xl font-bold">Upload Item</h3>

                  <p className="text-gray-400 mt-2">Lost & Found</p>
                </Link>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Platform Features</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div
                  className="
bg-slate-900
border
border-slate-700
rounded-2xl
p-6
transition
hover:scale-105
hover:border-cyan-400/40
hover:shadow-lg
hover:shadow-cyan-500/10
"
                >
                  <div className="text-4xl mb-3">🎓</div>

                  <h3 className="font-bold text-lg mb-2">Mentorship Network</h3>

                  <p className="text-gray-400">
                    Connect with seniors and mentors for guidance.
                  </p>
                </div>

                <div
                  className="
bg-slate-900
border
border-slate-700
rounded-2xl
p-6
transition
hover:scale-105
hover:border-cyan-400/40
hover:shadow-lg
hover:shadow-cyan-500/10
"
                >
                  <div className="text-4xl mb-3">📦</div>

                  <h3 className="font-bold text-lg mb-2">Lost & Found</h3>

                  <p className="text-gray-400">
                    Report and recover lost items across campus.
                  </p>
                </div>

                <div
                  className="
bg-slate-900
border
border-slate-700
rounded-2xl
p-6
transition
hover:scale-105
hover:border-cyan-400/40
hover:shadow-lg
hover:shadow-cyan-500/10
"
                >
                  <div className="text-4xl mb-3">💬</div>

                  <h3 className="font-bold text-lg mb-2">Real-Time Chat</h3>

                  <p className="text-gray-400">
                    Instantly communicate with fellow students.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
