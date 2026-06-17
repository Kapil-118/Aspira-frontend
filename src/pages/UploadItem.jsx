import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UploadItem() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("lost");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    if (description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    if (location.trim().length < 3) {
      toast.error("Location is required");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("type", type);
      formData.append("image", image);

      await API.post("/lostfound/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Item Uploaded Successfully!");

      setTimeout(() => {
        navigate("/lostfound");
      }, 1200);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Upload Failed"
      );
    } finally {
      setLoading(false);
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
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute right-40 bottom-0 w-48 h-48 bg-cyan-300/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Upload Lost or Found Item
            </h1>

            <p className="text-slate-100 max-w-2xl mx-auto text-lg">
              Help the community recover belongings faster by sharing accurate item details.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">

          <form
            onSubmit={handleSubmit}
            className="
            bg-slate-900/80
            backdrop-blur-xl
            border
            border-slate-700
            rounded-3xl
            p-8
            shadow-2xl
          "
          >

            {/* Type Selection */}

            <label className="block mb-4 text-lg font-semibold">
              Item Type
            </label>

            <div className="grid md:grid-cols-2 gap-4 mb-8">

              <button
                type="button"
                onClick={() => setType("lost")}
                className={`
                p-5
                rounded-2xl
                border
                transition-all
                ${
                  type === "lost"
                    ? "border-red-400 bg-red-500/10"
                    : "border-slate-700 bg-slate-800"
                }
              `}
              >
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-bold">Lost Item</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Report something you've lost
                </p>
              </button>

              <button
                type="button"
                onClick={() => setType("found")}
                className={`
                p-5
                rounded-2xl
                border
                transition-all
                ${
                  type === "found"
                    ? "border-green-400 bg-green-500/10"
                    : "border-slate-700 bg-slate-800"
                }
              `}
              >
                <div className="text-4xl mb-2">📦</div>
                <h3 className="font-bold">Found Item</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Help return an item to its owner
                </p>
              </button>

            </div>

            {/* Title */}

            <input
              type="text"
              placeholder="Item Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
              w-full
              p-4
              mb-5
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              focus:outline-none
              focus:border-cyan-400
            "
            />

            {/* Description */}

            <textarea
              rows="5"
              placeholder="Describe the item in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="
              w-full
              p-4
              mb-5
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              focus:outline-none
              focus:border-cyan-400
            "
            />

            {/* Location */}

            <input
              type="text"
              placeholder="Where was it lost or found?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="
              w-full
              p-4
              mb-5
              rounded-2xl
              bg-slate-800
              border
              border-slate-700
              focus:outline-none
              focus:border-cyan-400
            "
            />

            {/* Image Upload */}

            <div
              className="
              border-2
              border-dashed
              border-slate-600
              rounded-2xl
              p-6
              text-center
              mb-6
            "
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />

              <p className="text-gray-400 text-sm mt-2">
                Upload a clear image (Max 5MB)
              </p>
            </div>

            {/* Preview */}

            {preview && (
              <div className="mb-6">
                <img
                  src={preview}
                  alt="Preview"
                  className="
                  w-full
                  h-72
                  object-cover
                  rounded-2xl
                  border
                  border-slate-700
                "
                />
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              font-semibold
              hover:scale-[1.02]
              transition-all
              duration-300
              shadow-lg
              shadow-cyan-500/20
              disabled:opacity-70
            "
            >
              {loading ? "Uploading..." : "Upload Item"}
            </button>

          </form>

        </div>
      </div>
    </>
  );
}

export default UploadItem;