// Fetch the API key from your backend
fetch('/api-key')
    .then(response => response.json())
    .then(data => {
        // Once the API key is fetched, create the Google Maps script tag
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initMap&loading=async`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    })
    .catch(error => console.error('Error loading API key:', error));

// This function will be called once the Google Maps API is loaded
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return; // Check if the map container exists

    // Default location or user's location if available
    const defaultLatLng = { lat: -34.397, lng: 150.644 };

    // If you want to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Create a new map centered on the user's location
            new google.maps.Map(mapContainer, {
                center: userLatLng,
                zoom: 8,
            });
        }, function () {
            // Fallback to default location if geolocation fails
            new google.maps.Map(mapContainer, {
                center: defaultLatLng,
                zoom: 8,
            });
        });
    } else {
        // Fallback to default location if geolocation is not supported
        new google.maps.Map(mapContainer, {
            center: defaultLatLng,
            zoom: 8,
        });
    }
}
