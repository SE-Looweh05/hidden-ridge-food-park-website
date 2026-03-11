// Dine with us button
const dineBtn = document.getElementById('dineBtn');
dineBtn.addEventListener('click', () => {
  alert("Open Tuesday to Sunday: 3:00 PM – 12:00 Midnight\nMonday: Closed");
});

// SEE OUR MENU link - smooth scroll to stalls
const menuBtn = document.getElementById('menuBtn');
const stallsSection = document.getElementById('stalls');

menuBtn.addEventListener('click', (e) => {
  e.preventDefault(); // prevent default link behavior
  stallsSection.scrollIntoView({ behavior: "smooth" });
});