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
                    marker.addListener("click", ({ domEvent, latLng }) => {
                        const { target } = domEvent;
                        const placeDetail = fetchPlaceDetails(place);
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