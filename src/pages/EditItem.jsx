import { useState, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [location, setLocation] =
    useState("");
  const [type, setType] =
    useState("lost");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/lostfound/all"
      );

      const item = res.data.find(
        (item) => item._id === id
      );

      if (item) {
        setTitle(item.title);
        setDescription(item.description);
        setLocation(item.location);
        setType(item.type);
      }

    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load item"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(
        `/lostfound/update/${id}`,
        {
          title,
          description,
          location,
          type,
        }
      );

      toast.success(
        "Item Updated Successfully"
      );

      setTimeout(() => {
        navigate("/my-uploads");
      }, 1200);

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Update Failed"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-950 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white px-4 py-8">

        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">

            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Edit Item
            </h1>

            <p className="text-gray-400">
              Update your lost or found item details
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleUpdate}
            className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl"
          >

            <div className="mb-5">

              <label className="block mb-2 text-gray-300">
                Item Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-cyan-500"
                required
              />

            </div>

            <div className="mb-5">

              <label className="block mb-2 text-gray-300">
                Description
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="w-full p-4 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-cyan-500"
                required
              />

            </div>

            <div className="mb-5">

              <label className="block mb-2 text-gray-300">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                className="w-full p-4 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-cyan-500"
                required
              />

            </div>

            <div className="mb-8">

              <label className="block mb-2 text-gray-300">
                Item Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-cyan-500"
              >
                <option value="lost">
                  Lost
                </option>

                <option value="found">
                  Found
                </option>
              </select>

            </div>

            <div className="flex flex-col md:flex-row gap-4">

              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 py-4 rounded-xl font-semibold transition"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/my-uploads")
                }
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-4 rounded-xl font-semibold transition"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}

export default EditItem;