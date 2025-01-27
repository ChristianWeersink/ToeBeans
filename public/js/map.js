let vetMap; // Declare map globally
let userMarker; // Global user marker
const defaultLatLng = { lat: -34.397, lng: 150.644 };

// Parameters to change using user input/UI elements
const radius = 2000; // search radius this will be a variable later
const searchTerm = "dogs veterinary clinic";
const maxResults = 5; //1-20 results
const mapZoom = 12; //zoom value for the map
const mapContainer = document.getElementById('map');


// This function will be called once the Google Maps API is loaded
function initMap() {
    
    if (!mapContainer) return; // Check if the map container exists
    setMap(mapZoom, defaultLatLng);
    
    // Default location or user's location if available

    // If you want to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Create a new map centered on the user's location
                setMap(mapZoom, userLatLng);

                // Call nearby search
                nearbySearch(userLatLng);
                // Add a "You Are Here" marker
                addUserMarker(userLatLng);
            },
            function () {
                // Fallback to default location if geolocation fails
                setMap(mapZoom, defaultLatLng);
                // Call nearby search
                // nearbySearch(defaultLatLng);
            }
        );
    } else {
        // Fallback to default location if geolocation is not supported
        setMap(mapZoom, defaultLatLng);
        // Call nearby search
        //nearbySearch(defaultLatLng);
    }
}

async function nearbySearch(center) {
    const service = new google.maps.places.PlacesService(vetMap);
    
    // Create the text search query string
    const query = `${searchTerm} near me`;

    const request = {
        textQuery: query,  // The query string is used here for text search
        fields: ['location', 'id',], // You can include additional fields based on your need
        maxResultCount: maxResults,
        includedType: "veterinary_care"
    };
    const { Place } = await google.maps.importLibrary("places");

    const { places } = await Place.searchByText(request);
        if (places) {
            const bounds = new google.maps.LatLngBounds();
            places.forEach((place) => {
                // Use AdvancedMarkerElement for nearby places
                console.log(place);
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: vetMap,
                    position: place.location,
                    id: place.id,
                    gmpClickable: true,
                });
                marker.addListener("click", ({ domEvent, latLng }) => {
                    const { target } = domEvent;
                    const placeDetail = fetchPlaceDetails(place.id);
                  });

                bounds.extend(place.location);
            });

            vetMap.fitBounds(bounds);
        } else {
            console.error('No results found or error in Places API:', status);
        }
    };


// Add "You Are Here" marker using AdvancedMarkerElement
function addUserMarker(userLatLng) {
    if (userMarker) {
        // If the marker already exists, update its position
        userMarker.position = userLatLng;
    } else {
        // Create a new marker
        userMarker = new google.maps.marker.AdvancedMarkerElement({
            map: vetMap,
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
    markerDiv.innerText = ''; // Initial for "User"
    return markerDiv;
}
// Set map variable to specified zoom and center position zoom, int and center latlng
function setMap(zoom, center){
    vetMap = new google.maps.Map(mapContainer, {
        center: center,
        zoom: zoom,
        mapId: "a4767227d798f20e",
        scrollwheel: true, // Enable scroll wheel zoom
        gestureHandling: 'greedy',
    })
}
// On search button click get users location, add that to the map, get search params from the form, do a search in the database to see if this has been searched in this area before, if it has load the results from the database. if the search is new for this area, search for the nearby vets, and display those markers on the page. Store the search in the database.

/*Steps: 
(frontend)get users location
(frontend)Get search params
(frontend)Send search to backend using fetch
(backend) check if search params are in the database (check user latlng but also within 500m or so depending on how the map feels)
(backend) return the stored latlngs and location id's if they are there
(backend) if only id's are there in the search term, do a call for the locations of each id and then store and return them
(backend) make a back-end call to the google places api to get place ids and latlngs and return them to the front end
(backend) store the search in the database with the place ids and latlngs (latlng for 30 days only)
(frontend) Add the markers to the map with the id attached
(frontend) Add a click event for the markers to make a front end api call to bring up details including add to favourites functionality
*/
document.getElementById("search").addEventListener("click", ()=>{
    
});


async function fetchPlaceDetails(placeId) {
    const { Place } = await google.maps.importLibrary("places");
    const place = new Place({
        id: placeId,
    });
    await place.fetchFields({
        fields: [
            'displayName',
            'formattedAddress',
            'nationalPhoneNumber',
            'regularOpeningHours',
            'websiteURI',
        ], 
    });
    console.log(place);
    displayPlaceDetails(place);
}

function displayPlaceDetails(place){
    const detailContainer = document.getElementById('results-panel');
    const content = `
    <h2>${place.displayName}</h2>
    <p>Address: ${place.formattedAddress}</p>
    <p>Phone Number: ${place.nationalPhoneNumber}</p>
    <p>Open Hours: ${place.regularOpeningHours.weekdayDescriptions}</p>
    <p>Website: <a href='${place.websiteURI}' target='blank'>${place.websiteURI}</a></p>
    <input type='submit' id='add-favourites-btn' value='Add to Favourites'>
    `
    ;
    detailContainer.innerHTML = content;
}