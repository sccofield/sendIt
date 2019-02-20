let place;
const options = {
  types: ['(cities)'],
  componentRestrictions: { country: 'ng' },
};

let fromAddress = '';
let toAddress = '';


// document.getElementById('order-from').value = '';



const initAutocomplete = () => {
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: { lat: 9.0765, lng: 7.3986 },
    mapTypeControl: false
  });
  directionsDisplay.setMap(map);

  const autocompleteFrom = new google.maps.places.Autocomplete(
    (document.getElementById('order-from')), options,
  );

  autocompleteFrom.addListener('place_changed', () => {
    place = autocompleteFrom.getPlace();
    if (!place.geometry) {
      document.getElementById('order-from').value = '';
    } else {
      document.getElementById('order-from').value = place.formatted_address;
      fromAddress = place.place_id;
      console.log(place)
    }
  });

  const autocompleteTo = new google.maps.places.Autocomplete(
    (document.getElementById('order-to')), options);
  autocompleteTo.addListener('place_changed', () => {
    place = autocompleteTo.getPlace();
    if (!place.geometry) {
      document.getElementById('order-to').value = '';
    } else {
      document.getElementById('order-to').value = place.formatted_address;
      toAddress = place.place_id;
      console.log(place)

    }
  });

  let onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('order-from').addEventListener('change', onChangeHandler);
  document.getElementById('order-to').addEventListener('change', onChangeHandler);
};
initAutocomplete();

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    // origin: document.getElementById('order-from').value,
    // destination: document.getElementById('order-to').value,
    origin: 'ChIJDeXxz9sGURARHdkeGbaEpYc',
    destination: 'ChIJ-9QZWvnjURARxBElh4Wj6gw',
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      console.log('response all good')
    } else {
      console.log(response)
      console.log('failling Directions request failed due to ' + status);
    }
  });
}
