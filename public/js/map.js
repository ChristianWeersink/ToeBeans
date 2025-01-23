let map; // Declare map globally
let userMarker; // Global user marker

// Fetch the API key from your backend
fetch('/api-key')
    .then((response) => response.json())
    .then((data) => {
        // Once the API key is fetched, create the Google Maps script tag
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&callback=initMap&libraries=places,marker`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    })
    .catch((error) => console.error('Error loading API key:', error));

// This function will be called once the Google Maps API is loaded
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return; // Check if the map container exists

    // Default location or user's location if available
    const defaultLatLng = { lat: -34.397, lng: 150.644 };

    // If you want to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Create a new map centered on the user's location
                map = new google.maps.Map(mapContainer, {
                    center: userLatLng,
                    zoom: 12,
                });

                // Call nearby search
                nearbySearch(userLatLng);
                // Add a "You Are Here" marker
                addUserMarker(userLatLng);
            },
            function () {
                // Fallback to default location if geolocation fails
                map = new google.maps.Map(mapContainer, {
                    center: defaultLatLng,
                    zoom: 12,
                });

                // Call nearby search
                nearbySearch(defaultLatLng);
            }
        );
    } else {
        // Fallback to default location if geolocation is not supported
        map = new google.maps.Map(mapContainer, {
            center: defaultLatLng,
            zoom: 12,
        });

        // Call nearby search
        nearbySearch(defaultLatLng);
    }
}

async function nearbySearch(center) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: center,
        radius: 10000, // 10km
        keyword: 'Vet',
        maxResultCount: 5,
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const bounds = new google.maps.LatLngBounds();

            results.forEach((place) => {
                // Use AdvancedMarkerElement for nearby places
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: place.geometry.location,
                    title: place.name,
                });

                bounds.extend(place.geometry.location);
            });

            map.fitBounds(bounds);
        } else {
            console.error('No results found or error in Places API:', status);
        }
    });
}

// Add "You Are Here" marker using AdvancedMarkerElement
function addUserMarker(userLatLng) {
    if (userMarker) {
        // If the marker already exists, update its position
        userMarker.position = userLatLng;
    } else {
        // Create a new marker
        userMarker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: userLatLng,
            title: 'You Are Here',
            content: createCustomMarkerContent(), // Optional: Create a custom HTML content
        });
    }
}

// Create custom HTML content for the marker (optional)
function createCustomMarkerContent() {
    const markerDiv = document.createElement('div');
    markerDiv.style.backgroundColor = '#4285F4'; // Google blue
    markerDiv.style.borderRadius = '50%';
    markerDiv.style.width = '20px';
    markerDiv.style.height = '20px';
    markerDiv.style.display = 'flex';
    markerDiv.style.justifyContent = 'center';
    markerDiv.style.alignItems = 'center';
    markerDiv.style.color = 'white';
    markerDiv.style.fontSize = '12px';
    markerDiv.innerText = 'U'; // Initial for "User"
    return markerDiv;
}
