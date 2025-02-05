// Calculate distance
function calculateDistance(userLat, userLng, targetLat, targetLng) {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(targetLat - userLat);
    const dLng = toRadians(targetLng - userLng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(userLat)) * Math.cos(toRadians(targetLat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var num = R * c;
    num = Math.round(num * 100) / 100;
    return num; // Distance in km
}
// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
