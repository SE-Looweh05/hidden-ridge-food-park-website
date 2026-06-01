function StallCard({ stall, index, visible }) {
  return (
    <div
      className="stall-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
    >
      <div className="stall-logo">
        <img src={stall.img} alt={`Stall ${stall.id}`} />
      </div>
      <div className="stall-description">{stall.desc}</div>
    </div>
  );
}

export default StallCard;