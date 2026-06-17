import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center">
      <h1 className="text-8xl font-bold text-blue-500 mb-4">
        404
      </h1>

      <h2 className="text-3xl font-semibold mb-4">
        Oops! Page Not Found
      </h2>

      <p className="text-gray-400 mb-8">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;