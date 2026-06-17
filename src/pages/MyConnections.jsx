import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
function MyConnections() {
  const [connections, setConnections] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await API.get("/connection/my-connections");

      setConnections(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white px-4 md:px-8 py-8">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            My Connections
          </h1>

          <p className="text-slate-100">View and manage your mentor network.</p>

          <div className="mt-6">
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
              🤝 {connections.length} Connections
            </span>
          </div>
        </div>

        {/* Empty State */}

        {connections.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-5">🤝</div>

            <h2 className="text-3xl font-bold mb-3">No Connections Yet</h2>

            <p className="text-gray-400 mb-6">Start connecting with mentors.</p>

            <Link
              to="/mentors"
              className="
              inline-block
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-6
              py-3
              rounded-2xl
              font-semibold
            "
            >
              Explore Mentors
            </Link>
          </div>
        ) : (
          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
          "
          >
            {connections.map((connection) => {
              const mentor = connection.mentorId;

              return (
                <div
                  key={connection._id}
                  className="
bg-slate-900/80
backdrop-blur-xl
border
border-slate-700
rounded-3xl
p-6
shadow-xl
hover:border-cyan-400/40
hover:shadow-cyan-500/20
hover:-translate-y-1
transition-all
duration-300
flex
flex-col
"
                >
                  {/* Avatar */}

                  <div className="flex justify-center mb-5">
                    {mentor?.userId?.profilePhoto ? (
                      <img
                        src={mentor.userId.profilePhoto}
                        alt={mentor.name}
                        className="
                        w-24
                        h-24
                        rounded-full
                        object-cover
                        border-4
                        border-cyan-400/30
                      "
                      />
                    ) : (
                      <div
                        className="
                        w-24
                        h-24
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-500
                        to-indigo-500
                        flex
                        items-center
                        justify-center
                        text-4xl
                        font-bold
                      "
                      >
                        {mentor?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Name */}

                  <h2 className="text-2xl font-bold text-center">
                    {mentor?.name}
                  </h2>

                  <p className="text-center text-gray-400 mt-2">
                    🎓 Year {mentor?.year}
                  </p>

                  {mentor?.department && (
                    <p className="text-center text-gray-500">
                      {mentor.department}
                    </p>
                  )}

                  {/* Status */}

                  <div className="flex justify-center mt-5 mb-6">
                    <span
                      className="
                      bg-green-500/10
                      border
                      border-green-500/20
                      text-green-400
                      px-4
                      py-2
                      rounded-full
                    "
                    >
                      🟢 Connected
                    </span>
                  </div>

                  {/* Bio */}

                  <div
                    className="
                    bg-slate-800/70
                    border
                    border-slate-700
                    rounded-2xl
                    p-4
                    mb-6
                    min-h-[100px]
                  "
                  >
                    <p className="text-gray-300 text-sm">
                      {mentor?.bio ||
                        "Connected mentor ready to help with academics and career guidance."}
                    </p>
                  </div>

                  {/* Actions */}

                  <div className="flex justify-center mt-auto pt-6">
                    <button
                      onClick={() =>
                        navigate("/chat", {
                          state: {
                            mentorId: mentor._id,
                          },
                        })
                      }
                      className="
    flex
    items-center
    gap-2
    px-8
    py-3
    rounded-2xl
    bg-gradient-to-r
    from-cyan-500
    to-blue-600
    text-white
    font-semibold
    hover:from-cyan-400
    hover:to-blue-500
    hover:scale-105
    transition-all
    duration-300
    shadow-lg
    shadow-cyan-500/20
  "
                    >
                      <FaComments />
                      Open Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default MyConnections;
