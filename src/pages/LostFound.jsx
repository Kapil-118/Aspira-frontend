import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import { FaSearch } from "react-icons/fa";

function LostFound() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const res = await API.get("/lostfound/all")
      setItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : item.type === filter;

    return matchesSearch && matchesFilter;
  });

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
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute right-40 bottom-0 w-48 h-48 bg-cyan-300/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Lost & Found
            </h1>

            <p className="text-slate-100 max-w-2xl mx-auto text-lg">
              Help recover lost belongings and reconnect items with their owners.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                📦 Community Driven
              </span>

              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                🔍 Lost Items
              </span>

              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                ✅ Recovered Items
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center hover:border-cyan-400/40 transition">
            <h3 className="text-4xl font-bold text-cyan-400">
              {filteredItems.length}
            </h3>

            <p className="text-gray-400 mt-2">
              Total Items
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

        <div className="max-w-2xl mx-auto mb-8 relative">

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
            placeholder="Search items by title, description or location..."
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

        {/* Filters */}

        <div className="flex justify-center gap-3 flex-wrap mb-10">

          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-3 rounded-2xl font-semibold transition ${
              filter === "all"
                ? "bg-cyan-500"
                : "bg-slate-900 border border-slate-700 hover:border-cyan-400"
            }`}
          >
            All Items
          </button>

          <button
            onClick={() => setFilter("lost")}
            className={`px-5 py-3 rounded-2xl font-semibold transition ${
              filter === "lost"
                ? "bg-red-500"
                : "bg-slate-900 border border-slate-700 hover:border-red-400"
            }`}
          >
            Lost
          </button>

          <button
            onClick={() => setFilter("found")}
            className={`px-5 py-3 rounded-2xl font-semibold transition ${
              filter === "found"
                ? "bg-green-500"
                : "bg-slate-900 border border-slate-700 hover:border-green-400"
            }`}
          >
            Found
          </button>

        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">

            <div className="text-8xl mb-6 animate-bounce">
              📦
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No Items Found
            </h2>

            <p className="text-gray-400 mb-6">
              Try another search term or filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="
              px-6
              py-3
              rounded-xl
              bg-cyan-500
              hover:bg-cyan-600
              transition
            "
            >
              Reset Filters
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
  src={item.image || "/placeholder.png"}
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

                  <div className="flex items-center text-gray-400">
                    📍 {item.location}
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

export default LostFound;

