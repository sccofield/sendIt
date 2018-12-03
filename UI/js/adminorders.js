const orderId = window.location.search.slice(4);
const token = localStorage.getItem('token');
const paragraph = document.createElement('P'); // Create a <p> element

const singleOrder = async () => {
  const orderUrl = `https://mysendit-api.herokuapp.com/api/v1/parcels/${orderId}`;

  const response = await fetch(orderUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });


  const result = await response.json();
  if (result.status !== 200) {
    console.log(result.data);
  } else {
    const orders = result.data[0];
    const { status, id, placedby } = orders;
    const currentLocation = orders.currentlocation;
    const fromLocation = orders.fromlocation;
    const toLocation = orders.tolocation;
    const date = orders.senton.slice(0, 10);
    document.getElementById('order-id').innerHTML = id;
    document.getElementById('status').innerHTML = status;
    document.getElementById('order-current').innerHTML = currentLocation;
    document.getElementById('order-from').innerHTML = fromLocation;
    document.getElementById('order-to').innerHTML = toLocation;
    document.getElementById('user-id').innerHTML = placedby;


  }
};
singleOrder();

const changeStatus = async (event) => {
  event.preventDefault();
  const orderUrl = `https://mysendit-api.herokuapp.com/api/v1/parcels/${orderId}/status`;
  const data = {
    status: document.getElementById('new-status').value,
  };

  const response = await fetch(orderUrl, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token,
    },
    mode: 'cors',
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.status !== 201) {
    const message = document.createTextNode(result.data[0].message);
    paragraph.appendChild(message);
    document.getElementById('error-message').appendChild(paragraph);
  } else {
    const message = document.createTextNode(result.data.message);
    paragraph.appendChild(message);
    document.getElementById('success-message').appendChild(paragraph);
  }
};

const changeLocation = async (event) => {
  event.preventDefault();
  const data = {
    currentLocation: document.getElementById('current-location').value,
  };
  const changeDestinationUrl = `https://mysendit-api.herokuapp.com/api/v1/parcels/${orderId}/currentlocation`;
  const response = await fetch(changeDestinationUrl, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token,
    },
    mode: 'cors',
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log(result);
  if (result.status !== 201) {
    const message = document.createTextNode(result.data[0].message);
    paragraph.appendChild(message);
    document.getElementById('error-message').appendChild(paragraph);
  } else {
    const message = document.createTextNode(result.data.message);
    paragraph.appendChild(message);
    document.getElementById('success-message').appendChild(paragraph);
  }
};

const initAutoComplete = () => {
  const options = {
    types: ['(cities)'],
    componentRestrictions: { country: 'ng' },
  };

  const autocompleteFrom = new google.maps.places.Autocomplete(
    (document.getElementById('current-location')), options,
  );

  autocompleteFrom.addListener('place_changed', () => {
    place = autocompleteFrom.getPlace();
    if (!place.geometry) {
      document.getElementById('current-location').value = '';
    } else {
      document.getElementById('current-location').value = place.formatted_address;
    }
  });
}
initAutoComplete();
