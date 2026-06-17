import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-toastify";

function MentorRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/connection/mentor-requests");
      setRequests(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async (id) => {
    try {
      await API.put(`/connection/accept/${id}`);

      toast.success("Request Accepted");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/connection/reject/${id}`);

      toast.success("Request Rejected");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white p-8">
        {/* Hero Section */}

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
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Mentor Requests
            </h1>

            <p className="text-slate-100">
              Review and manage incoming student connection requests.
            </p>

            <div className="mt-5">
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                📩 {requests.length} Requests
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}

        {requests.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-5">📩</div>

            <h2 className="text-3xl font-bold mb-3">
              No Requests Yet
            </h2>

            <p className="text-gray-400">
              Incoming mentor requests will appear here.
            </p>
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
            {requests.map((request) => (
              <div
                key={request._id}
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
              "
              >
                {/* Profile */}

                <div className="flex justify-center mb-5">
                  {request.studentId?.profilePhoto ? (
                    <img
                      src={request.studentId.profilePhoto}
                      alt={request.studentId.name}
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
                      {request.studentId?.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Student Details */}

                <h2 className="text-2xl font-bold text-center">
                  {request.studentId?.name}
                </h2>

                <p className="text-center text-gray-400 mt-2">
                  {request.studentId?.email}
                </p>

                {/* Actions */}

                <div className="mt-6 flex justify-center">
                  {request.status === "pending" && (
                    <div className="flex gap-4 w-full">
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="
                        flex-1
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-green-500
                        to-emerald-600
                        font-semibold
                        hover:scale-105
                        transition
                      "
                      >
                        ✅ Accept
                      </button>

                      <button
                        onClick={() => handleReject(request._id)}
                        className="
                        flex-1
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-red-500
                        to-rose-600
                        font-semibold
                        hover:scale-105
                        transition
                      "
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {request.status === "accepted" && (
                    <span
                      className="
                      inline-flex
                      items-center
                      px-5
                      py-3
                      rounded-2xl
                      bg-green-500/10
                      text-green-400
                      border
                      border-green-500/20
                    "
                    >
                      ✅ Accepted
                    </span>
                  )}

                  {request.status === "rejected" && (
                    <span
                      className="
                      inline-flex
                      items-center
                      px-5
                      py-3
                      rounded-2xl
                      bg-red-500/10
                      text-red-400
                      border
                      border-red-500/20
                    "
                    >
                      ❌ Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MentorRequests;