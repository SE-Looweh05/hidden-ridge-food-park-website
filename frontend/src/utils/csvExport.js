import { formatDateShort, formatTime, formatCreatedAt } from "./dateUtils";

export const exportCSV = (reservations) => {
  const headers = ["#", "Name", "Guests", "Email", "Date", "Time", "Created At"];
  const rows = reservations.map((res, index) => [
    index + 1,
    res.name,
    res.guests,
    res.email || "—",
    formatDateShort(res.date),
    res.time ? formatTime(res.time) : "—",
    formatCreatedAt(res.created_at),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((val) => `"${val}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reservations-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};