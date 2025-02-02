// Function to set a cookie with a given name, value, and expiration time (in days)
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}
// Make set cookie available gloablly
window.setCookie = setCookie;

// Get a cookie
function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}
window.getCookie = getCookie;

// Function to delete a cookie by setting its expiration to the past
function deleteCookie(name) {
    document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}
window.deleteCookie = deleteCookie;