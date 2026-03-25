import { useState, useEffect } from "react";
import "./style.css";

function App() {

  // MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");

  // RESERVATIONS STATE
  const [reservations, setReservations] = useState([]);

  // SCROLL FUNCTION
  const scrollToMenu = () => {
    document.getElementById("stalls").scrollIntoView({ behavior: "smooth" });
  };

  // FETCH RESERVATIONS
  const fetchReservations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error(err);
    }
  };

  // LOAD ON PAGE START
  useEffect(() => {
    fetchReservations();
  }, []);

  // SUBMIT RESERVATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, guests }),
      });

      const data = await res.json();
      console.log(data);

      alert("Reservation submitted!");

      // REFRESH DATA
      await fetchReservations();

      setShowModal(false);
      setName("");
      setGuests("");
    } catch (err) {
      console.error(err);
    }
  };

  // STALL DATA
  const stalls = [
    {
      id: 1,
      img: "/images/stall1.png",
      desc: "Quick and tasty snacks like takoyaki, croffles, nachos, mojos, and hash browns—perfect for light bites while exploring the food park."
    },
    {
      id: 2,
      img: "/images/stall2.png",
      desc: "Home of flavorful grilled favorites including boneless chicken inasal, grilled bangus, and hearty pancit dishes made for sharing."
    },
    {
      id: 3,
      img: "/images/stall3.png",
      desc: "Japanese comfort food featuring ramen, gyudon, and gyoza with rich broth options like tonkotsu, shio, and miso for authentic flavors."
    },
    {
      id: 4,
      img: "/images/stall4.png",
      desc: "Classic comfort bites like burgers, fries, hotdog sandwiches, dimsum, and buttered corn—simple favorites loved by everyone."
    },
    {
      id: 5,
      img: "/images/stall5.png",
      desc: "Fast and filling Filipino silog meals like tapsilog, tocilog, hotsilog, tonkatsu, and more served with garlic rice and egg."
    },
    {
      id: 6,
      img: "/images/stall6.png",
      desc: "Filipino favorites including sizzling steaks, kare-kare, sisig, bagnet, and comforting sinigang for hearty meals."
    }
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <img src="/images/logo-hr.png" className="logo" />

          <button className="cta-btn" onClick={() => setShowModal(true)}>
            Dine with us
          </button>
        </div>

        <div className="bottom-link">
          <a href="#" onClick={scrollToMenu}>SEE OUR MENU →</a>
        </div>
      </section>

      {/* CAFE */}
      <section className="cafe-section">
        <div className="cafe-overlay">
          <div className="cafe-top-text">
            <span>HIDDEN VIBES</span>
            <span>HONEST BREWS</span>
          </div>

          <h1 className="cafe-title">HIDDEN RIDGE CAFE</h1>
          <p className="cafe-subtitle">
            Where every cup feels like an escape
          </p>
        </div>
      </section>

      {/* STALLS */}
      <section id="stalls" className="stalls-section">
        <h2 className="stalls-title">Explore Our Food Stalls</h2>

        <div className="stall-grid">
          {stalls.map((stall) => (
            <div className="stall-card" key={stall.id}>
              <div className="stall-logo">
                <img src={stall.img} alt={`Stall ${stall.id}`} />
              </div>
              <div className="stall-description">
                {stall.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* END */}
      <section className="end-section">
        <div className="end-content">
          <div className="end-line"></div>

          <div className="end-columns">
            <div className="end-column">
              <h3>LOCATION</h3>
              <p>
                Hidden Ridge Food Park<br />
                Tolentino St, Silang, Cavite
              </p>
            </div>

            <div className="end-column">
              <h3>BUSINESS HOURS</h3>
              <p>
                Tuesday to Saturday: 3:00 PM - 12:00 MN<br />
                <b>Monday: CLOSED</b>
              </p>
            </div>

            <div className="end-column">
              <h3>GET SOCIAL</h3>
              <img src="/images/social.png" className="social-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ADMIN PANEL */}
      <section style={{ padding: "50px", background: "#111", color: "white" }}>
        <h2>Admin Panel - Reservations</h2>

        {reservations.length === 0 ? (
          <p>No reservations yet</p>
        ) : (
          <ul>
            {reservations.map((res) => (
              <li key={res.id}>
                {res.name} - {res.guests} guests
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
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
                onChange={(e) => setGuests(e.target.value)}
                required
              />

              <button type="submit">Reserve</button>
              <button type="button" onClick={() => setShowModal(false)}>
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