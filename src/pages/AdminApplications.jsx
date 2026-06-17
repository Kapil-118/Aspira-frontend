import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Swal from "sweetalert2";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/mentor-application/all"
      );

      setApplications(res.data);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id) => {
    try {
      await API.put(
        `/mentor-application/approve/${id}`
      );

      Swal.fire({
        icon: "success",
        title: "Approved",
        text: "Mentor approved successfully",
        background: "#1e293b",
        color: "#fff",
      });

      fetchApplications();

    } catch (error) {
      console.log(error);
    }
  };

  const rejectApplication = async (id) => {
    try {
      await API.put(
        `/mentor-application/reject/${id}`
      );

      Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Application rejected",
        background: "#1e293b",
        color: "#fff",
      });

      fetchApplications();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white p-6">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Mentor Applications
        </h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-6">

            {applications.length === 0 ? (
              <div className="text-center text-gray-400">
                No Applications Found
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-slate-800 rounded-2xl p-6"
                >

                  <div className="flex flex-col md:flex-row justify-between gap-4">

                    <div>
                      <h2 className="text-2xl font-bold">
                        {app.name}
                      </h2>

                      <p>
                        Department:
                        {" "}
                        {app.department}
                      </p>

                      <p>
                        Year:
                        {" "}
                        {app.year}
                      </p>

                      <p className="mt-2">
                        {app.bio}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">

                        {app.skills.map(
                          (skill, index) => (
                            <span
                              key={index}
                              className="bg-cyan-600 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>
                    </div>

                    <div className="flex flex-col gap-3">

                      <span
                        className={`px-4 py-2 rounded-xl text-center ${
                          app.status === "approved"
                            ? "bg-green-600"
                            : app.status === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>

                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              approveApplication(
                                app._id
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              rejectApplication(
                                app._id
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
                          >
                            Reject
                          </button>
                        </>
                      )}

                    </div>

                  </div>

                </div>
              ))
            )}

          </div>
        )}
      </div>
    </>
  );
}

export default AdminApplications;