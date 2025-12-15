import React from "react";

import { toast } from "react-toastify";
import CountdownTimerPreview from "../../../sections/landing/Timer";
import axiosInstance from "../../../api/axios";

function renderPreviewBlock(block, index, context) {
  const { landing, bgTheme, user, updateBlock, adjustForLandingOverlay } =
    context;

  const baseStyle = {
    margin: "0 auto 24px",
    maxWidth: "700px",
    textAlign: "center",
  };

  switch (block.type) {
    case "heading": {
      const alignment = block.alignment || "left";

      const containerStyle =
        alignment === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: "auto", marginRight: "auto" };

      return (
        <h1
          key={index}
          className="text-4xl font-bold leading-snug"
          style={{
            ...baseStyle,
            ...containerStyle,
            maxWidth: 700,
            textAlign: alignment,
            color: landing.font_color_h1 || "#FFFFFF",
          }}
        >
          {block.text || "Heading Example"}
        </h1>
      );
    }

    case "subheading": {
      const alignment = block.alignment || "left";

      const containerStyle =
        alignment === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: "auto", marginRight: "auto" };

      return (
        <h2
          key={index}
          className="text-2xl font-semibold leading-snug"
          style={{
            ...baseStyle,
            ...containerStyle,
            maxWidth: 700,
            textAlign: alignment,
            color: landing.font_color_h2 || "#E5E5E5",
          }}
        >
          {block.text || "Subheading Example"}
        </h2>
      );
    }

    case "subsubheading": {
      const alignment = block.alignment || "left";

      const containerStyle =
        alignment === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: "auto", marginRight: "auto" };

      return (
        <h3
          key={index}
          className="text-xl font-medium leading-snug"
          style={{
            ...baseStyle,
            ...containerStyle,
            maxWidth: 700,
            textAlign: alignment,
            color: landing.font_color_h3 || "#CCCCCC",
          }}
        >
          {block.text || "Supporting Header"}
        </h3>
      );
    }

    case "list_heading": {
      const alignment = block.alignment || "left";

      const containerStyle =
        alignment === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: "auto", marginRight: "auto" };

      return (
        <p
          key={index}
          style={{
            ...baseStyle,
            ...containerStyle,
            maxWidth: 700,
            marginBottom: 10,
            fontWeight: 700,
            fontSize: "1.15rem",
            textAlign: alignment,
            color: landing.font_color_p || "#FFFFFF",
          }}
        >
          {block.text || "💎 List Heading Example"}
        </p>
      );
    }

    case "paragraph": {
      const alignment = block.alignment || "left";

      const containerStyle =
        alignment === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: "auto", marginRight: "auto" };

      // 🔹 BULLETED PREVIEW
      if (block.bulleted) {
        const lines = (block.text || "").split(/\n/).filter(Boolean);

        return (
          <div
            key={index}
            style={{
              ...containerStyle,
              maxWidth: 700,
              marginBottom: 24,
              lineHeight: "1.8",
            }}
          >
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: "1.25rem",
                margin: 0,
                textAlign: "left", // 🔑 always left for bullets
                color: landing.font_color_p || "rgba(255,255,255,0.92)",
              }}
            >
              {lines.map((line, i) => (
                <li key={i} style={{ marginBottom: "0.35rem" }}>
                  {line.replace(/^•\s*/, "")}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      // 🔹 NORMAL PARAGRAPH PREVIEW
      return (
        <p
          key={index}
          className="text-lg leading-relaxed"
          style={{
            ...containerStyle,
            maxWidth: 700,
            marginBottom: 24,
            textAlign: alignment,
            color: landing.font_color_p || "rgba(255,255,255,0.92)",
            whiteSpace: "pre-line",
          }}
        >
          {block.text || "Your paragraph will appear here."}
        </p>
      );
    }

    case "video":
      if (!block.url) return null;

      let embedUrl = block.url.trim();

      if (embedUrl.includes("watch?v=")) {
        embedUrl = embedUrl.replace("watch?v=", "embed/");
      } else if (embedUrl.includes("youtu.be/")) {
        const id = embedUrl.split("youtu.be/")[1].split(/[?&]/)[0];
        embedUrl = `https://www.youtube.com/embed/${id}`;
      }

      if (
        embedUrl.includes("vimeo.com") &&
        !embedUrl.includes("player.vimeo.com")
      ) {
        const id = embedUrl.split("vimeo.com/")[1].split(/[?&]/)[0];
        embedUrl = `https://player.vimeo.com/video/${id}`;
      }

      return (
        <div
          key={index}
          style={{
            margin: "40px auto",
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <iframe
            src={embedUrl}
            title="Embedded Video"
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>

          {block.caption && (
            <p
              style={{
                marginTop: "12px",
                fontSize: "0.95rem",
                color: landing.font_color_p || "#DDD",
                fontStyle: "italic",
              }}
            >
              {block.caption}
            </p>
          )}
        </div>
      );
    case "divider":
      if (block.style === "space") {
        return (
          <div
            key={index}
            style={{
              height: `${block.height || 40}px`,
            }}
          ></div>
        );
      }

      return (
        <hr
          key={index}
          style={{
            border: "none",
            borderTop: `1px solid ${block.color || "rgba(255,255,255,0.2)"}`,
            width: "60%",
            margin: `${(block.height || 40) / 2}px auto`,
            opacity: 0.7,
          }}
        />
      );

    case "spacer":
      if (block.style === "space") {
        return (
          <div
            key={index}
            style={{
              height: `${block.height || 40}px`,
            }}
          ></div>
        );
      }
      return (
        <hr
          key={index}
          style={{
            border: "none",
            borderTop: `1px solid ${block.color || "rgba(255,255,255,0.2)"}`,
            width: block.width || "60%",
            margin: `${(block.height || 40) / 2}px auto`,
            opacity: 0.7,
          }}
        />
      );

    case "calendly":
      if (!block.calendly_url) return null;

      return (
        <div
          key={index}
          style={{
            margin: "40px auto",
            maxWidth: "900px",
            textAlign: "center",
          }}
        >
          <iframe
            src={block.calendly_url}
            style={{
              width: "100%",
              height: `${block.height || 650}px`,
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
            title="Calendly Scheduler"
          ></iframe>
        </div>
      );

    case "social_links":
      const align = block.alignment || "center";
      const iconColor = block.icon_color || "#ffffff";
      const links = block.links || {};

      const iconSet = {
        instagram:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
        threads:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/threads.svg",
        twitter:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg",
        youtube:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg",
        linkedin:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
        facebook:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
        tiktok:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg",
        pinterest:
          "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/pinterest.svg",
      };

      return (
        <div
          key={index}
          style={{
            textAlign: align,
            margin: "40px 0",
            display: "flex",
            justifyContent:
              align === "center"
                ? "center"
                : align === "right"
                  ? "flex-end"
                  : "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(links)
            .filter(([platform, url]) => url && iconSet[platform])
            .map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "38px",
                  height: "38px",
                  display: "inline-block",
                  transition: "transform 0.25s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    WebkitMask: `url(${iconSet[platform]}) no-repeat center / contain`,
                    mask: `url(${iconSet[platform]}) no-repeat center / contain`,
                    backgroundColor: iconColor, // ✅ exact chosen color
                    transition: "background-color 0.3s ease",
                  }}
                />
              </a>
            ))}
        </div>
      );

    case "countdown":
      return (
        <div
          key={index}
          style={{
            margin: "40px auto",
            textAlign: block.alignment || "center",
            color: block.text_color || "#FFFFFF",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            {block.text || "Offer Ends In:"}
          </p>
          <CountdownTimerPreview
            targetDate={block.target_date}
            variant={block.style_variant}
            bgTheme={bgTheme}
          />
        </div>
      );

    case "stripe_checkout":
      return (
        <div
          key={index}
          style={{
            textAlign: block.alignment || "center",
            margin: "40px auto",
          }}
        >
          <button
            onClick={async () => {
              if (!block.pdf_url) {
                toast.warn("Please select a PDF to sell first.");
                return;
              }

              try {
                const res = await axiosInstance.post(
                  "/seller-checkout/create-checkout-session",
                  {
                    landingPageId: landing.id,
                    sellerId: user?.id,
                    pdfUrl: block.pdf_url,
                    price_in_cents: Math.round((block.price || 10) * 100),
                  }
                );

                if (res.data?.url) window.location.href = res.data.url;
                else toast.error("Unable to start checkout. Please try again.");
              } catch (err) {
                console.error("Stripe Checkout Error:", err);
                toast.error("Error connecting to Stripe. Try again later.");
              }
            }}
            className="transition-transform hover:scale-105"
            style={{
              background: block.button_color || "#7bed9f",
              color: block.text_color || "#000", // ✅ new text color
              padding: "14px 36px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {block.button_text || "Buy & Download PDF"}
          </button>

          <p style={{ marginTop: "8px", color: "#aaa" }}>
            $
            {Number(block.price) > 0 ? Number(block.price).toFixed(2) : "10.00"}{" "}
            USD
          </p>

          {block.pdf_url && (
            <p className="text-xs text-gray-400 mt-2">
              Selling:
              <a
                href={block.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green font-medium ml-1 underline hover:text-green transition"
              >
                Preview PDF
              </a>
            </p>
          )}
        </div>
      );

    case "referral_button":
      // only allow employees to have active referral links
      if (user?.is_admin_employee !== 1) {
        return (
          <p
            key={index}
            style={{
              color: "#999",
              fontSize: "0.9rem",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            (Referral buttons are available to admin employees only)
          </p>
        );
      }

      const referralUrl = `https://cre8tlystudio.com/signup?ref_employee=${user?.id}`;

      return (
        <div
          key={index}
          style={{
            textAlign: block.alignment || "center",
            margin: "40px auto",
          }}
        >
          <a
            href={referralUrl}
            style={{
              display: "inline-block",
              background: block.button_color || "#7bed9f",
              color: block.text_color || "#000000",
              padding: "14px 36px",
              borderRadius: "10px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              transition: "transform 0.25s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {block.text || "Sign Up with My Referral"}
          </a>

          <p
            style={{
              color: "#aaa",
              fontSize: "0.8rem",
              marginTop: "10px",
            }}
          >
            {`Referral link: ${referralUrl}`}
          </p>
        </div>
      );

    case "verified_reviews":
      return (
        <div
          key={index}
          style={{
            background: block.bg_color || "rgba(0,0,0,0.3)",
            color: block.text_color || "#FFFFFF",
            textAlign: block.alignment || "center",
            padding: "40px",
            borderRadius: "20px",
            marginTop: "40px",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            {block.title || "Verified Buyer Reviews"}
          </h2>
          <p style={{ color: "#AAA", fontSize: "0.95rem" }}>
            (Buyers who purchased will be able to leave reviews here)
          </p>
          <div
            style={{
              marginTop: "20px",
              background: "rgba(255,255,255,0.08)",
              padding: "20px",
              borderRadius: "10px",
              color: "#CCC",
              fontStyle: "italic",
            }}
          >
            ★★★★★ “Love this product!”
            <br />
            <span style={{ fontSize: "0.8rem", color: "#999" }}>
              — Verified Buyer, sample preview
            </span>
          </div>
        </div>
      );

    case "faq":
      return (
        <div
          key={index}
          style={{
            background: block.use_no_bg
              ? "transparent"
              : block.use_gradient
                ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                    block.gradient_start || "#F285C3"
                  }, ${block.gradient_end || "#7bed9f"})`
                : block.match_main_bg
                  ? adjustForLandingOverlay(bgTheme)
                  : block.bg_color || bgTheme || "rgba(0,0,0,0.3)",
            color: block.text_color || "#FFFFFF",
            padding: "40px",
            borderRadius: block.use_no_bg ? "0px" : "20px",
            marginTop: "40px",
            textAlign: block.alignment || "left",
            maxWidth: "700px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            {block.title || "Frequently Asked Questions"}
          </h2>

          {block.items.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: "20px",
                borderBottom: block.use_no_bg
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "1px solid rgba(255,255,255,0.15)",
                paddingBottom: "16px",
                cursor: "pointer",
              }}
              onClick={() => {
                const updated = [...block.items];
                const el = document.getElementById(`faq-prev-${index}-${i}`);
                if (el) updated[i]._height = el.scrollHeight + "px";
                updated[i].open = !updated[i].open;
                updateBlock(index, "items", updated);
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                }}
              >
                <span>{item.q}</span>
                <span>{item.open ? "−" : "+"}</span>
              </div>

              <div
                id={`faq-prev-${index}-${i}`}
                style={{
                  height: item.open ? item._height || "auto" : "0px",
                  overflow: "hidden",
                  transition: "height 0.35s ease",
                }}
              >
                <p
                  style={{
                    color: block.text_color
                      ? block.text_color + "CC"
                      : "#CCCCCC",
                    fontSize: "0.95rem",
                    marginTop: "12px",
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <div
          key={index}
          style={{
            textAlign: block.alignment || "center",
            padding: block.padding ? `${block.padding}px` : "0px",
            margin: "20px 0",
            overflow: "visible",
          }}
        >
          <img
            src={block.image_url}
            alt=""
            className="rounded-lg"
            style={{
              maxWidth: block.full_width
                ? "100%"
                : block.width
                  ? `${block.width}%`
                  : "100%",
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
              padding: block.padding ? `${block.padding}px` : "0px",
              borderRadius: block.radius ? `${block.radius}px` : "0px",
              boxShadow: block.shadow
                ? (() => {
                    const angle = ((block.shadow_angle || 135) * Math.PI) / 180;
                    const offsetX = Math.round(
                      Math.cos(angle) * (block.shadow_offset || 10)
                    );
                    const offsetY = Math.round(
                      Math.sin(angle) * (block.shadow_offset || 10)
                    );
                    return `${offsetX}px ${offsetY}px ${
                      block.shadow_depth || 25
                    }px ${block.shadow_color || "rgba(0,0,0,0.5)"}`;
                  })()
                : "none",
            }}
          />

          {block.caption && (
            <p
              className="mt-3 text-gray-300 text-sm italic"
              style={{
                textAlign: block.alignment || "center",
              }}
            >
              {block.caption}
            </p>
          )}
        </div>
      );

    case "feature_offers_3": {
      const items = block.items || [];

      return (
        <div
          key={index}
          style={{
            background: block.use_no_bg
              ? "transparent"
              : block.use_gradient
                ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                    block.gradient_start || "#F285C3"
                  }, ${block.gradient_end || "#7bed9f"})`
                : block.match_main_bg
                  ? adjustForLandingOverlay(bgTheme)
                  : block.bg_color || bgTheme,

            padding: "40px 20px",
            borderRadius: block.use_no_bg ? "0px" : "20px",
            marginTop: "40px",
            maxWidth: "1100px",
            minHeight: "200px",
            marginLeft: "auto",
            marginRight: "auto",
            transition: "all 0.25s ease",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {items.map((item, i) => {
              const imageToShow = item.use_pdf_cover
                ? item.cover_url || item.image_url || null
                : item.image_url || item.cover_url || null;

              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "16px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  {/* IMAGE */}
                  {imageToShow ? (
                    <img
                      src={imageToShow}
                      alt=""
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        marginBottom: "16px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "160px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "0.85rem",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  {/* TITLE */}
                  <h3
                    style={{
                      color: "white",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                    }}
                  >
                    {item.title || "Offer Title"}
                  </h3>

                  {/* DESCRIPTION */}
                  <p
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.95rem",
                      marginBottom: "14px",
                    }}
                  >
                    {item.text || ""}
                  </p>

                  {/* PRICE */}
                  {item.price ? (
                    <p
                      style={{
                        color: "white",
                        fontWeight: 800,
                        fontSize: "1.3rem",
                        marginBottom: "16px",
                      }}
                    >
                      ${Number(item.price).toFixed(2)}
                    </p>
                  ) : null}

                  {/* BUTTON */}
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer",
                      background: item.button_color || "#22c55e",
                      color: block.button_text_color || "#000000",
                      fontSize: "1rem",
                    }}
                  >
                    {item.button_text || "Buy Now"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "secure_checkout": {
      return (
        <div
          key={index}
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "40px",
            marginBottom: "20px",
            color: block.text_color || "#ffffff",
          }}
        >
          {/* TITLE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                color: "#f1c40f", // 🔒 Gold (or change to green)
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
              }}
            >
              🔒
            </span>

            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                margin: 0,
                color: "#ffffff",
              }}
            >
              {block.title || "Secure Checkout"}
            </h2>
          </div>

          {/* SUBTEXT */}
          {block.subtext && (
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                margin: "8px auto 14px auto",
                fontSize: "1rem",
                maxWidth: "600px",
                lineHeight: 1.5,
              }}
            >
              {block.subtext}
            </p>
          )}

          {/* TRUST ITEMS */}
          {Array.isArray(block.trust_items) && block.trust_items.length > 0 && (
            <ul
              style={{
                margin: "10px auto 16px auto",
                padding: 0,
                listStyle: "none",
                maxWidth: "400px",
              }}
            >
              {block.trust_items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "6px",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "1rem",
                  }}
                >
                  <span style={{ color: "#22c55e", fontWeight: 900 }}>✔</span>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* GUARANTEE */}
          {block.guarantee && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {block.guarantee}
            </p>
          )}

          {/* PAYMENT BADGE */}
          {block.payment_badge && (
            <div style={{ marginTop: "14px" }}>
              <img
                src={block.payment_badge}
                alt="Secure Payments"
                style={{
                  width: "150px",
                  opacity: 0.85,
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>
      );
    }

    case "audio_player":
      return (
        <div
          key={index}
          style={{
            background: block.match_main_bg
              ? landing?.bg_theme || "#0d1117"
              : block.use_gradient
                ? `linear-gradient(${block.gradient_direction}, ${block.gradient_start}, ${block.gradient_end})`
                : block.bg_color || "#0d1117",
            border: "1px solid #1f2937",
            padding: block.padding ? `${block.padding}px` : "20px",
            borderRadius: "16px",
            maxWidth: "700px",
            margin: "45px auto",
            color: block.text_color || "#ffffff",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 0 25px rgba(0,0,0,0.35)",
            textAlign: block.alignment || "center",
          }}
        >
          {/* MAIN ROW */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "22px",
            }}
          >
            {/* COVER */}
            {block.show_cover !== false && block.cover_url && (
              <img
                src={block.cover_url}
                alt=""
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}

            {/* RIGHT SIDE */}
            <div style={{ flex: 1, textAlign: "left" }}>
              {/* TITLE + NOW PLAYING BARS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "6px",
                }}
              >
                {block.show_title !== false && block.title && (
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: block.text_color || "#ffffff",
                    }}
                  >
                    {block.title}
                  </span>
                )}

                {/* Fake now-playing bars */}
                <div
                  style={{
                    width: "16px",
                    height: "12px",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      width: "3px",
                      height: "3px",
                      background: block.progress_color || "#22c55e",
                      opacity: 0.5,
                    }}
                  />
                  <span
                    style={{
                      width: "3px",
                      height: "6px",
                      background: block.progress_color || "#22c55e",
                      opacity: 0.5,
                    }}
                  />
                  <span
                    style={{
                      width: "3px",
                      height: "10px",
                      background: block.progress_color || "#22c55e",
                      opacity: 0.5,
                    }}
                  />
                </div>
              </div>

              {/* CONTROLS ROW */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >
                {/* BACK 10s BUTTON */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={block.progress_color || "#22c55e"}
                  >
                    <path d="M15 18V6l-9 6 9 6z" />
                  </svg>
                </div>

                {/* PLAY BUTTON */}
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: block.progress_color || "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#000">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* FORWARD 10s BUTTON */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={block.progress_color || "#22c55e"}
                  >
                    <path d="M9 6v12l9-6-9-6z" />
                  </svg>
                </div>

                {/* Volume Slider */}
                <div style={{ width: "110px" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "4px",
                      background: "#1f2937",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "80%",
                        height: "100%",
                        background: block.progress_color || "#22c55e",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SCRUBBER */}
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#1f2937",
                  borderRadius: "6px",
                  overflow: "hidden",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    width: "20%",
                    height: "100%",
                    background: block.progress_color || "#22c55e",
                  }}
                />
              </div>

              {/* TIMES */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "6px",
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                }}
              >
                <span>00:00</span>
                <span>03:30</span>
              </div>
            </div>
          </div>

          {/* WAVEFORM MOCK */}
          <div
            style={{
              marginTop: "18px",
              height: "30px",
              width: "100%",
              background: "#000",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(
              to right,
              ${block.waveform_color || "#7bed9f"} 0px,
              ${block.waveform_color || "#7bed9f"} 2px,
              transparent 2px,
              transparent 6px
            )`,
                opacity: 0.9,
              }}
            />
          </div>
        </div>
      );

    case "container":
      let containerBackground = "transparent";

      if (block.use_gradient) {
        containerBackground = `linear-gradient(${block.gradient_direction}, ${block.gradient_start}, ${block.gradient_end})`;
      } else if (block.bg_color) {
        containerBackground = block.bg_color;
      } else if (block.match_main_bg) {
        containerBackground = adjustForLandingOverlay(bgTheme);
      }
      return (
        <div
          key={block.id || index}
          style={{
            background: containerBackground,
            padding: `${block.padding || 20}px`,
            borderRadius: block.radius ? `${block.radius}px` : "16px",
            margin: "40px auto",
            maxWidth: block.max_width || "100%",
          }}
        >
          {(block.children || []).map((child, i) =>
            renderPreviewBlock(child, i, context)
          )}
        </div>
      );
    default:
      return null;
  }
}

// This receives all props you already use in the preview
export default function PreviewPanel({
  showPreviewSection,
  setShowPreviewSection,
  landing,
  selectedTheme,
  fontName,
  bgTheme,
  user,
  updateBlock,
  adjustForLandingOverlay,
  blendColors,
}) {
  function findOfferBanners(blocks = []) {
    let results = [];

    for (const block of blocks) {
      if (block.type === "offer_banner") {
        results.push(block);
      }

      if (block.type === "container" && Array.isArray(block.children)) {
        results = results.concat(findOfferBanners(block.children));
      }
    }

    return results;
  }

  return (
    <div className="mt-12 bg-[#111827]/80 border border-gray-700 rounded-2xl shadow-inner p-6 transition-all hover:border-silver/60">
      {/* Header toggle */}
      <div
        onClick={() => setShowPreviewSection(!showPreviewSection)}
        className="flex items-center justify-between px-6 py-5 cursor-pointer select-none"
      >
        <h3 className="text-lg font-semibold text-silver tracking-wide">
          Landing Page Preview
        </h3>
        <span
          className={`text-gray-400 text-sm transform transition-transform duration-300 ${
            showPreviewSection ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </div>

      {/* Animated Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showPreviewSection
            ? "max-h-[9999px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="mt-8 p-10 rounded-xl text-center shadow-lg transition-all duration-500"
          style={{
            background: adjustForLandingOverlay(selectedTheme),
            fontFamily: fontName,
          }}
        >
          {findOfferBanners(landing.content_blocks).map((block, index) => {
            return (
              <div
                key={index}
                className="relative shadow-lg"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: block.text_color || "#fff",
                  textAlign: "center",
                  padding: `${block.padding || 50}px 20px`,
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  lineHeight: "1.5",
                  margin: "0 -30px 40px",
                  borderRadius: "24px 24px 0 0",
                  boxShadow: "none",
                }}
              >
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    margin: "0 0 22px",
                    textAlign: "center",
                  }}
                >
                  {block.text ||
                    "🔥 Limited Time Offer! Get your free eBook today!"}
                </p>

                <button
                  style={{
                    display: "block",
                    background: block.use_gradient
                      ? `linear-gradient(${block.gradient_direction || "90deg"}, ${
                          block.gradient_start || "#F285C3"
                        }, ${block.gradient_end || "#7bed9f"})`
                      : block.button_color || block.bg_color || "#F285C3",
                    color:
                      block.button_text_color || block.text_color || "#fff",
                    padding: "22px 36px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    border: "none",
                    width: "100%",
                    maxWidth: "340px",
                    margin: "16px auto 0 auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "transform 0.25s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {block.button_text || "Claim Offer"}
                </button>
              </div>
            );
          })}

          {landing.cover_image_url && (
            <img
              src={landing.cover_image_url}
              alt="PDF Cover"
              className="mx-auto mb-8 rounded-xl shadow-lg"
              style={{
                width: "100%",
                maxWidth: "480px",
                height: "auto", // <-- Add
                aspectRatio: "unset",
                objectFit: "cover",
                border: "2px solid rgba(255, 255, 255, 0.06)",
                background: "#000",
                boxShadow:
                  "0 15px 35px rgba(0, 0, 0, 0.25), 0 6px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: "12px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            />
          )}

          {landing.content_blocks?.length ? (
            landing.content_blocks
              .filter((b) => b.type !== "offer_banner")
              .map((block, index) =>
                renderPreviewBlock(block, index, {
                  landing,
                  selectedTheme,
                  fontName,
                  bgTheme,
                  user,
                  updateBlock,
                  adjustForLandingOverlay,
                  blendColors,
                })
              )
          ) : (
            <p className="text-gray-400 italic">
              Start adding sections to preview your landing page...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
