import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const email =
    localStorage.getItem(
      "resetEmail"
    );

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

  const handleResetPassword =
    async (e) => {
      e.preventDefault();

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
        password !==
        confirmPassword
      ) {
        toast.error(
          "Passwords do not match"
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await API.post(
            "/api/auth/reset-password",
            {
              email,
              password,
            }
          );

        console.log(
          "SUCCESS:",
          res.data
        );

        localStorage.removeItem(
          "resetEmail"
        );

        toast.success(
          "Password Updated Successfully"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed To Reset Password"
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
          onSubmit={
            handleResetPassword
          }
          className="bg-slate-800 p-8 rounded-xl w-[450px] shadow-lg"
        >
          <h1 className="text-white text-3xl font-bold mb-6 text-center">
            Reset Password
          </h1>

          <p className="text-center text-cyan-400 mb-6">
            {email}
          </p>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter New Password"
            className="w-full p-3 mb-2 rounded bg-slate-700 text-white"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
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
            value={
              confirmPassword
            }
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
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
