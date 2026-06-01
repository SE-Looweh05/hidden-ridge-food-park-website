import { getTodayString, isMonday, getAvailableTimes, formatTime } from "../../utils/dateUtils";

function ReservationModal({
  name, setName, email, setEmail,
  guests, setGuests, date, setDate,
  time, setTime, isSubmitting,
  formErrors, setFormErrors,
  onSubmit, onClose,
}) {
  const availableTimes = date && !isMonday(date) ? getAvailableTimes(date) : [];

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal">
        <h2>Reserve a Table</h2>
        <form onSubmit={onSubmit}>

          {Object.keys(formErrors).length > 0 && (
            <div className="form-error-summary">
              Please fix the errors below before submitting.
            </div>
          )}

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {formErrors.name && <p className="field-error">{formErrors.name}</p>}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {formErrors.email && <p className="field-error">{formErrors.email}</p>}

          <input
            type="number"
            placeholder="Number of Guests"
            value={guests}
            min="1"
            onChange={(e) => {
              setGuests(e.target.value);
              if (formErrors.guests) setFormErrors((prev) => ({ ...prev, guests: "" }));
            }}
          />
          {formErrors.guests && <p className="field-error">{formErrors.guests}</p>}

          <input
            type="date"
            value={date}
            min={getTodayString()}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
              if (formErrors.date) setFormErrors((prev) => ({ ...prev, date: "" }));
            }}
          />
          {formErrors.date && <p className="field-error">{formErrors.date}</p>}
          {date && isMonday(date) && !formErrors.date && (
            <p className="field-error">We are closed on Mondays. Please select another date.</p>
          )}

          <select
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (formErrors.time) setFormErrors((prev) => ({ ...prev, time: "" }));
            }}
            disabled={!date || isMonday(date) || availableTimes.length === 0}
          >
            <option value="">Select a time</option>
            {availableTimes.map((t) => (
              <option key={t} value={t}>{formatTime(t)}</option>
            ))}
          </select>
          {formErrors.time && <p className="field-error">{formErrors.time}</p>}
          {date && !isMonday(date) && availableTimes.length === 0 && (
            <p className="field-error">No available times for today. Please select another date.</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "Submitting..." : "Reserve"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;