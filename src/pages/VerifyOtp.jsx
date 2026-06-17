
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const email = localStorage.getItem("otpEmail");

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/api/otp/verify",
        {
          email,
          otp,
        }
      );

      const userData = JSON.parse(
        localStorage.getItem("pendingUser")
      );

      await API.post(
        "/api/auth/register",
        userData
      );

      localStorage.removeItem("pendingUser");
      localStorage.removeItem("otpEmail");

      toast.success(
        "OTP Verified & Registration Successful!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Invalid or Expired OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      await API.post(
        "/api/otp/register-send",
        {
          email,
        }
      );

      toast.success("OTP Sent Again");
      setTimer(30);

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP"
      );

    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <form
          onSubmit={handleVerifyOtp}
          className="bg-slate-800 p-8 rounded-xl w-[450px] shadow-lg"
        >
          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            Verify OTP
          </h1>

          <p className="text-gray-400 text-center mb-6">
            Enter the OTP sent to:
            <br />
            <span className="text-cyan-400">
              {email}
            </span>
          </p>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            className="w-full p-3 mb-4 rounded bg-slate-700 text-white text-center tracking-widest"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            required
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded text-white flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="text-center mt-4">
            {timer > 0 ? (
              <p className="text-gray-400">
                Resend OTP in{" "}
                <span className="text-cyan-400">
                  {timer}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResendOtp}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {resendLoading
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

export default VerifyOtp;
