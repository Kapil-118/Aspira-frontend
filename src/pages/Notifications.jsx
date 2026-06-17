import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    markAsRead();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white px-4 md:px-8 py-8">
        <div
          className="
          bg-gradient-to-r
          from-cyan-600
          via-blue-600
          to-indigo-700
          rounded-3xl
          p-8
          mb-10
        "
        >
          <h1 className="text-4xl font-bold">
            🔔 Notifications
          </h1>

          <p className="mt-2 text-slate-100">
            Stay updated with mentor requests and activity.
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-5">🔔</div>

            <h2 className="text-3xl font-bold">
              No Notifications
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="
                bg-slate-900
                border
                border-slate-700
                rounded-2xl
                p-5
                "
              >
                <p className="font-medium">
                  {notification.text}
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  {new Date(
                    notification.createdAt,
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Notifications;