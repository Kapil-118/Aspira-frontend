import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function MentorCard({ mentor, requestStatus }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(requestStatus);

  const handleConnect = async () => {
    try {
      setLoading(true);

      await API.post(`/connection/send/${mentor._id}`);

      setStatus("pending");

      toast.success("Connection Request Sent");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const getButton = () => {
    if (status === "pending") {
      return (
        <button
          disabled
          className="
          w-full
          bg-yellow-500/15
          text-yellow-400
          border
          border-yellow-500/20
          py-3
          rounded-2xl
          font-semibold
          cursor-not-allowed
        "
        >
          Request Sent ⏳
        </button>
      );
    }

    if (status === "accepted") {
      return (
        <button
          disabled
          className="
          w-full
          bg-green-500/15
          text-green-400
          border
          border-green-500/20
          py-3
          rounded-2xl
          font-semibold
          cursor-not-allowed
        "
        >
          Connected ✅
        </button>
      );
    }

    if (status === "rejected") {
      return (
        <button
          disabled
          className="
          w-full
          bg-red-500/15
          text-red-400
          border
          border-red-500/20
          py-3
          rounded-2xl
          font-semibold
          cursor-not-allowed
        "
        >
          Rejected ❌
        </button>
      );
    }

    return (
      <button
        onClick={handleConnect}
        disabled={loading}
        className="
        w-full
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        py-3
        rounded-2xl
        font-semibold
        hover:scale-[1.02]
        transition-all
        duration-300
        shadow-lg
        shadow-cyan-500/20
      "
      >
        {loading ? "Sending..." : "Connect"}
      </button>
    );
  };

  return (
    <div
      className="
      group
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
      {/* Profile Photo */}

      <div className="flex justify-center mb-5">
        {mentor?.userId?.profilePhoto ? (
          <img
            src={mentor.userId.profilePhoto}
            alt={mentor.name}
            className="
            w-28
            h-28
            rounded-full
            object-cover
            border-4
            border-cyan-400/30
            shadow-xl
          "
          />
        ) : (
          <div
            className="
            w-28
            h-28
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            to-indigo-500
            flex
            items-center
            justify-center
            text-5xl
            font-bold
            text-white
            shadow-xl
          "
          >
            {mentor.name?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}

      <h2 className="text-3xl font-bold text-center text-white">
        {mentor.name}
      </h2>

      <p className="text-center text-cyan-400 font-medium mt-1">Mentor</p>

      {/* Department & Year */}

      <div className="flex justify-center gap-4 mt-4 mb-5">
        <span className="text-gray-400 text-sm">🎓 Year {mentor.year}</span>

        {mentor.userId?.department && (
          <span className="text-gray-400 text-sm">
            • {mentor.userId.department}  
          </span>
        )}
      </div>

      {/* Availability */}

      <div className="flex justify-center mb-5">
        <span
          className="
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-green-500/10
          text-green-400
          border
          border-green-500/20
        "
        >
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          Available
        </span>
      </div>

      {/* Skills */}

      <div className="mb-5">
        <h3 className="font-semibold mb-3 text-gray-300">Skills</h3>

        <div className="flex flex-wrap gap-2">
          {mentor.skills?.map((skill, index) => (
            <span
              key={index}
              className="
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-cyan-300
              px-3
              py-2
              rounded-full
              text-sm
            "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-3 mb-5">
  {mentor.userId?.linkedin && (
    <a
      href={mentor.userId.linkedin}
      target="_blank"
      rel="noreferrer"
      className="
      px-4
      py-2
      rounded-xl
      bg-blue-500/10
      border
      border-blue-500/20
      text-blue-400
      hover:bg-blue-500/20
      transition
      "
    >
      LinkedIn
    </a>
  )}

  {mentor.userId?.github && (
    <a
      href={mentor.userId.github}
      target="_blank"
      rel="noreferrer"
      className="
      px-4
      py-2
      rounded-xl
      bg-slate-700
      hover:bg-slate-600
      transition
      "
    >
      GitHub
    </a>
  )}
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
        min-h-[90px]
      "
      >
        <p className="text-gray-300 text-sm leading-relaxed">
          {mentor.bio ||
            "Passionate mentor ready to help students with academics, projects and career growth."}
        </p>
      </div>

      {/* Connect Button */}

      {getButton()}
    </div>
  );
}

export default MentorCard;
