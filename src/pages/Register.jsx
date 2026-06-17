import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const hasUpperCase =
    /[A-Z]/.test(password);

  const hasLowerCase =
    /[a-z]/.test(password);

  const hasNumber =
    /\d/.test(password);

  const hasSpecial =
    /[@$!%*?&]/.test(password);

  const hasLength =
    password.length >= 8;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (name.trim().length < 3) {
      toast.error(
        "Name must be at least 3 characters"
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email.trim()
      )
    ) {
      toast.error(
        "Enter a valid email address"
      );
      return;
    }

    if (
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecial ||
      !hasLength
    ) {
      toast.error(
        "Password does not meet requirements"
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register",
        {
          email: email
            .trim()
            .toLowerCase(),
        }
      );

      localStorage.setItem(
        "pendingUser",
        JSON.stringify({
          name: name.trim(),
          email: email
            .trim()
            .toLowerCase(),
          password,
        })
      );

      localStorage.setItem(
        "otpEmail",
        email
          .trim()
          .toLowerCase()
      );

      toast.success(
        "OTP Sent Successfully!"
      );

      setTimeout(() => {
        navigate("/verify-otp");
      }, 1000);

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <form
          onSubmit={handleRegister}
          className="bg-slate-800 p-8 rounded-xl w-[450px] shadow-lg"
        >
          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            Create Account
          </h1>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            className="w-full p-3 mb-2 rounded bg-slate-700 text-white"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="button"
            className="text-cyan-400 text-sm mb-3"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
          >
            {showPassword
              ? "🙈 Hide Password"
              : "👁 Show Password"}
          </button>

          <div className="text-sm mb-4 space-y-1">

            <p
              className={
                hasLength
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {hasLength
                ? "✓"
                : "✗"}{" "}
              Minimum 8 characters
            </p>

            <p
              className={
                hasUpperCase
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {hasUpperCase
                ? "✓"
                : "✗"}{" "}
              1 Uppercase Letter
            </p>

            <p
              className={
                hasLowerCase
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {hasLowerCase
                ? "✓"
                : "✗"}{" "}
              1 Lowercase Letter
            </p>

            <p
              className={
                hasNumber
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {hasNumber
                ? "✓"
                : "✗"}{" "}
              1 Number
            </p>

            <p
              className={
                hasSpecial
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {hasSpecial
                ? "✓"
                : "✗"}{" "}
              1 Special Character
            </p>

          </div>

          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            className="w-full p-3 rounded bg-slate-700 text-white"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            required
          />

          <button
            type="button"
            className="text-cyan-400 text-sm mt-2 mb-4"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
          >
            {showConfirmPassword
              ? "🙈 Hide Confirm Password"
              : "👁 Show Confirm Password"}
          </button>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded text-white flex justify-center items-center gap-2 disabled:opacity-70"
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

export default Register;

