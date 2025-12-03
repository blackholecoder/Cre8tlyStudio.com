import React from "react";
import { Lock } from "lucide-react";

export default function SecureCheckoutBlock({ block, index, updateBlock }) {
  return (
    <div className="mt-3 transition-all duration-300">

      {/* ========================= */}
      {/* 🔧 EDITOR CONTROLS        */}
      {/* ========================= */}
      <div className="bg-[#0F172A]/60 border border-gray-700 p-6 rounded-xl mb-6">
        <h3 className="text-xl font-bold text-silver mb-4">
          Secure Checkout Settings
        </h3>

        {/* Title Input */}
        <label className="block text-sm text-gray-300 font-semibold mb-1">
          Title
        </label>
        <input
          type="text"
          value={block.title || ""}
          onChange={(e) => updateBlock(index, "title", e.target.value)}
          placeholder="Secure Checkout"
          className="w-full mb-4 p-2 bg-black border border-gray-600 rounded text-white"
        />

        {/* Subtext */}
        <label className="text-sm font-semibold text-gray-300">
          Subtext
        </label>
        <textarea
          value={block.subtext || ""}
          onChange={(e) => updateBlock(index, "subtext", e.target.value)}
          placeholder="Your information is protected by industry-leading encryption and secure payment processing."
          className="w-full mt-1 p-2 h-20 bg-black border border-gray-600 rounded text-white"
        />

        {/* Trust bullets */}
        <label className="block mt-4 text-sm text-gray-300 font-semibold">
          Trust Badges List
        </label>

        {(block.trust_items || []).map((item, i) => (
          <div key={i} className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...block.trust_items];
                updated[i] = e.target.value;
                updateBlock(index, "trust_items", updated);
              }}
              className="flex-1 p-2 bg-black border border-gray-600 rounded text-white"
            />
            <button
              className="text-red-400 text-xs"
              onClick={() => {
                const updated = block.trust_items.filter((_, idx) => idx !== i);
                updateBlock(index, "trust_items", updated);
              }}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            updateBlock(index, "trust_items", [
              ...(block.trust_items || []),
              "Secure SSL Encryption",
            ])
          }
          className="mt-3 text-sm px-3 py-2 rounded bg-green text-black font-semibold hover:bg-green/80"
        >
          Add Trust Item
        </button>

        {/* Guarantee Box */}
        <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-[#1a2537]/60">
          <label className="text-sm font-semibold text-gray-300">
            Guarantee Message
          </label>

          <textarea
            value={block.guarantee || ""}
            onChange={(e) => updateBlock(index, "guarantee", e.target.value)}
            placeholder="30 day money back guarantee on all purchases"
            className="w-full mt-1 p-2 bg-black border border-gray-600 rounded text-white h-20"
          />
        </div>

        {/* Payment badge */}
        <label className="block mt-6 text-sm text-gray-300 font-semibold">
          Payment Badge URL
        </label>
        <input
          type="text"
          value={block.payment_badge || ""}
          onChange={(e) => updateBlock(index, "payment_badge", e.target.value)}
          placeholder="https://your-image.com/stripebadge.png"
          className="w-full p-2 bg-black border border-gray-600 rounded text-white"
        />

        {block.payment_badge && (
          <img
            src={block.payment_badge}
            alt="Payment Badge"
            className="w-40 mt-4 opacity-90 mx-auto"
          />
        )}
      </div>

      {/* ========================= */}
      {/* 👀 LIVE PREVIEW           */}
      {/* ========================= */}
      <div className="text-center">
        <h2 className="text-[1.25rem] font-extrabold text-white flex items-center justify-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-white" />
          {block.title || "Secure Checkout"}
        </h2>

        {block.subtext && (
          <p className="text-gray-300 max-w-xl mx-auto mb-4">
            {block.subtext}
          </p>
        )}

        {/* TRUST LIST */}
        {block.trust_items?.length > 0 && (
          <ul className="flex flex-col items-center gap-1 mb-4">
            {block.trust_items.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-white text-sm"
              >
                <span className="text-green font-bold">✔</span> {item}
              </li>
            ))}
          </ul>
        )}

        {/* GUARANTEE */}
        {block.guarantee && (
          <p className="text-gray-300 text-sm mb-4">{block.guarantee}</p>
        )}

        {block.payment_badge && (
          <img
            src={block.payment_badge}
            className="w-40 opacity-80 mx-auto mt-2"
          />
        )}
      </div>
    </div>
  );
}

