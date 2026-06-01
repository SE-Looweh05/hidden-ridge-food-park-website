import { useState, useEffect } from "react";
import { useScrollFade } from "../hooks/useScrollFade";
import HeroSection from "../components/layout/HeroSection";
import CafeSection from "../components/layout/CafeSection";
import FoodStallsSection from "../components/stalls/FoodStallsSection";
import FooterSection from "../components/layout/FooterSection";
import ReservationModal from "../components/reservation/ReservationModal";
import ConfirmationModal from "../components/reservation/ConfirmationModal";
import ErrorModal from "../components/reservation/ErrorModal";
import ToastContainer from "../components/common/ToastContainer";
import { isMonday } from "../utils/dateUtils";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  const [bgLoaded, setBgLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [buttonsLoaded, setButtonsLoaded] = useState(false);

  const {
    heroOpacity, cafeOpacity, stallsOpacity, endOpacity,
    cafeContentVisible, stallsContentVisible, endContentVisible,
  } = useScrollFade();

  // INITIAL PAGE LOAD SEQUENCE
  useEffect(() => {
    const bgTimer = setTimeout(() => setBgLoaded(true), 500);
    const logoTimer = setTimeout(() => setLogoLoaded(true), 1000);
    const btnTimer = setTimeout(() => setButtonsLoaded(true), 2200);
    return () => { clearTimeout(bgTimer); clearTimeout(logoTimer); clearTimeout(btnTimer); };
  }, []);

  // WAKE UP RENDER ON PAGE LOAD
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/`).catch(() => {});
  }, []);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const scrollToMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: window.innerHeight * 2, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guestsNum = Number(guests);
    const errors = {};

    if (!name.trim()) errors.name = "Please enter your name.";
    if (!guests || guestsNum <= 0 || !Number.isInteger(guestsNum)) errors.guests = "Please enter a valid number of guests.";
    if (!date) errors.date = "Please select a date.";
    else if (isMonday(date)) errors.date = "We are closed on Mondays. Please select another date.";
    if (!time) errors.time = "Please select a time.";
    if (!email.trim()) errors.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";

    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, guests, date, time, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Something went wrong. Please try again.");
        setShowModal(false);
        setShowErrorModal(true);
        return;
      }
      setConfirmedReservation({ name, email, guests, date, time });
      setShowModal(false);
      setShowConfirmModal(true);
      setName(""); setEmail(""); setGuests(""); setDate(""); setTime("");
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again.");
      setShowModal(false);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} />

      <div className="scroll-container">
        <div className="fixed-layer black-base" />

        <HeroSection
          bgLoaded={bgLoaded}
          heroOpacity={heroOpacity}
          logoLoaded={logoLoaded}
          buttonsLoaded={buttonsLoaded}
          onReserveClick={() => setShowModal(true)}
          onScrollToMenu={scrollToMenu}
        />

        <CafeSection
          cafeOpacity={cafeOpacity}
          cafeContentVisible={cafeContentVisible}
        />

        <FoodStallsSection
          stallsOpacity={stallsOpacity}
          stallsContentVisible={stallsContentVisible}
        />

        <FooterSection
          endOpacity={endOpacity}
          endContentVisible={endContentVisible}
        />
      </div>

      {showModal && (
        <ReservationModal
          name={name} setName={setName}
          email={email} setEmail={setEmail}
          guests={guests} setGuests={setGuests}
          date={date} setDate={setDate}
          time={time} setTime={setTime}
          isSubmitting={isSubmitting}
          formErrors={formErrors} setFormErrors={setFormErrors}
          onSubmit={handleSubmit}
          onClose={() => { setShowModal(false); setFormErrors({}); setEmail(""); }}
        />
      )}

      {showConfirmModal && confirmedReservation && (
        <ConfirmationModal
          reservation={confirmedReservation}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}

export default HomePage;