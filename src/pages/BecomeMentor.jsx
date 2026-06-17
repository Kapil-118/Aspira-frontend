import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function BecomeMentor() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      department: "",
      year: "",
      skills: "",
      bio: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await API.post(
          "/mentor-application/apply",
          {
            ...formData,
            skills:
              formData.skills
                .split(",")
                .map((s) =>
                  s.trim()
                ),
          }
        );

        toast.success(
          "Application Submitted Successfully"
        );

        navigate(
          "/dashboard"
        );

      } catch (error) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Application Failed"
        );
      }
    };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-4">

        <form
          onSubmit={
            handleSubmit
          }
          className="bg-slate-800 p-8 rounded-3xl w-full max-w-2xl"
        >
          <h1 className="text-4xl font-bold mb-6 text-center">
            Become A Mentor
          </h1>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 mb-4 rounded-xl bg-slate-700"
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            className="w-full p-3 mb-4 rounded-xl bg-slate-700"
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="year"
            placeholder="Year"
            className="w-full p-3 mb-4 rounded-xl bg-slate-700"
            onChange={
              handleChange
            }
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            className="w-full p-3 mb-4 rounded-xl bg-slate-700"
            onChange={
              handleChange
            }
            required
          />

          <textarea
            rows="5"
            name="bio"
            placeholder="Why do you want to become a mentor?"
            className="w-full p-3 mb-6 rounded-xl bg-slate-700"
            onChange={
              handleChange
            }
            required
          />

          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-xl font-bold"
          >
            Submit Application
          </button>

        </form>

      </div>
    </>
  );
}

export default BecomeMentor;