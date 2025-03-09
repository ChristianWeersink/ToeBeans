// All search functions should be in here

// Search for nearby vet offices
async function nearbySearch(center) {
    const messageBox = document.getElementById("mapErrorBox"); // Get the message box

    try {
        const service = new google.maps.places.PlacesService(vetMap);
        
        // Clear previous markers
        markers.forEach(marker => marker.setMap(null)); 
        markers = [];

        // Construct search query
        const query = `${searchTerm} veterinary office`;
        const bounds = new google.maps.LatLngBounds();
        const northEast = google.maps.geometry.spherical.computeOffset(center, radius, 45);
        const southWest = google.maps.geometry.spherical.computeOffset(center, radius, 225);

        bounds.extend(northEast);
        bounds.extend(southWest);

        const request = {
            textQuery: query,
            fields: ["location", "id"],
            maxResultCount: maxResults,
            includedType: "veterinary_care",
            locationRestriction: bounds,
            isOpenNow: openNow,
        };

        const { Place } = await google.maps.importLibrary("places");
        const { places } = await Place.searchByText(request);

        if (places.length > 0) {
            // Clear any previous message
            messageBox.classList.add("d-none");

            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                // Create markers for each result
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: vetMap,
                    position: place.location,
                    id: place.id,
                    gmpClickable: true,
                });

                markers.push(marker); // Store marker for later removal

                // Marker click event
                marker.addListener("click", ({ domEvent, latLng }) => {
                    fetchPlaceDetails(place.id);
                    setCookie("selectedPlace", JSON.stringify(place), 1);
                });

                bounds.extend(place.location);
            });

            // Adjust map view
            bounds.extend(center);
            addUserMarker(center);
            vetMap.fitBounds(bounds);
        } else {
            // Show message instead of alert
            messageBox.textContent = "No vets found in this area. Try expanding the search parameters.";
            messageBox.classList.remove("d-none");

            // Reset map to user's location
            setMap(mapZoom, center);
        }
    } catch (e) {
        console.log("Error in nearby search:", e);
        
        // Display a generic error message
        messageBox.textContent = "An error occurred while searching. Please try again.";
        messageBox.classList.remove("d-none");
    }
};


// Search by search term entered in the location search text box if the location search is ticked
async function searchByLocation() {
    const locationInput = document.getElementById("location").value;
    const errorBox = document.getElementById("mapErrorBox");
    try {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address: locationInput }, async (results, status) => {
            if (status === "OK") {
                const newCenter = results[0].geometry.location;
                searchCenter.lat = newCenter.lat(); // set search center to the new center so distance can be calc'd
                searchCenter.lng = newCenter.lng();
                // Move the map to the new location
                vetMap.setCenter(newCenter);
                vetMap.setZoom(13); // Adjust zoom level for city-wide searches.

                // Hide any previous error message
                errorBox.classList.add("d-none");

                // Perform a search at the new location
                await nearbySearch(newCenter);
                addUserMarker(newCenter);
            } else {
                errorBox.textContent = "Location not found: " + locationInput;
                errorBox.classList.remove("d-none");
            }
        });
    } catch (error) {
        console.log("Error in geocoding:", error);
        errorBox.textContent = "An error occurred while searching. Please try again.";
        errorBox.classList.remove("d-none");
    }
}


// Use nearby search or location search to execute a search when an event happens
function executeSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Get user location 
                userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // retrieve search term, radius, and openNow status
                searchTerm = document.getElementById("type").value;
                radius = document.getElementById("radius").value;
                openNow = document.getElementById("openNow").checked;

                // If the search term is "any", we want to make it empty
                if (searchTerm === "any") {
                    searchTerm = "";
                }

                // search by location if the box is checked to do a text search
                if(document.getElementById("locationBox").checked){
                    searchByLocation();
                }
                else{
                    searchCenter = userLatLng;
                    nearbySearch(searchCenter);
                }
                
            },
            function (error) {
                alert("Error getting user location: " + error.message);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}