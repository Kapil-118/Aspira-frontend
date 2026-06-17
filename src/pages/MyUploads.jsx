import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";

function MyUploads() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyUploads();
  }, []);

  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredItems(filtered);
  }, [search, items]);

  const fetchMyUploads = async () => {
    try {
      setLoading(true);

      const res = await API.get("/lostfound/my-posts");

      setItems(res.data);
      setFilteredItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: "#1e293b",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/lostfound/delete/${id}`);

      await Swal.fire({
        title: "Deleted!",
        text: "Item deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#1e293b",
        color: "#fff",
      });

      const updated = items.filter(
        (item) => item._id !== id
      );

      setItems(updated);
      setFilteredItems(updated);
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "Delete failed",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
    }
  };

  const lostCount = items.filter(
    (item) => item.type === "lost"
  ).length;

  const foundCount = items.filter(
    (item) => item.type === "found"
  ).length;

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
              My Uploads
            </h1>

            <p className="text-slate-100 max-w-2xl mx-auto text-lg">
              Manage all your lost and found item posts.
            </p>
          </div>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center hover:border-cyan-400/40 transition">
            <h3 className="text-4xl font-bold text-cyan-400">
              {items.length}
            </h3>

            <p className="text-gray-400 mt-2">
              Total Uploads
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center hover:border-red-400/40 transition">
            <h3 className="text-4xl font-bold text-red-400">
              {lostCount}
            </h3>

            <p className="text-gray-400 mt-2">
              Lost Items
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center hover:border-green-400/40 transition">
            <h3 className="text-4xl font-bold text-green-400">
              {foundCount}
            </h3>

            <p className="text-gray-400 mt-2">
              Found Items
            </p>
          </div>

        </div>

        {/* Search */}

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
            placeholder="Search your uploads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
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
          "
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24">

            <div className="text-8xl mb-6 animate-bounce">
              📦
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No Uploads Found
            </h2>

            <p className="text-gray-400 mb-6">
              Start by uploading your first item.
            </p>

            <button
              onClick={() =>
                navigate("/upload-item")
              }
              className="
              px-6
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              transition
            "
            >
              Upload Item
            </button>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="
                bg-slate-900/80
                backdrop-blur-xl
                border
                border-slate-700
                rounded-3xl
                overflow-hidden
                shadow-xl
                hover:border-cyan-400/40
                hover:shadow-cyan-500/20
                hover:-translate-y-1
                transition-all
                duration-300
              "
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6">

                  <div className="flex justify-between items-center mb-4">

                    <h2 className="text-2xl font-bold">
                      {item.title}
                    </h2>

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-semibold ${
                        item.type === "lost"
                          ? "bg-red-500/20 text-red-400 border border-red-500/20"
                          : "bg-green-500/20 text-green-400 border border-green-500/20"
                      }`}
                    >
                      {item.type.toUpperCase()}
                    </span>

                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  <p className="text-gray-400 mb-6">
                    📍 {item.location}
                  </p>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        navigate(`/edit-item/${item._id}`)
                      }
                      className="
                      flex-1
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-500
                      to-indigo-600
                      font-semibold
                      hover:scale-105
                      transition
                    "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item._id)
                      }
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
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </>
  );
}

export default MyUploads;
