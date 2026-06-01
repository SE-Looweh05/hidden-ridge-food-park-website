import StallCard from "./StallCard";

const STALLS = [
  { id: 1, img: "/images/stall1.png", desc: "Quick and tasty snacks like takoyaki, croffles, nachos, mojos, and hash browns—perfect for light bites while exploring the food park." },
  { id: 2, img: "/images/stall2.png", desc: "Home of flavorful grilled favorites including boneless chicken inasal, grilled bangus, and hearty pancit dishes made for sharing." },
  { id: 3, img: "/images/stall3.png", desc: "Japanese comfort food featuring ramen, gyudon, and gyoza with rich broth options like tonkotsu, shio, and miso for authentic flavors." },
  { id: 4, img: "/images/stall4.png", desc: "Classic comfort bites like burgers, fries, hotdog sandwiches, dimsum, and buttered corn—simple favorites loved by everyone." },
  { id: 5, img: "/images/stall5.png", desc: "Fast and filling Filipino silog meals like tapsilog, tocilog, hotsilog, tonkatsu, and more served with garlic rice and egg." },
  { id: 6, img: "/images/stall6.png", desc: "Filipino favorites including sizzling steaks, kare-kare, sisig, bagnet, and comforting sinigang for hearty meals." },
];

function FoodStallsSection({ stallsOpacity, stallsContentVisible }) {
  return (
    <div
      className="fixed-layer stalls-content-layer"
      style={{
        opacity: stallsOpacity,
        pointerEvents: stallsOpacity > 0.1 ? "auto" : "none",
      }}
    >
      <div className="stalls-section">
        <img
          src="/images/fs-img.png"
          alt=""
          className={`stalls-bg-img ${stallsOpacity > 0.05 ? "img-visible" : ""}`}
        />
        <h2 className={`stalls-title ${stallsContentVisible ? "content-rise" : "content-hidden"}`}>
          Explore <br />Our Food <br />Stalls
        </h2>
        <div className="stall-grid-wrapper">
          <div className="stall-grid">
            {STALLS.map((stall, index) => (
              <StallCard
                key={stall.id}
                stall={stall}
                index={index}
                visible={stallsContentVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodStallsSection;