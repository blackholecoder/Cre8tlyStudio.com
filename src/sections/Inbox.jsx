import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  Mail,
  Calendar,
  CheckCircle,
  Bell,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import axiosInstance from "../api/axios";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await axiosInstance.get("/messages/user/");
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      toast.error("Failed to load inbox.");
    } finally {
      setLoading(false);
    }
  }

  async function openMessage(m) {
    setSelected(m);
    if (!m.read_status) {
      try {
        setMarkingRead(true);
        await axiosInstance.post(`/messages/user/${m.id}/read`);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === m.id ? { ...msg, read_status: 1 } : msg
          )
        );
      } catch (err) {
        console.error("Failed to mark message as read:", err);
      } finally {
        setMarkingRead(false);
      }
    }
  }

  // TODO WORK ON THE MESSAGES FOR PUBLIC WHICH NEED NEW ROUTES

  async function handleDelete(id) {
    toast.dismiss(); // clear any existing toasts first

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col space-y-3 text-center">
          <p className="text-sm font-medium text-gray-100">
            Are you sure you want to delete this message?
          </p>
          <div className="flex justify-center gap-3 mt-2">
            <button
              onClick={async () => {
                try {
                  setDeleting(true);
                  await axiosInstance.delete(`/messages/user/user/${id}`);
                  setMessages((prev) => prev.filter((m) => m.id !== id));
                  setSelected(null);
                  toast.success("Message deleted successfully.", {
                    position: "top-right",
                    style: {
                      background: "#0B0F19",
                      color: "#E5E7EB",
                      border: "1px solid #1F2937",
                      borderRadius: "0.5rem",
                    },
                  });
                } catch (err) {
                  console.error("Failed to delete message:", err);
                  toast.error("Failed to delete message.", {
                    position: "top-right",
                    style: {
                      background: "#0B0F19",
                      color: "#E5E7EB",
                      border: "1px solid #1F2937",
                      borderRadius: "0.5rem",
                    },
                  });
                } finally {
                  setDeleting(false);
                  closeToast();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition"
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md text-xs font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right", // ✅ pops up at top-right
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
        style: {
          background: "#0B0F19",
          border: "1px solid #1F2937",
          color: "#E5E7EB",
          borderRadius: "0.75rem",
          padding: "14px 18px",
          width: "340px",
          textAlign: "center",
          marginTop: "80px", // keeps it below your header
        },
      }
    );
  }

  function backToList() {
    setSelected(null);
  }

  return (
    <div
      className="
      w-full min-h-screen flex flex-col lg:flex-row
      bg-dashboard-bg-light
      dark:bg-dashboard-bg-dark
      text-dashboard-text-light
      dark:text-dashboard-text-dark
  "
    >
      {/* 📥 Left Column — Message List */}
      <div
        className="
        flex-1 lg:max-w-[380px] h-screen overflow-y-auto p-6
        border-r border-dashboard-border-light
        dark:border-dashboard-border-dark
        bg-dashboard-sidebar-light
        dark:bg-dashboard-sidebar-dark
  "
      >
        <div
          className="
          border-b pb-4 mb-6 flex items-center justify-between
          border-dashboard-border-light
          dark:border-dashboard-border-dark
  "
        >
          <h1 className="text-xl font-bold design-text normal-case">Inbox</h1>
          <Bell
            size={18}
            className="
          text-dashboard-muted-light
          dark:text-green
  "
          />
        </div>

        {loading ? (
          <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-sm">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-dashboard-muted-light dark:text-dashboard-muted-dark text-sm">
            No messages found.
          </p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                onClick={() => openMessage(m)}
                className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 ${
                  m.id === selected?.id
                    ? `
              bg-dashboard-hover-light
              dark:bg-dashboard-hover-dark
              border-dashboard-border-light
              dark:border-dashboard-border-dark
            `
                    : !m.read_status
                      ? `
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border-green
              `
                      : `
                bg-dashboard-sidebar-light
                dark:bg-dashboard-sidebar-dark
                border-dashboard-border-light
                dark:border-dashboard-border-dark
              `
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-semibold truncate ${
                      m.read_status
                        ? "text-dashboard-muted-light dark:text-dashboard-muted-dark"
                        : "text-dashboard-text-light dark:text-dashboard-text-dark"
                    }`}
                  >
                    {m.title}
                  </h3>
                  <span className="text-xs text-dashboard-muted-light dark:text-dashboard-muted-dark">
                    {new Date(m.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${
                    m.read_status
                      ? "text-dashboard-muted-light dark:text-dashboard-muted-dark"
                      : "text-dashboard-text-light dark:text-dashboard-text-dark"
                  }`}
                >
                  {m.message}
                </p>
                {!m.read_status && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-green font-semibold">
                    <CheckCircle size={12} /> New
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 📧 Right Column — Message Reader */}
      <div
        className="
        flex-1 p-6 overflow-y-auto h-screen
        bg-dashboard-bg-light
        dark:bg-dashboard-bg-dark
  "
      >
        {!selected ? (
          <div
            className="
            flex flex-col items-center justify-center h-full text-center
            text-dashboard-muted-light
            dark:text-dashboard-muted-dark"
          >
            <Mail
              size={40}
              className="
              mb-4
              text-dashboard-muted-light
              dark:text-dashboard-muted-dark
  "
            />
            <p>Select a message to read</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={backToList}
                className="
                flex items-center gap-2 text-sm
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
                hover:text-dashboard-text-light
                dark:hover:text-dashboard-text-dark
"
              >
                <ArrowLeft size={16} /> Back to Inbox
              </button>
            </div>

            {/* Message Content */}
            <div
              className="
              rounded-2xl p-6 shadow-lg
              bg-dashboard-sidebar-light
              dark:bg-dashboard-sidebar-dark
              border border-dashboard-border-light
              dark:border-dashboard-border-dark
  "
            >
              <div
                className="
                flex flex-col sm:flex-row sm:items-center sm:justify-between
                border-b border-dashboard-border-light
                dark:border-dashboard-border-dark
                pb-4 mb-4"
              >
                <h2
                  className="text-2xl font-bold leading-tight
                text-dashboard-text-light
                dark:text-dashboard-text-dark
"
                >
                  {selected.title}
                </h2>

                <div
                  className="
                  flex items-center gap-2 text-sm mt-2 sm:mt-0
                  text-dashboard-muted-light
                  dark:text-dashboard-muted-dark
  "
                >
                  <Calendar
                    size={14}
                    className="opacity-75 relative top-[1px]"
                  />
                  {new Date(selected.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <p
                className="
                text-sm leading-relaxed whitespace-pre-line
                text-dashboard-text-light
                dark:text-dashboard-text-dark
  "
              >
                {selected.message}
              </p>

              <div
                className="
                mt-6 pt-4 flex items-center justify-between text-xs
                border-t border-dashboard-border-light
                dark:border-dashboard-border-dark
                text-dashboard-muted-light
                dark:text-dashboard-muted-dark
  "
              >
                <p>
                  Sent by{" "}
                  <span className="text-green font-semibold">
                    Cre8tly Support
                  </span>
                </p>

                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={deleting}
                  className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md font-semibold transition-all ${
                    deleting
                      ? "bg-red-900 text-dashboard-muted-dark opacity-60 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <Trash2 size={14} />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
