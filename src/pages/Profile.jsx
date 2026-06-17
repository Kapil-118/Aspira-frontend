import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../services/api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaGithub, FaLinkedin, FaEdit, FaCamera } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);

  const [photoLoading, setPhotoLoading] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    bio: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await API.get("/auth/profile");

      setUser(res.data.user);

      setFormData({
        department: res.data.user.department || "",
        year: res.data.user.year || "",
        bio: res.data.user.bio || "",
        linkedin: res.data.user.linkedin || "",
        github: res.data.user.github || "",
      });
    } catch (error) {
      console.log(error);

      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!user?.name) return "?";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const calculateProfileCompletion = () => {
    let completed = 0;

    if (user?.name) completed++;
    if (user?.email) completed++;
    if (user?.department) completed++;
    if (user?.year) completed++;
    if (user?.bio) completed++;
    if (user?.profilePhoto) completed++;

    return Math.round((completed / 6) * 100);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      await API.put("/auth/update-profile", formData);

      toast.success("Profile Updated Successfully");

      setShowEditModal(false);

      fetchProfile();
    } catch (error) {
      console.log(error);

      toast.error("Profile Update Failed");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const data = new FormData();

    data.append("profilePhoto", file);

    try {
      setPhotoLoading(true);

      const res = await API.put("/auth/upload-photo", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser({
        ...user,
        profilePhoto: res.data.profilePhoto,
      });

      toast.success("Profile Photo Updated");
    } catch (error) {
      console.log(error);

      toast.error("Photo Upload Failed");
    } finally {
      setPhotoLoading(false);
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Profile Card */}
            <div
              className="
  bg-slate-900/80
  backdrop-blur-xl
  border
  border-slate-700
  rounded-3xl
  shadow-2xl
  overflow-hidden
"
            >
              {/* Header */}
              <div
                className="
  relative
  overflow-hidden
  bg-gradient-to-r
  from-cyan-600
  via-blue-600
  to-indigo-700
  p-8
  md:p-10
"
              >
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

                <div className="absolute bottom-0 left-20 w-52 h-52 bg-cyan-300/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="
w-32
h-32
rounded-full
object-cover
border-4
border-white
shadow-2xl
"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white text-slate-900 flex items-center justify-center text-4xl font-bold">
                        {getInitials()}
                      </div>
                    )}

                    <label className="absolute bottom-0 right-0 bg-cyan-500 p-2 rounded-full cursor-pointer hover:bg-cyan-600">
                      <FaCamera />

                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold">{user?.name}</h1>

                    <p className="text-slate-200 mt-2">{user?.email}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                      <span className="bg-green-500 px-3 py-1 rounded-full text-sm">
                        ✓ Verified
                      </span>

                      <span className="bg-slate-900 px-3 py-1 rounded-full text-sm capitalize">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={openEditModal}
                    className="
bg-white/10
backdrop-blur-md
hover:bg-white/20
px-5
py-3
rounded-2xl
flex
items-center
gap-2
transition
"
                  >
                    <FaEdit />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Completion */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex justify-between mb-2">
                  <span>Profile Completion</span>

                  <span>{calculateProfileCompletion()}%</span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="
bg-gradient-to-r
from-cyan-400
to-blue-500
h-4
rounded-full
transition-all
duration-500
"
                    style={{
                      width: `${calculateProfileCompletion()}%`,
                    }}
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <div
                  className="bg-slate-800/80
border
border-slate-700
p-5
rounded-2xl
hover:border-cyan-400/30
transition"
                >
                  <p className="text-gray-400">Department</p>

                  <h3 className="text-xl font-semibold mt-1">
                    {user?.department || "Not Added"}
                  </h3>
                </div>

                <div className="bg-slate-700 p-5 rounded-xl">
                  <p className="text-gray-400">Year</p>

                  <h3 className="text-xl font-semibold mt-1">
                    {user?.year || "Not Added"}
                  </h3>
                </div>

                <div className="bg-slate-700 p-5 rounded-xl md:col-span-2">
                  <p className="text-gray-400">Bio</p>

                  <h3 className="text-lg mt-2">
                    {user?.bio || "No bio added yet"}
                  </h3>
                </div>

                <div className="bg-slate-700 p-5 rounded-xl">
                  <p className="text-gray-400 mb-2">LinkedIn</p>

                  {user?.linkedin ? (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-cyan-400"
                    >
                      <FaLinkedin />
                      Open Profile
                    </a>
                  ) : (
                    "Not Added"
                  )}
                </div>

                <div className="bg-slate-700 p-5 rounded-xl">
                  <p className="text-gray-400 mb-2">GitHub</p>

                  {user?.github ? (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-cyan-400"
                    >
                      <FaGithub />
                      Open Profile
                    </a>
                  ) : (
                    "Not Added"
                  )}
                </div>
              </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4">
                <form
                  onSubmit={handleUpdateProfile}
                  className="
bg-slate-900
border
border-slate-700
w-full
max-w-lg
p-6
rounded-3xl
shadow-2xl
"
                >
                  <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="
w-full
p-3
mb-4
rounded-xl
bg-slate-800
border
border-slate-700
focus:border-cyan-400
outline-none
"
                  />

                  <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="
w-full
p-3
mb-4
rounded-xl
bg-slate-800
border
border-slate-700
focus:border-cyan-400
outline-none
"
                  />

                  <textarea
                    name="bio"
                    placeholder="Bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="
w-full
p-3
mb-4
rounded-xl
bg-slate-800
border
border-slate-700
focus:border-cyan-400
outline-none
"
                  />

                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn URL (Optional)"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="
w-full
p-3
mb-4
rounded-xl
bg-slate-800
border
border-slate-700
focus:border-cyan-400
outline-none
"
                  />

                  <input
                    type="text"
                    name="github"
                    placeholder="GitHub URL (Optional)"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full p-3 mb-6 rounded bg-slate-700"
                  />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {photoLoading && (
              <div className="fixed bottom-5 right-5 bg-cyan-500 px-5 py-3 rounded-xl">
                Uploading Photo...
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
