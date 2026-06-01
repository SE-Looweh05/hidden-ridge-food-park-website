export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

export const isMonday = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr + "T00:00:00").getDay() === 1;
};

export const getAvailableTimes = (date) => {
  const times = [];
  const now = new Date();
  const isToday = date === getTodayString();

  for (let hour = 15; hour <= 21; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 21 && min > 0) break;
      const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      if (isToday) {
        const slotTime = new Date();
        slotTime.setHours(hour, min, 0, 0);
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        if (slotTime < twoHoursFromNow) continue;
      }
      times.push(timeStr);
    }
  }
  return times;
};

export const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hour, min] = timeStr.split(":");
  const h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayHour}:${min} ${ampm}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

export const formatCreatedAt = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};