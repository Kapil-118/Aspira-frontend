import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Mentors from "./pages/Mentors";
import LostFound from "./pages/LostFound";
import UploadItem from "./pages/UploadItem";
import Profile from "./pages/Profile";
import MyUploads from "./pages/MyUploads";
import EditItem from "./pages/EditItem";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPasswordOtp from "./pages/ForgotPasswordOtp";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import BecomeMentor from "./pages/BecomeMentor";
import AdminApplications from "./pages/AdminApplications";
import MentorRequests from "./pages/MentorRequests";
import MyConnections from "./pages/MyConnections";
import Chat from "./pages/Chat";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/lostfound" element={<LostFound />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* Registration OTP */}
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Forgot Password Flow */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/forgot-password-otp" element={<ForgotPasswordOtp />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload-item"
            element={
              <ProtectedRoute>
                <UploadItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-uploads"
            element={
              <ProtectedRoute>
                <MyUploads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-item/:id"
            element={
              <ProtectedRoute>
                <EditItem />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
          <Route
            path="/become-mentor"
            element={
              <ProtectedRoute>
                <BecomeMentor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-applications"
            element={
              <ProtectedRoute>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor-requests"
            element={
              <ProtectedRoute>
                <MentorRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-connections"
            element={
              <ProtectedRoute>
                <MyConnections />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
