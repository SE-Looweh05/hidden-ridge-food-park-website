// Dine with us button
const dineBtn = document.getElementById('dineBtn');
dineBtn.addEventListener('click', () => {
  alert("Open Tuesday to Sunday: 3:00 PM – 12:00 Midnight\nMonday: Closed");
});

// SEE OUR MENU link
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', (e) => {
  e.preventDefault(); // prevent navigating
  alert("Coming soon!");
});