/**
 * AnnouncementTicker — infinite seamless moving text strip placed at the very top of the page.
 * Slim horizontal strip (34px height) with dark brown bg #3E2723 and cream text #F8F1E7.
 * Pauses on hover, respects prefers-reduced-motion.
 */
export default function AnnouncementTicker() {
  const items = [
    "EXPERT HAIR CARE",
    "BEAUTY & GROOMING",
    "BRIDAL SPECIALISTS",
    "FAMILY SALON",
    "YOUR STYLE, YOUR CONFIDENCE",
  ];

  // Build one run of text with live dot and bullets
  const renderRun = (keyPrefix: string) => (
    <div key={keyPrefix} className="inline-flex items-center shrink-0">
      <span className="inline-flex items-center gap-2 mx-5">
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{
            background: "#C6A15B",
            boxShadow: "0 0 6px #C6A15B",
            animation: "wa-pulse 2s ease-out infinite",
          }}
        />
        <span className="font-semibold tracking-[0.24em] text-[#C6A15B]">LIVE</span>
      </span>
      <span className="opacity-30 mr-5">•</span>

      {items.map((item, idx) => (
        <span key={idx} className="inline-flex items-center">
          <span className="tracking-[0.2em]">{item}</span>
          <span className="opacity-30 mx-5">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="w-full overflow-hidden select-none relative z-50"
      style={{
        background: "#3E2723",
        height: 36,
        borderBottom: "1px solid rgba(198,161,91,0.2)",
      }}
      aria-hidden="true"
    >
      <div
        className="ticker-track h-full flex items-center"
        style={{
          color: "#F8F1E7",
          fontSize: "0.68rem",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
        }}
      >
        {/* Render multiple duplicate runs for infinite seamless loop */}
        {renderRun("run-1")}
        {renderRun("run-2")}
        {renderRun("run-3")}
        {renderRun("run-4")}
      </div>
    </div>
  );
}
