import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.jpg";
import { FaChevronDown, FaComments } from "react-icons/fa";
import { toast } from "react-toastify";
import socket from "../services/socket";
import { FaBell } from "react-icons/fa";
import { useRef } from "react";
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [mentorDropdown, setMentorDropdown] = useState(false);

  const [lostFoundDropdown, setLostFoundDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");
  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.wav");

    audio.volume = 0.6;

    audio.play().catch((error) => {
      console.log(error);
    });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMentorDropdown(false);
        setLostFoundDropdown(false);
        setProfileDropdown(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");

      setNotifications(res.data);

      const unread = res.data.filter((n) => !n.isRead).length;

      setNotificationCount(unread);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchNotifications();
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      fetchNotificationCount();
    }
    socket.on("receiveMessage", () => {
      fetchUnreadCount();
      fetchNotificationCount();
    });
    socket.on("messagesSeen", () => {
      fetchUnreadCount();
    });
    socket.on("newNotification", (notification) => {
      const audio = new Audio("/notification.wav");

      audio.play();

      toast.info(`${notification.title}`);

      fetchNotifications();
    });
    socket.on("conversationUpdated", () => {
      fetchUnreadCount();
      fetchNotificationCount();
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messagesSeen");
      socket.off("conversationUpdated");
      socket.off("newNotification");
    };
  }, [token]);
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/chat/conversations");

      const total = res.data.reduce(
        (sum, conversation) => sum + (conversation.unreadCount || 0),
        0,
      );

      setUnreadCount(total);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchNotificationCount = async () => {
    try {
      const res = await API.get("/notifications");

      const unread = res.data.filter((notification) => !notification.isRead);

      if (unread.length > notificationCount && notificationCount !== 0) {
        playNotificationSound();
      }

      setNotificationCount(unread.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getInitials = () => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    socket.emit("userOffline");
    socket.disconnect();

    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/");
    window.location.reload();
  };

  const activeClass =
    "text-cyan-400 font-semibold bg-slate-800 px-4 py-2 rounded-xl";

  const normalClass = "hover:text-cyan-400 transition";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      ref={navbarRef}
      className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/95 border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Aspira Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover"
            />

            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white">
                Aspira
              </h1>

              <p className="hidden md:block text-xs text-gray-400">
                Connect • Learn • Grow
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 text-white">
            <Link
              to="/"
              className={location.pathname === "/" ? activeClass : normalClass}
            >
              Home
            </Link>

            <div className="relative">
              <button
                onClick={() => {
                  setMentorDropdown(!mentorDropdown);
                  setLostFoundDropdown(false);
                  setProfileDropdown(false);
                }}
                className="flex items-center gap-2 hover:text-cyan-400"
              >
                Mentors
                <FaChevronDown size={12} />
              </button>

              {mentorDropdown && (
                <div
                  className="
absolute
top-12
left-0
bg-slate-800
rounded-2xl
shadow-2xl
border
border-slate-700
w-56
p-2
animate-in
fade-in
slide-in-from-top-2
duration-200
"
                >
                  <Link
                    to="/mentors"
                    className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                  >
                    Find Mentors
                  </Link>

                  {user?.role === "student" && (
                    <>
                      <Link
                        to="/become-mentor"
                        className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                      >
                        Become Mentor
                      </Link>

                      <Link
                        to="/my-connections"
                        className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                      >
                        My Connections
                      </Link>
                    </>
                  )}

                  {user?.role === "mentor" && (
                    <>
                      <Link
                        to="/mentor-requests"
                        className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                      >
                        Mentor Requests
                      </Link>

                      <Link
                        to="/my-connections"
                        className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                      >
                        My Connections
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            {user?.role === "admin" && (
              <Link
                to="/admin-applications"
                className={
                  location.pathname === "/admin-applications"
                    ? activeClass
                    : normalClass
                }
              >
                Applications
              </Link>
            )}
            <div className="relative">
              <button
                onClick={() => {
                  setLostFoundDropdown(!lostFoundDropdown);
                  setMentorDropdown(false);
                  setProfileDropdown(false);
                }}
                className="flex items-center gap-2 hover:text-cyan-400"
              >
                Lost & Found
                <FaChevronDown size={12} />
              </button>

              {lostFoundDropdown && (
                <div className="absolute top-10 left-0 bg-slate-800 rounded-xl shadow-xl w-56 p-2">
                  <Link
                    to="/lostfound"
                    className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                  >
                    Browse Items
                  </Link>

                  <Link
                    to="/upload-item"
                    className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                  >
                    Upload Item
                  </Link>

                  <Link
                    to="/my-uploads"
                    className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                  >
                    My Uploads
                  </Link>
                </div>
              )}
            </div>
            {!token ? (
              <>
                <Link
                  to="/login"
                  className={
                    location.pathname === "/login" ? activeClass : normalClass
                  }
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-xl font-semibold"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={
                    location.pathname === "/dashboard"
                      ? activeClass
                      : normalClass
                  }
                >
                  Dashboard
                </Link>

                <Link
                  to="/chat"
                  className="
  relative
  p-3
  rounded-xl
  bg-slate-800
  hover:bg-slate-700
  transition
"
                >
                  <FaComments
                    className={`
  text-xl
  transition
  ${location.pathname === "/chat" ? "text-cyan-400 scale-110" : "text-white"}
`}
                  />

                  {unreadCount > 0 && (
                    <span
                      className="
      absolute
      -top-2
      -right-2
      bg-red-500
      text-white
      text-xs
      min-w-[18px]
      h-[18px]
      rounded-full
      flex
      items-center
      justify-center
      "
                    >
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  {" "}
                  <button
                    onClick={async () => {
                      setNotificationOpen(!notificationOpen);
                      try {
                        await API.put("/notifications/read-all");
                        fetchNotifications();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    className=" relative p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition "
                  >
                    {" "}
                    <FaBell className="text-lg" />{" "}
                    {notificationCount > 0 && (
                      <span className=" absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center ">
                        {" "}
                        {notificationCount}{" "}
                      </span>
                    )}{" "}
                  </button>{" "}
                  {notificationOpen && (
                    <div className=" absolute right-0 mt-3 w-[400px] max-h-[450px] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 ">
                      {" "}
                      <div className="p-4 border-b border-slate-700">
                        {" "}
                        <div className="flex justify-between items-center">
                          {" "}
                          <h3 className="font-bold text-lg">
                            Notifications
                          </h3>{" "}
                          <button
                            onClick={async () => {
                              await API.put("/notifications/read-all");
                              fetchNotifications();
                            }}
                            className=" text-cyan-400 text-sm hover:underline "
                          >
                            {" "}
                            Mark All Read{" "}
                          </button>{" "}
                        </div>{" "}
                      </div>{" "}
                      {notifications.length === 0 ? (
                        <div className="p-6 text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={` p-4 border-b border-slate-800 ${notification.isRead ? "" : "bg-cyan-500/10"} `}
                          >
                            {" "}
                            <p className="text-sm text-white leading-relaxed">
                              {" "}
                              {notification.text}{" "}
                            </p>{" "}
                          </div>
                        ))
                      )}{" "}
                    </div>
                  )}{" "}
                </div>
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdown(!profileDropdown);
                      setMentorDropdown(false);
                      setLostFoundDropdown(false);
                    }}
                    className="flex items-center gap-3 bg-slate-800 px-3 py-2 rounded-xl"
                  >
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                        {getInitials()}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold">{user?.name}</p>

                      <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Online
                      </p>
                    </div>

                    <FaChevronDown size={12} />
                  </button>

                  {profileDropdown && (
                    <div
                      className="
  absolute
  right-0
  top-14
  w-56
  bg-slate-900
  border
  border-slate-700
  rounded-2xl
  shadow-2xl
  p-2
"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-slate-700 rounded-lg"
                      >
                        My Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-lg text-red-400"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white text-3xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 border-t border-slate-700 pt-4 text-white">
            {token && (
              <div className="flex items-center gap-3 mb-4">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                    {getInitials()}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold">{user?.name}</h3>

                  <p className="text-green-400 text-sm">Online</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>

              <Link to="/mentors" onClick={closeMenu}>
                Mentors
              </Link>

              <Link to="/lostfound" onClick={closeMenu}>
                Lost & Found
              </Link>

              {!token ? (
                <>
                  <Link to="/login" onClick={closeMenu}>
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-cyan-500 px-4 py-2 rounded-xl text-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Link
                    to="/chat"
                    onClick={closeMenu}
                    className="flex items-center gap-2"
                  >
                    <FaComments />
                    Chats
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={closeMenu}
                    className="flex items-center gap-2"
                  >
                    🔔 Notifications
                    {notificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/profile" onClick={closeMenu}>
                    Profile
                  </Link>

                  <Link to="/my-uploads" onClick={closeMenu}>
                    My Uploads
                  </Link>
                  <Link
                    to="/become-mentor"
                    className={
                      location.pathname === "/become-mentor"
                        ? activeClass
                        : normalClass
                    }
                  >
                    Become Mentor
                  </Link>
                  <Link to="/upload-item" onClick={closeMenu}>
                    Upload Item
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-red-500 py-2 rounded-xl"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
