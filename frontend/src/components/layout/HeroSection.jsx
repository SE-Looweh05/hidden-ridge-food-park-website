function HeroSection({ bgLoaded, heroOpacity, logoLoaded, buttonsLoaded, onReserveClick, onScrollToMenu }) {
  return (
    <>
      <div
        className="fixed-layer hero-bg"
        style={{
          opacity: bgLoaded ? heroOpacity : 0,
          transition: bgLoaded ? "opacity 0.08s linear" : "opacity 2s ease",
        }}
      />
      <div
        className="fixed-layer hero-content-layer"
        style={{
          opacity: bgLoaded ? heroOpacity : 0,
          transition: bgLoaded ? "opacity 0.08s linear" : "opacity 2s ease",
          pointerEvents: heroOpacity > 0.1 ? "auto" : "none",
        }}
      >
        <div className="hero-content">
          <img
            src="/images/logo-hr.png"
            className="logo"
            alt="Hidden Ridge Logo"
            style={{ opacity: logoLoaded ? 1 : 0, transition: "opacity 1s ease" }}
          />
          <button
            className="cta-btn"
            onClick={onReserveClick}
            style={{
              opacity: buttonsLoaded ? 1 : 0,
              transition: "opacity 0.6s ease",
              pointerEvents: buttonsLoaded && heroOpacity > 0.1 ? "auto" : "none",
            }}
          >
            Reserve a Table
          </button>
        </div>
        <div
          className="bottom-link"
          style={{
            opacity: buttonsLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
            pointerEvents: buttonsLoaded && heroOpacity > 0.1 ? "auto" : "none",
          }}
        >
          <a href="#stalls" onClick={onScrollToMenu}>SEE OUR MENU →</a>
        </div>
      </div>
    </>
  );
}

export default HeroSection;