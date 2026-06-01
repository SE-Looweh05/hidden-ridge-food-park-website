function CafeSection({ cafeOpacity, cafeContentVisible }) {
  return (
    <>
      <div className="fixed-layer cafe-bg" style={{ opacity: cafeOpacity }} />
      <div
        className="fixed-layer cafe-content-layer"
        style={{
          opacity: cafeOpacity,
          pointerEvents: cafeOpacity > 0.1 ? "auto" : "none",
        }}
      >
        <div className="cafe-overlay">
          <div className={`cafe-top-text ${cafeContentVisible ? "content-rise" : "content-hidden"}`}>
            <span>HIDDEN VIBES</span>
            <span>HONEST BREWS</span>
          </div>
          <h1 className={`cafe-title ${cafeContentVisible ? "content-rise" : "content-hidden"}`}>
            HIDDEN RIDGE CAFE
          </h1>
          <p className={`cafe-subtitle ${cafeContentVisible ? "content-rise-delay" : "content-hidden"}`}>
            Where every cup feels like an escape
          </p>
        </div>
      </div>
    </>
  );
}

export default CafeSection;