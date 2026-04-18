import { useState, useEffect, useRef } from "react";
import "./style.css";

function App() {

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");

  // SCROLL-BASED OPACITY STATE
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [cafeOpacity, setCafeOpacity] = useState(0);
  const [stallsOpacity, setStallsOpacity] = useState(0);
  const [endOpacity, setEndOpacity] = useState(0);

  // CONTENT VISIBILITY STATE
  const [heroContentVisible, setHeroContentVisible] = useState(false);
  const [cafeContentVisible, setCafeContentVisible] = useState(false);
  const [stallsContentVisible, setStallsContentVisible] = useState(false);
  const [endContentVisible, setEndContentVisible] = useState(false);

  // INITIAL LOAD STATES
  const [bgLoaded, setBgLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [buttonsLoaded, setButtonsLoaded] = useState(false);

  // INITIAL PAGE LOAD SEQUENCE
  useEffect(() => {
    const bgTimer = setTimeout(() => setBgLoaded(true), 500);
    const logoTimer = setTimeout(() => setLogoLoaded(true), 1000);
    const btnTimer = setTimeout(() => setButtonsLoaded(true), 2200);
    const heroTimer = setTimeout(() => setHeroContentVisible(true), 2200);

    return () => {
      clearTimeout(bgTimer);
      clearTimeout(logoTimer);
      clearTimeout(btnTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  // SCROLL HANDLER
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // HERO: fade out from 0 to 60% of first section
      const heroFade = Math.max(0, 1 - (scrollY / (vh * 0.6)));
      setHeroOpacity(heroFade);
      setHeroContentVisible(heroFade > 0.3 && buttonsLoaded);

      // CAFE: fade in at 40%-100% of section 1, fade out at 40%-100% of section 2
      const cafeFadeIn = Math.min(1, Math.max(0, (scrollY - vh * 0.4) / (vh * 0.6)));
      const cafeFadeOut = Math.max(0, 1 - Math.max(0, (scrollY - vh * 1.4) / (vh * 0.6)));
      const cafeVal = Math.min(cafeFadeIn, cafeFadeOut);
      setCafeOpacity(cafeVal);
      setCafeContentVisible(cafeVal > 0.6);

      // STALLS: fade in at 60%-100% of section 2, fade out at 40%-100% of section 3
      const stallsFadeIn = Math.min(1, Math.max(0, (scrollY - vh * 1.6) / (vh * 0.5)));
      const stallsFadeOut = Math.max(0, 1 - Math.max(0, (scrollY - vh * 2.4) / (vh * 0.6)));
      const stallsVal = Math.min(stallsFadeIn, stallsFadeOut);
      setStallsOpacity(stallsVal);
      setStallsContentVisible(stallsVal > 0.6);

      // END: fade in at 60%-100% of section 3
      const endFadeIn = Math.min(1, Math.max(0, (scrollY - vh * 2.6) / (vh * 0.5)));
      setEndOpacity(endFadeIn);
      setEndContentVisible(endFadeIn > 0.6);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [buttonsLoaded]);

  // SCROLL TO STALLS
  const scrollToMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({
      top: window.innerHeight * 2,
      behavior: "smooth",
    });
  };

  // SUBMIT RESERVATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    const guestsNum = Number(guests);
    if (!name.trim() || guestsNum <= 0 || !Number.isInteger(guestsNum)) {
      alert("Please enter a valid name and a positive number of guests.");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, guests }),
      });
      const data = await res.json();
      console.log(data);
      alert("Reservation submitted!");
      setShowModal(false);
      setName("");
      setGuests("");
    } catch (err) {
      console.error(err);
    }
  };

  // STALL DATA
  const stalls = [
    { id: 1, img: "/images/stall1.png", desc: "Quick and tasty snacks like takoyaki, croffles, nachos, mojos, and hash browns—perfect for light bites while exploring the food park." },
    { id: 2, img: "/images/stall2.png", desc: "Home of flavorful grilled favorites including boneless chicken inasal, grilled bangus, and hearty pancit dishes made for sharing." },
    { id: 3, img: "/images/stall3.png", desc: "Japanese comfort food featuring ramen, gyudon, and gyoza with rich broth options like tonkotsu, shio, and miso for authentic flavors." },
    { id: 4, img: "/images/stall4.png", desc: "Classic comfort bites like burgers, fries, hotdog sandwiches, dimsum, and buttered corn—simple favorites loved by everyone." },
    { id: 5, img: "/images/stall5.png", desc: "Fast and filling Filipino silog meals like tapsilog, tocilog, hotsilog, tonkatsu, and more served with garlic rice and egg." },
    { id: 6, img: "/images/stall6.png", desc: "Filipino favorites including sizzling steaks, kare-kare, sisig, bagnet, and comforting sinigang for hearty meals." }
  ];

  return (
    <>
      <div className="scroll-container">

        {/* BLACK BASE */}
        <div className="fixed-layer black-base" />

        {/* HERO BG */}
        <div
          className="fixed-layer hero-bg"
          style={{
            opacity: bgLoaded ? heroOpacity : 0,
            transition: bgLoaded ? "opacity 0.08s linear" : "opacity 2s ease",
          }}
        />

        {/* CAFE BG */}
        <div
          className="fixed-layer cafe-bg"
          style={{ opacity: cafeOpacity }}
        />

        {/* END BG */}
        <div
          className="fixed-layer end-bg"
          style={{ opacity: endOpacity }}
        />

        {/* HERO CONTENT */}
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
              style={{
                opacity: logoLoaded ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />
            <button
              className="cta-btn"
              onClick={() => setShowModal(true)}
              style={{
                opacity: buttonsLoaded ? 1 : 0,
                transition: "opacity 0.6s ease",
                pointerEvents: buttonsLoaded && heroOpacity > 0.1 ? "auto" : "none",
              }}
            >
              Dine with us
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
            <a href="#stalls" onClick={scrollToMenu}>SEE OUR MENU →</a>
          </div>
        </div>

        {/* CAFE CONTENT */}
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

        {/* STALLS CONTENT */}
        <div
          className="fixed-layer stalls-content-layer"
          style={{
            opacity: stallsOpacity,
            pointerEvents: stallsOpacity > 0.1 ? "auto" : "none",
          }}
        >
          <div className="stalls-section">

            {/* BG IMAGE — behind everything, fades in first */}
            <img
              src="/images/fs-img.png"
              alt=""
              className={`stalls-bg-img ${stallsOpacity > 0.05 ? "img-visible" : ""}`}
            />

            {/* TITLE — absolutely positioned */}
            <h2
              className={`stalls-title ${stallsContentVisible ? "content-rise" : "content-hidden"}`}
            >
              Explore<br />Our Food<br />Stalls
            </h2>

            {/* STALL GRID — right side */}
            <div className="stall-grid-wrapper">
              <div className="stall-grid">
                {stalls.map((stall, index) => (
                  <div
                    className="stall-card"
                    key={stall.id}
                    style={{
                      opacity: stallsContentVisible ? 1 : 0,
                      transform: stallsContentVisible ? "translateY(0)" : "translateY(20px)",
                      transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
                    }}
                  >
                    <div className="stall-logo">
                      <img src={stall.img} alt={`Stall ${stall.id}`} />
                    </div>
                    <div className="stall-description">{stall.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* END CONTENT */}
        <div
          className="fixed-layer end-content-layer"
          style={{
            opacity: endOpacity,
            pointerEvents: endOpacity > 0.1 ? "auto" : "none",
          }}
        >
          <div className="end-content">
            {/* LINE fades with content, not background */}
            <div
              className="end-line"
              style={{
                opacity: endContentVisible ? 1 : 0,
                transition: "opacity 0.6s ease",
              }}
            />
            <div className={`end-columns ${endContentVisible ? "content-rise" : "content-hidden"}`}>
              <div className="end-column">
                <h3>LOCATION</h3>
                <p>Hidden Ridge Food Park<br />Tolentino St, Silang, Cavite</p>
              </div>
              <div className="end-column">
                <h3>BUSINESS HOURS</h3>
                <p>Tuesday to Saturday: 3:00 PM - 12:00 MN<br /><b>Monday: CLOSED</b></p>
              </div>
              <div className="end-column">
                <h3>GET SOCIAL</h3>
                <img src="/images/social.png" className="social-img" alt="Social Media" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RESERVATION MODAL */}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal">
            <h2>Reserve a Table</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Number of Guests"
                value={guests}
                min="1"
                onChange={(e) => setGuests(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">Reserve</button>
              <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;