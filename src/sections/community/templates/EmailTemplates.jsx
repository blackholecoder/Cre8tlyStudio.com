import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { MailCheck, Loader2 } from "lucide-react";
import CommunityPostEditor from "../posts/CommunityPostEditor";
import { useAuth } from "../../../admin/AuthContext";
import EmailPreview from "./EmailPreview";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/axios";
import SendTestEmailModal from "./SendTestEmailModal";

export default function EmailTemplates() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [confirmTestOpen, setConfirmTestOpen] = useState(false);

  const isTestDisabled = sendingTest || !subject.trim() || !bodyHtml.trim();

  useEffect(() => {
    fetchTemplate();
  }, []);

  async function fetchTemplate() {
    try {
      const res = await axiosInstance.get(
        "/community/authors/me/email-templates/free_subscriber_welcome"
      );

      if (res?.data?.template) {
        setSubject(res.data.template.subject || "");
        setBodyHtml(res.data.template.body_html || "");
      }
    } catch (err) {
      console.error(
        "Failed to load email template",
        err?.response?.status,
        err?.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveTemplate() {
    try {
      setSaving(true);

      await axiosInstance.post("/community/authors/me/email-templates", {
        type: "free_subscriber_welcome",
        subject,
        body_html: bodyHtml,
      });

      toast.success("Template saved");
    } catch (err) {
      console.error("Failed to save email template", err);
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  async function sendTestEmail() {
    try {
      setSendingTest(true);

      await axiosInstance.post("/community/authors/test", {
        type: "free_subscriber_welcome",
      });

      toast.success("Test email sent");
    } catch (err) {
      console.error("Failed to send test email", err);
      toast.error("Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-400">Loading email template…</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-7xl">
      {/* LEFT: Editor */}
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <MailCheck className="w-6 h-6 text-gray-300" />
          <div>
            <h1 className="text-xl font-semibold text-white">
              Email Templates
            </h1>
            <p className="text-sm text-gray-400">
              Customize the welcome email sent to new free subscribers.
            </p>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Welcome {{subscriber_name}}"
            className="
              w-full rounded-md px-4 py-2
              bg-[#0b1220] text-white
              border border-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500
            "
          />
          <p className="text-xs text-gray-500 mt-1">
            Variables: {"{{subscriber_name}}"}, {"{{author_name}}"}
          </p>
        </div>

        {/* Body editor */}
        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Email Body</label>
          <CommunityPostEditor value={bodyHtml} onChange={setBodyHtml} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={saveTemplate}
            disabled={saving}
            className="
      px-4 py-2 rounded-md
      bg-indigo-600 text-white
      hover:bg-indigo-700
      disabled:opacity-50
    "
          >
            {saving ? "Saving…" : "Save Template"}
          </button>

          <button
            onClick={() => setConfirmTestOpen(true)}
            disabled={isTestDisabled}
            className="
            px-4 py-2 rounded-md
            bg-gray-700 text-white
            hover:bg-gray-600
            disabled:opacity-50
          "
          >
            {sendingTest ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </span>
            ) : (
              "Send Test"
            )}
          </button>
        </div>
      </div>

      {/* RIGHT: Preview */}
      <EmailPreview
        subject={subject}
        bodyHtml={bodyHtml}
        creatorName={user?.name || ""}
      />
      <SendTestEmailModal
        open={confirmTestOpen}
        email={user.email}
        onCancel={() => setConfirmTestOpen(false)}
        onConfirm={async () => {
          setConfirmTestOpen(false);
          await sendTestEmail();
        }}
      />
    </div>
  );
}
