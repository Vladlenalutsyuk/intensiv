// schedule.js
document.addEventListener("DOMContentLoaded", () => {
  const userRaw = localStorage.getItem("razvitime_user");
  const guestBox = document.getElementById("schedule-guest-message");
  const content = document.getElementById("schedule-content");

  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (e) {
    user = null;
  }

  if (!user || user.role !== "parent") {
    // гость или не родитель
    guestBox.style.display = "block";
    content.style.display = "none";
  } else {
    // авторизованный родитель
    guestBox.style.display = "none";
    content.style.display = "block";
  }
});
