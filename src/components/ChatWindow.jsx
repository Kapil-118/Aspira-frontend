import { useState, useRef, useEffect } from "react";
import { FaBars, FaArrowLeft, FaSearch, FaTimes } from "react-icons/fa";
import API from "../services/api";
import socket from "../services/socket";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
function ChatWindow({
  messages,
  loadingMessages,
  setMessages,
  onSend,
  onSendImage,
  selectedConversation,
  sidebarOpen,
  setSidebarOpen,
  typingUser,
  onlineUsers,
}) {
  const [text, setText] = useState("");
  const [chatUser, setChatUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [toast, setToast] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const longPressRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});
  const messagesContainerRef = useRef(null);
  const [highlightedMessage, setHighlightedMessage] = useState(null);
  const attachmentInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [viewImage, setViewImage] = useState("");
  const [editText, setEditText] = useState("");
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/profile");

      setCurrentUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const formatLastSeen = (date) => {
    if (!date) return "Offline";

    const lastSeen = new Date(date);
    const now = new Date();

    const isToday = lastSeen.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday = lastSeen.toDateString() === yesterday.toDateString();

    const time = lastSeen.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Last seen today at ${time}`;
    }

    if (isYesterday) {
      return `Last seen yesterday at ${time}`;
    }

    return `Last seen ${lastSeen.toLocaleDateString()} at ${time}`;
  };

  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const res = await API.get("/auth/profile");

        const currentUser = res.data.user;

        const otherUser = selectedConversation?.participants?.find(
          (user) => user._id !== currentUser._id,
        );

        setChatUser(otherUser);
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedConversation) {
      fetchChatUser();
    }
  }, [selectedConversation]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const nearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      setIsAtBottom(nearBottom);

      if (nearBottom) {
        setShowScrollButton(false);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      setShowScrollButton(true);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;

    if (sending) return;

    try {
      setSending(true);

      await onSend(text, replyMessage?._id);

      setText("");
      setReplyMessage(null);

      socket.emit("stopTyping", {
        conversationId: selectedConversation._id,
      });

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);

    const user = JSON.parse(localStorage.getItem("user")) || {};

    socket.emit("typing", {
      conversationId: selectedConversation._id,

      userName: user?.name || "User",
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        conversationId: selectedConversation._id,
      });
    }, 1000);
  };
  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };
  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5 MB");
      return;
    }

    setImageError("");

    setSelectedImage(file);

    setImagePreview(URL.createObjectURL(file));
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  };
  const sendSelectedImage = async () => {
    if (!selectedImage || sendingImage) return;

    try {
      setSendingImage(true);

      await onSendImage(selectedImage, replyMessage?._id);

      setSelectedImage(null);

      setImagePreview("");

      setReplyMessage(null);

      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSendingImage(false);
    }
  };
  const sendSelectedFile = async () => {
    if (!selectedFile) return;

    try {
      await sendFile(selectedFile);

      setSelectedFile(null);
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const sendFile = async (file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      formData.append("conversationId", selectedConversation._id);

      const res = await API.post("/chat/send-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "pdf":
        return "📕";

      case "doc":
      case "docx":
        return "📄";

      case "xls":
      case "xlsx":
        return "📊";

      case "ppt":
      case "pptx":
        return "📽️";

      case "zip":
        return "📦";

      default:
        return "📎";
    }
  };
  const jumpToMessage = (messageId) => {
    const element = messageRefs.current[messageId];

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlightedMessage(messageId);

    setTimeout(() => {
      setHighlightedMessage(null);
    }, 2000);
  };
  const formatDateSeparator = (date) => {
    const today = new Date();

    const messageDate = new Date(date);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const deleteMessage = async (messageId) => {
    try {
      await API.delete(`/chat/message/${messageId}`);

      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));

      socket.emit("messageDeleted", {
        messageId,
        conversationId: selectedConversation._id,
      });

      setShowDeleteMenu(false);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteForEveryone = async (messageId) => {
    try {
      const res = await API.put(`/chat/delete-for-everyone/${messageId}`);

      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? res.data : msg)),
      );
      await fetchConversations();
      socket.emit("messageDeletedForEveryone", {
        messageId,
        updatedMessage: res.data,
      });

      setShowDeleteMenu(false);
    } catch (error) {
      console.log(error);
    }
  };
  const searchMessages = async (value) => {
    try {
      setSearchText(value);

      if (!value.trim()) {
        const res = await API.get(`/chat/messages/${selectedConversation._id}`);

        setMessages(res.data);

        return;
      }

      const res = await API.get(
        `/chat/search/${selectedConversation._id}?query=${value}`,
      );

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const editMessage = async () => {
    try {
      const res = await API.put(`/chat/message/${selectedMessage}`, {
        text: editText,
      });

      setMessages((prev) =>
        prev.map((msg) => (msg._id === selectedMessage ? res.data : msg)),
      );

      setEditMode(false);

      setEditText("");

      setShowDeleteMenu(false);
    } catch (error) {
      console.log(error);
    }
  };
  const reactToMessage = async (messageId, emoji) => {
    try {
      const res = await API.post(`/chat/react/${messageId}`, { emoji });

      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? res.data : msg)),
      );

      setShowReactionMenu(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLongPress = (messageId) => {
    longPressRef.current = setTimeout(() => {
      setSelectedMessage(messageId);

      setShowDeleteMenu(true);
    }, 600);
  };

  const cancelLongPress = () => {
    clearTimeout(longPressRef.current);
  };
  const selectedMsg = messages.find((m) => m._id === selectedMessage);

  const isTextMessage =
    selectedMsg?.text && !selectedMsg?.image && !selectedMsg?.fileUrl;

  const isImageMessage = !!selectedMsg?.image;

  const isFileMessage = !!selectedMsg?.fileUrl;

  return (
    <div
      className={`
    flex-1
    flex
    flex-col
    bg-gradient-to-b
    from-slate-900
    via-slate-950
    to-black
    relative

        ${sidebarOpen ? "hidden md:flex" : "flex"}
      `}
    >
      {/* Header */}

      <div
        className="
  flex
  items-center
  justify-between
  px-3
md:px-6
py-3
md:py-4
  border-b
  border-slate-700/50
  bg-slate-900/60
backdrop-blur-2xl
  sticky
  top-0
  z-20
"
      >
        {showSearch ? (
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchText("");

                if (selectedConversation) {
                  API.get(`/chat/messages/${selectedConversation._id}`).then(
                    (res) => setMessages(res.data),
                  );
                }
              }}
              className="text-cyan-400"
            >
              <FaArrowLeft />
            </button>

            <input
              autoFocus
              value={searchText}
              onChange={(e) => searchMessages(e.target.value)}
              placeholder="Search messages..."
              className="
flex-1
px-5
py-3
rounded-2xl
bg-slate-900
border
border-slate-700
text-white
placeholder:text-gray-500
focus:border-cyan-400
focus:ring-2
focus:ring-cyan-400/20
outline-none
transition-all
shadow-inner
"
            />

            <button
              onClick={() => {
                setShowSearch(false);
                setSearchText("");

                if (selectedConversation) {
                  API.get(`/chat/messages/${selectedConversation._id}`).then(
                    (res) => setMessages(res.data),
                  );
                }
              }}
              className="text-red-400"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-cyan-400 text-xl"
              >
                <FaBars />
              </button>

              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-cyan-400"
              >
                <FaArrowLeft />
              </button>

              <div className="flex items-center gap-3">
                {chatUser?.profilePhoto ? (
                  <img
                    src={chatUser.profilePhoto}
                    alt="Profile"
                    className="
w-9
h-9
md:w-11
md:h-11
rounded-full
object-cover
ring-2
ring-cyan-500/30
"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
                    {chatUser?.name?.charAt(0)}
                  </div>
                )}

                <div>
                  <h2 className="font-bold text-sm md:text-lg">
                    {chatUser?.name}
                  </h2>

                  <div className="flex items-center gap-2">
                    {onlineUsers?.includes(chatUser?._id) ? (
                      <>
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-green-400 text-xs font-medium">
                          Online
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        {formatLastSeen(chatUser?.lastSeen)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSearch(true)}
              className="
        text-cyan-400
        text-lg
        hover:text-cyan-300
      "
            >
              <FaSearch />
            </button>
          </>
        )}
      </div>

      {/* Messages */}

      <div
        ref={messagesContainerRef}
        style={{
          backgroundAttachment: "fixed",
        }}
        className="
flex-1
overflow-y-auto
px-6
py-5
relative
bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)]
before:absolute
before:inset-0
before:bg-[radial-gradient(circle,_rgba(6,182,212,0.06)_1px,transparent_1px)]
before:bg-[size:30px_30px]
before:pointer-events-none
"
      >
        {loadingMessages ? (
          <div className="space-y-4 animate-pulse">
            <div className="w-40 h-14 bg-slate-800 rounded-3xl"></div>

            <div className="w-64 h-20 bg-slate-800 rounded-3xl ml-auto"></div>

            <div className="w-52 h-16 bg-slate-800 rounded-3xl"></div>

            <div className="w-72 h-24 bg-slate-800 rounded-3xl ml-auto"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-7xl mb-4">💬</div>

            <h2 className="text-2xl font-bold text-white">No Messages Yet</h2>

            <p className="text-gray-400 mt-2">
              Start the conversation and connect.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isMine =
                currentUser && message.senderId?._id === currentUser._id;
              const previousMessage = messages[index - 1];

              const showDateSeparator =
                !previousMessage ||
                new Date(previousMessage.createdAt).toDateString() !==
                  new Date(message.createdAt).toDateString();

              return (
                <div key={message._id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div
                        className="
bg-slate-900/70
backdrop-blur-xl
text-gray-300
text-xs
px-5
py-2
rounded-full
shadow-lg
border
border-slate-700/50
"
                      >
                        {formatDateSeparator(message.createdAt)}
                      </div>
                    </div>
                  )}

                  <div
                    ref={(el) => (messageRefs.current[message._id] = el)}
                    style={{
                      animation: "fadeInUp 0.25s ease",
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();

                      setSelectedMessage(message._id);

                      setShowDeleteMenu(true);
                    }}
                    onTouchStart={() => {
                      handleLongPress(message._id);
                    }}
                    onTouchEnd={cancelLongPress}
                    className={`
  flex
  mb-2
  ${isMine ? "justify-end" : "justify-start"}
  ${highlightedMessage === message._id ? "animate-pulse" : ""}
`}
                  >
                    <div
                      className={`
    px-4
    py-3
    max-w-[85%]
md:max-w-[75%]
    shadow-xl
    transition-all
    duration-200
   hover:scale-[1.015]
   hover:shadow-2xl
hover:-translate-y-[1px]

    ${
      isMine
        ? `
          bg-gradient-to-r
          from-cyan-500
          to-cyan-600
          rounded-tl-3xl
          rounded-tr-3xl
          rounded-bl-3xl
          rounded-br-md
        `
        : `
          bg-slate-800
          border
          border-slate-700
          rounded-tl-md
          rounded-tr-3xl
          rounded-bl-3xl
          rounded-br-3xl
        `
    }
  `}
                    >
                      <div className="text-[11px] font-medium text-cyan-200 mb-1">
                        {message.senderId?.name}
                      </div>

                      <>
                        {message.replyTo && (
                          <div
                            onClick={() => jumpToMessage(message.replyTo._id)}
                            className="
    mb-2
    p-3
   bg-slate-900/40
backdrop-blur-md
border
border-cyan-500/20
    backdrop-blur-sm
    rounded-xl
    border-l-4
    border-cyan-400
    cursor-pointer
    hover:bg-black/30
    transition-all
    duration-200
  "
                          >
                            <div className="text-xs text-cyan-300">
                              {message.replyTo?.senderId?.name}
                            </div>

                            <div className="text-xs truncate">
                              {message.replyTo?.text || "📷 Image"}
                            </div>
                          </div>
                        )}
                        {message.deletedForEveryone ? (
                          <div
                            className="
      italic
      text-gray-300
    "
                          >
                            {isMine
                              ? "You deleted this message"
                              : "This message was deleted"}
                          </div>
                        ) : (
                          <>
                            {message.text && <div>{message.text}</div>}

                            {message.image && (
                              <img
                                src={message.image}
                                alt="Shared"
                                className="
mt-2
rounded-2xl
max-w-[280px]
cursor-pointer
hover:opacity-95
hover:scale-[1.02]
transition-all
duration-200
shadow-xl
"
                                onClick={() => setViewImage(message.image)}
                              />
                            )}
                          </>
                        )}
                        {message.fileUrl && (
                          <a
                            href={`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/${message.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="
mt-3
flex
items-center
gap-2 md:gap-3
bg-gradient-to-r
from-slate-800/80
to-slate-700/60
backdrop-blur-md
p-3 md:p-4
rounded-2xl
border
border-white/10
hover:border-cyan-400/30
hover:shadow-lg
hover:shadow-cyan-500/10
hover:scale-[1.02]
transition-all
duration-200
"
                          >
                            <span className="text-xl">
                              {getFileIcon(message.fileName)}
                            </span>

                            <span className="truncate">{message.fileName}</span>
                          </a>
                        )}
                      </>

                      <div className="flex justify-end items-center gap-1 text-[10px] mt-3 opacity-70">
                        <div className="flex items-center gap-1">
                          <span>{formatTime(message.createdAt)}</span>

                          {message.edited && (
                            <span className="text-[9px]">(edited)</span>
                          )}
                          {message.reactions?.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {message.reactions.map((reaction, index) => (
                                <div
                                  key={index}
                                  className="
bg-slate-900/70
border
border-slate-700
px-2
py-1
rounded-full
text-sm
shadow-md
"
                                >
                                  {reaction.emoji}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {isMine && (
                          <>
                            {message.isSeen ? (
                              <span className="text-sky-300 font-bold">✓✓</span>
                            ) : message.delivered ? (
                              <span>✓✓</span>
                            ) : (
                              <span>✓</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* New Messages Button */}

      {showScrollButton && (
        <button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth",
            });

            setShowScrollButton(false);
          }}
          className="
absolute
bottom-24
right-6
bg-gradient-to-r
from-cyan-500
to-cyan-600
text-white
px-5
py-3
rounded-full
shadow-xl
hover:scale-105
transition-all
z-50
"
        >
          ⬇ New Messages
        </button>
      )}

      {/* Typing */}

      {typingUser && (
        <div className="px-4 py-2 text-sm text-cyan-400 animate-pulse">
          <div className="flex items-center gap-2">
            <span>{typingUser} is typing</span>

            <div className="flex gap-1">
              <span className="animate-bounce">•</span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.15s" }}
              >
                •
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "0.3s" }}
              >
                •
              </span>
            </div>
          </div>
        </div>
      )}
      {showDeleteMenu && (
        <div
          className="
    absolute
    inset-0
    bg-black/40
    flex
    items-center
    justify-center
    z-[999]
  "
          onClick={() => setShowDeleteMenu(false)}
        >
          <div
            className="
    bg-slate-900/95
backdrop-blur-xl
border
border-slate-700
shadow-2xl
p-5
rounded-2xl
w-[320px]
  "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <button
                onClick={() => {
                  const msg = messages.find((m) => m._id === selectedMessage);

                  setReplyMessage(msg);

                  setShowDeleteMenu(false);
                }}
                className="
      w-full
      text-left
      px-4
      py-3
      rounded-lg
      hover:bg-slate-700
      transition
    "
              >
                ↩ Reply
              </button>

              <button
                onClick={() => {
                  setShowReactionMenu(true);
                  setShowDeleteMenu(false);
                }}
                className="
      w-full
      text-left
      px-4
      py-3
      rounded-lg
      hover:bg-slate-700
      transition
    "
              >
                😀 React
              </button>

              {isTextMessage && (
                <>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMsg?.text || "");

                      setShowDeleteMenu(false);

                      setToast("✓ Message copied successfully");

                      setTimeout(() => {
                        setToast("");
                      }, 2000);
                    }}
                    className="
      w-full
      text-left
      px-4
      py-3
      rounded-lg
      hover:bg-slate-700
      transition
    "
                  >
                    📋 Copy
                  </button>

                  {selectedMsg?.senderId?._id === currentUser?._id && (
                    <button
                      onClick={() => {
                        setEditText(selectedMsg?.text || "");

                        setEditMode(true);

                        setShowDeleteMenu(false);
                      }}
                      className="
        w-full
        text-left
        px-4
        py-3
        rounded-lg
        hover:bg-slate-700
        transition
      "
                    >
                      ✏ Edit
                    </button>
                  )}
                </>
              )}

              <div className="border-t border-slate-700 my-2" />

              {selectedMsg?.senderId?._id === currentUser?._id && (
                <>
                  <button
                    onClick={() => {
                      deleteMessage(selectedMessage);

                      setShowDeleteMenu(false);
                    }}
                    className="
      w-full
      text-left
      px-4
      py-3
      rounded-lg
      text-red-400
      hover:bg-red-500/10
      transition
    "
                  >
                    🗑 Delete For Me
                  </button>

                  <button
                    onClick={() => {
                      deleteForEveryone(selectedMessage);
                    }}
                    className="
      w-full
      text-left
      px-4
      py-3
      rounded-lg
      text-orange-400
      hover:bg-orange-500/10
      transition
    "
                  >
                    🚫 Delete For Everyone
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {editMode && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div
            className="bg-slate-800/95
backdrop-blur-md
p-3
rounded-2xl
shadow-2xl
border
border-slate-700 w-[350px]"
          >
            {isTextMessage && (
              <button
                onClick={() => {
                  if (selectedMsg?.deletedForEveryone) return;

                  setEditText(selectedMsg?.text || "");

                  setEditMode(true);

                  setShowDeleteMenu(false);
                }}
                className="
      w-full
      bg-cyan-500
      hover:bg-cyan-600
      py-2
      rounded-lg
      text-white
      mb-2
    "
              >
                Edit Message
              </button>
            )}

            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-slate-700 py-2 rounded-lg text-white"
              >
                Cancel
              </button>

              <button
                onClick={editMessage}
                className="flex-1 bg-cyan-500 py-2 rounded-lg text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showReactionMenu && (
        <div
          className="
      absolute
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-[999]
    "
        >
          <div
            className="
        bg-slate-800
        p-5
        rounded-xl
        flex
        gap-4
        text-3xl
      "
          >
            {["👍", "❤️", "😂", "😮", "😢", "🔥"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => reactToMessage(selectedMessage, emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {imageError && (
        <div className="px-4 py-2 text-red-400 text-sm">{imageError}</div>
      )}
      {imagePreview && (
        <div className="absolute inset-0 bg-black/80 z-[999] flex items-center justify-center">
          <div className="bg-slate-800 p-4 rounded-xl max-w-lg">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-[400px] rounded-xl"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview("");
                }}
                className="flex-1 bg-red-500 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={sendSelectedImage}
                disabled={sendingImage}
                className="
flex-1
bg-cyan-500
py-2
rounded-lg
disabled:bg-slate-700
disabled:cursor-not-allowed
"
              >
                {sendingImage ? "Uploading..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedFile && (
        <div className="absolute inset-0 bg-black/80 z-[999] flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-2xl w-[400px]">
            <div className="text-6xl text-center mb-4">
              {getFileIcon(selectedFile.name)}
            </div>

            <h3 className="text-white text-center font-semibold text-lg break-all">
              {selectedFile.name}
            </h3>

            <p className="text-gray-400 text-center mt-2">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedFile(null)}
                className="flex-1 bg-red-500 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={sendSelectedFile}
                className="flex-1 bg-cyan-500 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {viewImage && (
        <div
          className="
    fixed
    inset-0
    bg-black/95
    backdrop-blur-md
    flex
    items-center
    justify-center
    z-[9999]
    animate-fadeIn
  "
          onClick={() => setViewImage("")}
        >
          <button
            onClick={() => setViewImage("")}
            className="
      absolute
      top-5
      right-6
      text-white
      text-4xl
      hover:text-red-400
      transition
    "
          >
            ✕
          </button>

          <img
            src={viewImage}
            alt="Full View"
            onClick={(e) => e.stopPropagation()}
            className="
      max-h-[90vh]
      max-w-[90vw]
      rounded-2xl
      shadow-2xl
      animate-scaleIn
    "
          />
        </div>
      )}

      {replyMessage && (
        <div
          className="
  px-4
  py-3
  bg-slate-900/95
  backdrop-blur-xl
  border-t
  border-cyan-500/20
"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-cyan-400 text-sm">Replying to</div>

              <div className="text-white text-sm truncate">
                {replyMessage.text || "📷 Image"}
              </div>
            </div>

            <button
              onClick={() => setReplyMessage(null)}
              className="text-red-400 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {toast && (
        <div
          className="
      fixed
      bottom-5
      right-5
     bg-slate-800
border
border-green-500/30
backdrop-blur-xl
animate-slideIn
      text-white
      px-4
      py-2
      rounded-lg
      shadow-xl
      z-[9999]
    "
        >
          {toast}
        </div>
      )}
      {/* Input */}

      <div
        className="
  relative
  p-2
  md:p-4
  border-t
  border-slate-700/50
  flex
  gap-3
  bg-slate-900/90
  backdrop-blur-xl
"
      >
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-yellow-400 text-xl md:text-2xl px-2"
          >
            <FaSmile />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-cyan-400 text-2xl px-2"
          >
            📷
          </button>
          <button
            onClick={() => attachmentInputRef.current?.click()}
            className="text-green-400 text-2xl px-2"
          >
            📎
          </button>

          <input
            type="file"
            ref={attachmentInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="
      absolute
      bottom-20
      left-4
      z-50
    "
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
          </div>
        )}

        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Type message..."
          className="
flex-1
px-3
md:px-5
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

        <button
          onClick={handleSend}
          disabled={sending}
          className={`
${
  sending
    ? `
      bg-slate-700
      cursor-not-allowed
      opacity-70
    `
    : `
      bg-gradient-to-r
      from-cyan-500
      to-cyan-600
      hover:from-cyan-400
      hover:to-cyan-500
      hover:scale-105
    `
}
px-4
md:px-8
py-3
rounded-2xl
font-semibold
shadow-xl
transition-all
duration-200
`}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
