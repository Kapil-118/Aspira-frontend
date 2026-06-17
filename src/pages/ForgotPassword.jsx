import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/api/otp/forgot-send", { email });

      localStorage.setItem("resetEmail", email);

      toast.success("OTP Sent Successfully");

      setTimeout(() => {
        navigate("/forgot-password-otp");
      }, 1000);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <form
          onSubmit={handleSendOtp}
          className="bg-slate-800 p-8 rounded-xl w-[450px] shadow-lg"
        >
          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            Forgot Password
          </h1>

          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded text-white flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
