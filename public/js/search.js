// All search functions should be in here

// Search for nearby vet offices
async function nearbySearch(center) {
    try{
        const service = new google.maps.places.PlacesService(vetMap);
        markers.forEach(marker => marker.setMap(null)); // Remove markers from the map
        markers = [];
    
        // Create the text search query string
        const query = `${searchTerm} veterinary office`;
        const bounds = new google.maps.LatLngBounds();
        const northEast = google.maps.geometry.spherical.computeOffset(center, radius, 45); // 45 degrees for NE corner
        const southWest = google.maps.geometry.spherical.computeOffset(center, radius, 225); // 225 degrees for SW corner

        bounds.extend(northEast);
        bounds.extend(southWest);
        var fields = ['location', 'id',];
        // check if the user wants only open locations
        const request = {
            textQuery: query,  // The query string is used here for text search
            fields: fields, // You can include additional fields based on your need
            maxResultCount: maxResults,
            includedType: "veterinary_care",
            locationRestriction: bounds,
            isOpenNow: openNow,
        };
        const { Place } = await google.maps.importLibrary("places");
    
        const { places } = await Place.searchByText(request);
    
            if (places.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                places.forEach((place) => {
                    // Use AdvancedMarkerElement for nearby places
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        map: vetMap,
                        position: place.location,
                        id: place.id,
                        gmpClickable: true,
                    });
                    markers.push(marker); // store the marker to delete later
                    // Event to do when a user clicks on a marker
                    marker.addListener("click", ({ domEvent, latLng }) => {
                        const { target } = domEvent;
                        const placeDetail = fetchPlaceDetails(place.id);
                        setCookie("selectedPlace", JSON.stringify(place), 1); // Set selected place id to use for favourites button
                      });
                    
                    bounds.extend(place.location);
                });
                // Extend the map screen to fit user and add user marker to the map
                bounds.extend(center);
                addUserMarker(center);
                vetMap.fitBounds(bounds);
            } else {
                setMap(mapZoom, center);
                alert("No vets found in this area");
            }
    }
    catch(e){
        console.log(e)
    }
};

// Search by search term entered in the location search text box if the location search is ticked
async function searchByLocation() {
    const locationInput = document.getElementById("location").value;
    try {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address: locationInput }, async (results, status) => {
            if (status === "OK") {
                const newCenter = results[0].geometry.location;
                searchCenter.lat = newCenter.lat(); // set search center to the new center so distance can be calc'd
                searchCenter.lng = newCenter.lng();
                // Move the map to the new location
                vetMap.setCenter(newCenter);
                vetMap.setZoom(13); // Adjust zoom level for city-wide searches

                // Perform a search at the new location
                await nearbySearch(newCenter);
                addUserMarker(newCenter);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    } catch (error) {
        console.log("Error in geocoding:", error);
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