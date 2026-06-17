import { useEffect, useState } from "react";
import API from "../services/api";

function ChatSidebar({
  conversations,
  setSelectedConversation,
  setSidebarOpen,
  onlineUsers,
  selectedConversationId,
  setSelectedConversationId,
}) {
  const [currentUser, setCurrentUser] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");

      setCurrentUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const getOtherUser = (conversation) => {
    if (!currentUser) return null;

    return conversation.participants.find(
      (user) => user._id !== currentUser._id,
    );
  };

  const filteredConversations = conversations.filter((conversation) => {
    if (!currentUser) return true;

    const otherUser = conversation.participants.find(
      (user) => user._id !== currentUser._id,
    );

    return otherUser?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div
      className="
    w-full
md:w-[340px]
    bg-slate-900
    border-r
    border-slate-700/50
    overflow-y-auto
    backdrop-blur-xl
  "
    >
      {/* Header */}

      <div className="p-5 border-b border-slate-700">
        <h2
          className="
    text-3xl
    font-bold
    text-white
    mb-4
    tracking-wide
  "
        >
          Chats
        </h2>

        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
w-full
px-4
py-3
rounded-2xl
bg-slate-800
border
border-slate-700
text-white
placeholder:text-gray-500
focus:border-cyan-400
focus:ring-2
focus:ring-cyan-400/20
outline-none
transition-all
"
        />
      </div>

      {/* Conversations */}

      {filteredConversations.length === 0 ? (
        <div className="p-5 text-gray-400">No chats found</div>
      ) : (
        filteredConversations.map((conversation) => {
          const otherUser = getOtherUser(conversation);

          return (
            <div
              key={conversation._id}
              onClick={() => {
                setSelectedConversation(conversation);
                setSelectedConversationId(conversation._id);

                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className={`
mx-2
my-1
p-4
rounded-2xl
cursor-pointer
transition-all
duration-200
hover:scale-[1.01]
border

${
  selectedConversationId === conversation._id
    ? "bg-cyan-500/15 border-cyan-400 shadow-lg shadow-cyan-500/10"
    : "border-transparent hover:bg-slate-800 hover:border-slate-700"
}
`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {otherUser?.profilePhoto ? (
                    <img
                      src={otherUser.profilePhoto}
                      alt={otherUser.name}
                      className="
        w-14
        h-14
        rounded-full
        object-cover
        border
        border-slate-600
      "
                    />
                  ) : (
                    <div
                      className="
        w-14
        h-14
        rounded-full
        bg-cyan-500
        flex
        items-center
        justify-center
        font-bold
        text-white
      "
                    >
                      {otherUser?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`
    absolute
    bottom-0
    right-0
    w-3.5
    h-3.5
    rounded-full
    border-2
    border-slate-900
    ${onlineUsers?.includes(otherUser?._id) ? "bg-green-500" : "bg-gray-500"}
  `}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3
                      className="
    font-semibold
    text-white
    text-[15px]
    tracking-wide
    truncate
  "
                    >
                      {otherUser?.name}
                    </h3>

                    <span className="text-xs text-cyan-400 whitespace-nowrap ml-2">
                      {conversation.lastMessageTime
                        ? new Date(
                            conversation.lastMessageTime,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <p
                      className="
    text-sm
    text-gray-400
    truncate
    max-w-[200px]
  "
                    >
                      {conversation.lastMessage || "No messages yet"}
                    </p>

                    {conversation.unreadCount > 0 && (
                      <div
                        className="
    bg-cyan-500
    text-white
    text-xs
    font-bold
    min-w-[24px]
    h-[24px]
    rounded-full
    flex
    items-center
    justify-center
    px-1
    ml-2
    shadow-lg
  "
                      >
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ChatSidebar;
