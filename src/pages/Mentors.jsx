import { useEffect, useState } from "react";
import API from "../services/api";
import MentorCard from "../components/MentorCard";
import Navbar from "../components/Navbar";
import { FaSearch } from "react-icons/fa";
function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [mentorRes, requestRes] = await Promise.all([
        API.get("/mentor/all"),
        API.get("/connection/my-requests"),
      ]);

      setMentors(mentorRes.data);
      setRequests(requestRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getRequestStatus = (mentorId) => {
    const request = requests.find((r) => r.mentorId?._id === mentorId);

    return request?.status || null;
  };

  const filteredMentors = mentors.filter((mentor) => {
    const searchTerm = search.toLowerCase();

    return (
      mentor.name?.toLowerCase().includes(searchTerm) ||
      mentor.year?.toString().includes(searchTerm) ||
      mentor.skills?.some((skill) => skill.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white px-4 md:px-8 py-8">
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
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute right-40 bottom-0 w-48 h-48 bg-cyan-300/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Mentor Directory
            </h1>
            <p className="text-cyan-200 text-lg mb-4">
              {filteredMentors.length} mentors available right now
            </p>

            <p className="text-slate-100 max-w-2xl mx-auto text-lg">
              Connect with experienced seniors and mentors for academics,
              projects, placements and career guidance.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                🎓 Academic Guidance
              </span>

              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                💼 Placement Support
              </span>

              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                🚀 Career Growth
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center hover:border-cyan-400/40 transition">
            <h3 className="text-4xl font-bold text-cyan-400">
              {filteredMentors.length}
            </h3>

            <p className="text-gray-400 mt-2">Available Mentors</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center hover:border-green-400/40 transition">
            <h3 className="text-4xl font-bold text-green-400">
              {filteredMentors.filter((m) => m.skills?.length > 0).length}
            </h3>

            <p className="text-gray-400 mt-2">Skill Experts</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center hover:border-yellow-400/40 transition">
            <h3 className="text-4xl font-bold text-yellow-400">
              {requests.length}
            </h3>

            <p className="text-gray-400 mt-2">My Requests</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-10 relative">
          <FaSearch
            className="
      absolute
      left-5
      top-1/2
      -translate-y-1/2
      text-gray-500
    "
          />

          <input
            type="text"
            placeholder="Search mentors by name, year or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
      w-full
      pl-14
      pr-5
      py-4
      rounded-2xl
      bg-slate-900
      border
      border-slate-700
      text-white
      placeholder:text-gray-500
      focus:outline-none
      focus:border-cyan-400
      focus:ring-2
      focus:ring-cyan-400/20
      transition
    "
          />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="
      bg-slate-900
      border
      border-slate-700
      rounded-3xl
      p-6
      animate-pulse
      "
              >
                <div className="w-20 h-20 rounded-full bg-slate-700 mb-5"></div>

                <div className="h-6 bg-slate-700 rounded mb-3"></div>

                <div className="h-4 bg-slate-700 rounded mb-2"></div>

                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredMentors.length > 0 ? (
              <div
                className="
  grid
  grid-cols-1
  md:grid-cols-2
  xl:grid-cols-3
  gap-8
"
              >
                {filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor._id}
                    mentor={mentor}
                    requestStatus={getRequestStatus(mentor._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6 animate-bounce">🔍</div>

                <h2 className="text-3xl font-bold mb-3">
                  No Mentors Match Your Search
                </h2>

                <p className="text-gray-400 mb-6">
                  Try searching with another skill, mentor name or year.
                </p>

                <button
                  onClick={() => setSearch("")}
                  className="
    px-6
    py-3
    rounded-xl
    bg-cyan-500
    hover:bg-cyan-600
    transition
  "
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Mentors;
