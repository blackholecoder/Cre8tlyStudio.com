import React from "react";
import { Plus, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { TRUST_ICONS } from "../../../../constants";
import axiosInstance from "../../../../api/axios";

export default function MiniOfferAdvanced({
  block,
  updateField,
  landing,
  openAIModal,
}) {
  const MAX_BULLETS = 5;
  const MAX_TRUST_ITEMS = 3;
  const MAX_BLOCKS = 6;

  const offer = {
    enabled: block.offer_page?.enabled ?? false,
    blocks: Array.isArray(block.offer_page?.blocks)
      ? block.offer_page.blocks
      : [],
    bullets: Array.isArray(block.offer_page?.bullets)
      ? block.offer_page.bullets
      : [],
    trust_items: Array.isArray(block.offer_page?.trust_items)
      ? block.offer_page.trust_items
      : [],
  };

  const updateOffer = (patch) => {
    updateField("offer_page", {
      ...offer,
      ...patch,
    });
  };

  const lastBlock = offer.blocks?.[offer.blocks.length - 1];
  const canAddBlock =
    offer.blocks.length < MAX_BLOCKS &&
    (!lastBlock || lastBlock.text || lastBlock.image_url);

  return (
    <div className="mt-6 ">
      {/* HEADER */}
      <button
        type="button"
        onClick={() => updateOffer({ enabled: !offer.enabled })}
        className="w-full flex justify-between items-center py-3 border-b border-gray-800"
      >
        <span className="text-sm font-semibold text-white tracking-wide">
          Advanced Offer Page
        </span>
        <span className="text-xs text-gray-400">
          {offer.enabled ? "Hide" : "Show"}
        </span>
      </button>

      {!offer.enabled ? null : (
        <div className="pt-6 space-y-10">
          {/* PARAGRAPH */}
          {(!offer.blocks || offer.blocks.length === 0) && (
            <p className="text-xs text-gray-500">No paragraph blocks yet.</p>
          )}
          {(offer.blocks || []).map((offerBlock, i) => (
            <div
              key={offerBlock.id}
              className="space-y-3 pb-6 border-b border-gray-800"
            >
              {/* TEXT */}
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-400">
                  Paragraph Content
                </label>

                <button
                  type="button"
                  onClick={() =>
                    openAIModal({
                      blockType: "offer_paragraph",
                      currentText: offerBlock.text || "",
                      onApply: (aiText) => {
                        const next = [...offer.blocks];
                        next[i] = { ...offerBlock, text: aiText };
                        updateOffer({ blocks: next });
                      },
                      role: "sales",
                    })
                  }
                  className="text-xs font-semibold px-3 py-1 rounded-md
      bg-royalPurple text-white hover:bg-royalPurple/80 transition"
                >
                  AI
                </button>
              </div>
              <textarea
                value={offerBlock.text || ""}
                maxLength={800}
                onChange={(e) => {
                  const next = [...offer.blocks];
                  next[i] = { ...offerBlock, text: e.target.value };
                  updateOffer({ blocks: next });
                }}
                rows={4}
                className="w-full bg-black text-white border border-gray-700 rounded-lg p-4 focus:border-green focus:ring-0"
                placeholder="Write paragraph content"
              />
              <p className="text-xs text-gray-500 text-right">
                {offerBlock.text?.length || 0}/800
              </p>

              {/* IMAGE UPLOAD */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400">
                  Optional image
                </label>

                {offerBlock.image_url ? (
                  <div className="relative">
                    <img
                      src={offerBlock.image_url}
                      className="w-full max-h-48 object-cover rounded-md border border-gray-700"
                      alt=""
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        const next = [...offer.blocks];
                        next[i] = { ...next[i], image_url: "" };
                        updateOffer({ blocks: next });
                        e.target.value = "";
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-red-400 text-xs px-2 py-1 rounded hover:bg-black"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center h-28 border border-dashed border-gray-600 rounded cursor-pointer text-sm text-gray-400 hover:border-gray-400">
                    Upload image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("image", file);
                        formData.append("landingId", landing.id);
                        formData.append("blockId", block.id);
                        formData.append("offerBlockId", offerBlock.id);

                        try {
                          const res = await axiosInstance.post(
                            "/landing/upload-media-block",
                            formData,
                            {
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            }
                          );

                          if (res.data?.url) {
                            const next = [...offer.blocks];
                            next[i] = { ...next[i], image_url: res.data.url };
                            updateOffer({ blocks: next });
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error("Image upload failed");
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* REMOVE BLOCK */}
              <button
                type="button"
                onClick={() =>
                  updateOffer({
                    blocks: offer.blocks.filter((_, idx) => idx !== i),
                  })
                }
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove paragraph block
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={!canAddBlock}
            onClick={() =>
              updateOffer({
                blocks: [
                  ...(offer.blocks || []),
                  {
                    id: crypto.randomUUID(),
                    type: "paragraph",
                    text: "",
                    image_url: "",
                  },
                ],
              })
            }
            className={`text-sm font-medium flex items-center gap-2 transition
  ${
    canAddBlock
      ? "text-green hover:text-green-400"
      : "text-gray-500 cursor-not-allowed"
  }
`}
          >
            <Plus size={14} />
            Add paragraph block
          </button>

          {/* BULLETS */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Bullet Points
            </label>
            <p className="text-[11px] text-gray-500 mt-1">
              Max {MAX_BULLETS} bullets. Keep them short and benefit focused.
            </p>

            {offer.bullets.map((bullet, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  maxLength={120}
                  value={bullet}
                  onChange={(e) => {
                    const next = [...offer.bullets];
                    next[i] = e.target.value;
                    updateOffer({ bullets: next });
                  }}
                  className="flex-1 bg-black text-white border border-gray-600 rounded px-3 py-2"
                  placeholder="Bullet text"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateOffer({
                      bullets: offer.bullets.filter((_, idx) => idx !== i),
                    });
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              disabled={offer.bullets.length >= MAX_BULLETS}
              onClick={() =>
                updateOffer({
                  bullets: [...offer.bullets, ""],
                })
              }
              className={`text-xs font-semibold flex items-center gap-1 mt-1
    ${
      offer.bullets.length >= MAX_BULLETS
        ? "text-gray-500 cursor-not-allowed"
        : "text-green hover:text-green-400"
    }
  `}
            >
              <Plus size={14} />
              {offer.bullets.length >= MAX_BULLETS
                ? "Max bullets reached"
                : "Add bullet"}
            </button>
          </div>

          {/* TRUST ITEMS */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Trust Items
            </label>
            <p className="text-[11px] text-gray-500 mt-1">
              Max {MAX_TRUST_ITEMS}. Keep trust signals short and recognizable.
            </p>

            {offer.trust_items.map((item, i) => (
              <div
                key={i}
                className="space-y-2 pb-4 border-b border-gray-800 mb-3"
              >
                {/* ICON SELECT */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Icon
                  </label>
                  <select
                    value={item.icon || "check"}
                    onChange={(e) => {
                      const next = [...offer.trust_items];
                      next[i] = { ...next[i], icon: e.target.value };
                      updateOffer({ trust_items: next });
                    }}
                    className="w-full bg-black text-white border border-gray-600 rounded px-2 py-1"
                  >
                    {TRUST_ICONS.map((icon) => (
                      <option key={icon.key} value={icon.key}>
                        {icon.icon} {icon.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LABEL */}
                <input
                  type="text"
                  value={item.label || ""}
                  onChange={(e) => {
                    const next = [...offer.trust_items];
                    next[i] = { ...next[i], label: e.target.value };
                    updateOffer({ trust_items: next });
                  }}
                  className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2"
                  placeholder="Secure checkout"
                />

                {/* SUBTEXT (optional) */}
                <input
                  type="text"
                  value={item.subtext || ""}
                  onChange={(e) => {
                    const next = [...offer.trust_items];
                    next[i] = { ...next[i], subtext: e.target.value };
                    updateOffer({ trust_items: next });
                  }}
                  className="w-full bg-black text-white border border-gray-600 rounded px-3 py-2 text-sm opacity-90"
                  placeholder="Powered by Stripe"
                />

                {/* REMOVE */}
                <button
                  type="button"
                  onClick={() =>
                    updateOffer({
                      trust_items: offer.trust_items.filter(
                        (_, idx) => idx !== i
                      ),
                    })
                  }
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              disabled={offer.trust_items.length >= MAX_TRUST_ITEMS}
              onClick={() =>
                updateOffer({
                  trust_items: [
                    ...offer.trust_items,
                    { icon: "check", label: "", subtext: "" },
                  ],
                })
              }
              className={`mt-2 text-xs font-semibold flex items-center gap-1
    ${
      offer.trust_items.length >= MAX_TRUST_ITEMS
        ? "text-gray-500 cursor-not-allowed"
        : "text-green hover:text-green-400"
    }
  `}
            >
              <Plus size={14} />
              {offer.trust_items.length >= MAX_TRUST_ITEMS
                ? "Max trust items reached"
                : "Add trust item"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
