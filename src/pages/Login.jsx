import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login",{
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("userName", res.data.name);

      localStorage.setItem("userEmail", res.data.email);

      localStorage.setItem("role", res.data.role);

      toast.success("Login Successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <form
          onSubmit={handleLogin}
          className="bg-slate-800 p-8 rounded-xl w-[400px] shadow-lg"
        >
          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 rounded bg-slate-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="text-cyan-400 text-sm mt-2 mb-4"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈 Hide Password" : "👁 Show Password"}
          </button>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white flex justify-center items-center gap-2 disabled:opacity-70"
            type="submit"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging In...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
