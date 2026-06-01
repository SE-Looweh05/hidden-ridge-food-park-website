function FooterSection({ endOpacity, endContentVisible }) {
  return (
    <>
      <div className="fixed-layer end-bg" style={{ opacity: endOpacity }} />
      <div
        className="fixed-layer end-content-layer"
        style={{
          opacity: endOpacity,
          pointerEvents: endOpacity > 0.1 ? "auto" : "none",
        }}
      >
        <div className="end-content">
          <div
            className="end-line"
            style={{ opacity: endContentVisible ? 1 : 0, transition: "opacity 0.6s ease" }}
          />
          <div className={`end-columns ${endContentVisible ? "content-rise" : "content-hidden"}`}>
            <div className="end-column">
              <h3>LOCATION</h3>
              <p>Hidden Ridge Food Park<br />Tolentino St, Silang, Cavite</p>
            </div>
            <div className="end-column">
              <h3>BUSINESS HOURS</h3>
              <p>Tuesday to Sunday: 3:00 PM - 12:00 MN<br /><b>Monday: CLOSED</b></p>
            </div>
            <div className="end-column">
              <h3>GET SOCIAL</h3>
              <img src="/images/social.png" className="social-img" alt="Social Media" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterSection;