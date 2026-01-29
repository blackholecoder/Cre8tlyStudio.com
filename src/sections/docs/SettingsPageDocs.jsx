import React from "react";
import {
  Settings,
  ShieldCheck,
  KeyRound,
  Image as ImageIcon,
  CreditCard,
  FileText,
  BookOpen,
} from "lucide-react";

export default function SettingsDocs() {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "avatar", label: "Profile Avatar" },
    { id: "twofa", label: "Two-Factor Authentication" },
    { id: "passkeys", label: "Passkey Authentication" },
    { id: "stripe", label: "Stripe Payouts" },
    { id: "brand-file", label: "Brand Identity File" },
    { id: "cta", label: "Default Closing Message / CTA" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 text-white relative">
      {/* FIXED SIDEBAR */}
      <aside className="hidden lg:block w-64 fixed left-[180px] top-[120px] z-20">
        <div className="bg-[#020617] border border-gray-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-green" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
              Settings Docs
            </h2>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Learn how to manage security, payouts, branding, and your default
            CTA.
          </p>

          <ul className="space-y-1 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white transition text-gray-300 text-xs"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto bg-black/70 rounded-2xl shadow-lg p-8">
        <main className="pb-16">
          {/* Header */}
          <header className="mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-7 h-7 text-green" />
              <div>
                <h1 className="text-2xl font-bold text-silver">
                  Settings & Account Management
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Learn how to manage your profile, security, payouts, brand
                  identity, and CTA message.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700">
                Estimated Time, 2 to 3 minutes
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-900 border border-gray-700 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-green" />
                Best For, every Messy Attic user
              </span>
            </div>
          </header>

          {/* INTRO */}
          <section id="intro" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              1. Introduction
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              The Settings page is where you control your account information,
              security features, payout connections, branding, and the default
              CTA that appears at the end of your lead magnets or documents.
            </p>
          </section>

          {/* AVATAR */}
          <section id="avatar" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              2. Profile Avatar
            </h2>
            <ImageIcon className="w-5 h-5 text-green mb-2" />

            <p className="text-sm text-gray-300 mb-3">
              Your avatar displays inside your dashboard and seller profile.
              Upload any image and it updates instantly.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Select an image file</li>
              <li>Click Upload Avatar</li>
              <li>Cre8tly updates your profile everywhere</li>
            </ul>
          </section>

          {/* 2FA */}
          <section id="twofa" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              3. Two-Factor Authentication (2FA)
            </h2>
            <ShieldCheck className="w-5 h-5 text-green mb-2" />

            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              2FA adds a second layer of protection to your account by requiring
              a 6-digit code at login.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Click Enable 2FA</li>
              <li>Scan the QR code using Google Authenticator</li>
              <li>Enter your 6-digit code to activate</li>
              <li>You can disable 2FA at any time</li>
            </ul>
          </section>

          {/* PASSKEYS */}
          <section id="passkeys" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              4. Passkey Authentication
            </h2>
            <KeyRound className="w-5 h-5 text-green mb-2" />

            <p className="text-sm text-gray-300 mb-3">
              Passkeys let you sign in using Face ID, Touch ID, Windows Hello,
              or hardware-based biometric authentication.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Register a passkey from your device</li>
              <li>Use “Sign in with Passkey” at login</li>
              <li>You may remove a passkey anytime</li>
            </ul>
          </section>

          {/* STRIPE */}
          <section id="stripe" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              5. Stripe Payouts
            </h2>
            <CreditCard className="w-5 h-5 text-green mb-2" />

            <p className="text-sm text-gray-300 mb-3">
              To receive payment through The Messy Attic, connect a Stripe
              Express account.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Start Stripe onboarding</li>
              <li>Complete ID verification</li>
              <li>Enable payouts</li>
              <li>If pending, resume setup anytime</li>
            </ul>

            <p className="text-sm text-gray-400 mt-3">
              Free trial users must upgrade before connecting payouts.
            </p>
          </section>

          {/* BRAND FILE */}
          <section id="brand-file" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              6. Brand Identity File
            </h2>
            <FileText className="w-5 h-5 text-green mb-2" />

            <p className="text-sm text-gray-300 mb-3">
              The Brand Identity File helps the AI understand your tone, writing
              style, formatting preferences, examples, and personality.
            </p>

            <p className="text-sm text-gray-300 mb-2">
              Accepted files, PDF, DOCX, DOC, TXT.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Upload a new brand file anytime</li>
              <li>Remove your existing file to reset defaults</li>
              <li>Your brand file applies automatically to new projects</li>
            </ul>
          </section>

          {/* CTA */}
          <section id="cta" className="mb-10">
            <h2 className="text-lg font-semibold mb-2 text-silver">
              7. Default Closing Message / CTA
            </h2>

            <p className="text-sm text-gray-300 mb-3">
              This CTA appears at the end of every lead magnet or pro document
              you create. Add your website, newsletter, signature, or next step.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Customize your closing message</li>
              <li>Save it once, it applies everywhere</li>
              <li>You can update it anytime</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
