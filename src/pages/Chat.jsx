import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import socket from "../services/socket";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [typingUser, setTypingUser] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    fetchConversations();

    const sendOnlineStatus = async () => {
      try {
        const res = await API.get("/auth/profile");

        socket.emit("userOnline", res.data.user._id);
      } catch (error) {
        console.log(error);
      }
    };

    sendOnlineStatus();

    socket.on("userTyping", (data) => {
      setTypingUser(data.userName);
    });

    socket.on("userStoppedTyping", () => {
      setTypingUser("");
    });
    socket.emit("messagesSeen");
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === message._id);

        if (exists) return prev;

        return [...prev, message];
      });

      if (selectedConversation) {
        fetchMessages(selectedConversation._id);
      }
      socket.emit("messagesSeen");
      fetchConversations();
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("conversationUpdated", () => {
      fetchConversations();
    });
    socket.on("messageDeleted", (data) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
    });
    socket.on("messageDeletedForEveryone", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? data.updatedMessage : msg,
        ),
      );
    });
    socket.on("messagesSeen", () => {
      if (selectedConversation) {
        fetchMessages(selectedConversation._id);
      }
    });
    return () => {
      socket.off("receiveMessage");
      socket.off("messageDeleted");
      socket.off("onlineUsers");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("conversationUpdated");
      socket.off("messagesSeen");
      socket.off("messageDeletedForEveryone");
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await API.get("/chat/conversations");

      setConversations(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);

      const res = await API.get(`/chat/messages/${conversationId}`);

      setMessages(res.data);

      fetchConversations();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      socket.emit("joinConversation", selectedConversation._id);

      fetchMessages(selectedConversation._id);

      socket.emit("messagesSeen");

      fetchConversations();
    }
  }, [selectedConversation]);
  const sendMessage = async (text, replyTo = null) => {
    try {
      const res = await API.post("/chat/send", {
        conversationId: selectedConversation._id,

        text,

        replyTo,
      });

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", res.data);

      fetchConversations();
    } catch (error) {
      console.log(error);
    }
  };
  const sendImage = async (file, replyTo = null) => {
    try {
      const formData = new FormData();

      formData.append("image", file);

      formData.append("conversationId", selectedConversation._id);

      if (replyTo) {
        formData.append("replyTo", replyTo);
      }

      const res = await API.post("/chat/send-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", res.data);

      fetchConversations();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />

      <div className="h-[calc(100vh-80px)] flex bg-slate-950 text-white">
        <div
          className={`
    ${sidebarOpen ? "block" : "hidden"}
  `}
        >
          <ChatSidebar
            conversations={conversations}
            setSelectedConversation={setSelectedConversation}
            setSidebarOpen={setSidebarOpen}
            onlineUsers={onlineUsers}
            selectedConversationId={selectedConversationId}
            setSelectedConversationId={setSelectedConversationId}
          />
        </div>

        {selectedConversation ? (
          <ChatWindow
            messages={messages}
            setMessages={setMessages}
            onSend={sendMessage}
            onSendImage={sendImage}
            selectedConversation={selectedConversation}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            typingUser={typingUser}
            onlineUsers={onlineUsers}
            loadingMessages={loadingMessages}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-7xl mb-5"></div>

            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to Aspira Chat
            </h2>

            <p className="text-gray-400">Connect • Learn • Grow</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
