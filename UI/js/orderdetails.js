
const orderId = window.location.search.slice(4);
const token = localStorage.getItem('token');
const paragraph = document.createElement('P'); // Create a <p> element


const singleOrder = async () => {
  const orderUrl = `hhttps://mysendit-api.herokuapp.com/api/v1/parcels/${orderId}`;

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
    const { status, id } = orders;
    const currentLocation = orders.currentlocation;
    const fromLocation = orders.fromlocation;
    const toLocation = orders.tolocation;
    const date = orders.senton.slice(0, 10);
    document.getElementById('order-id').innerHTML = id;
    document.getElementById('order-status').innerHTML = status;
    document.getElementById('order-current').innerHTML = currentLocation;
    document.getElementById('order-from').innerHTML = fromLocation;
    document.getElementById('order-to').innerHTML = toLocation;
    document.getElementById('order-date').innerHTML = date;

    // orders.forEach((order) => {
    //   const eachOrder = `<tr>
    //   <td>${order.weight}</td>
    //   <td>${order.senton.slice(0, 10)}</td>
    //   <td>${order.fromlocation}</td>
    //   <td>${order.tolocation}</td>
    //   <td>${order.currentlocation}</td>
    //   <td>${order.status}</td>
    //   <td ><a href="./orderdetails.html?id=${order.id}" >View details</a></td>
    // </tr>`;
    //   tablebody.insertAdjacentHTML('afterend', eachOrder);
    // });
  }
};
singleOrder();

const cancelOrder = async () => {
  const orderUrl = `https://mysendit-api.herokuapp.com/api/v1/parcels/${orderId}/cancel`;

  const response = await fetch(orderUrl, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token,
    },
    mode: 'cors',
  });
  const result = await response.json();
  if (result.status !== 201) {
    const message = document.createTextNode(result.data.message);
    paragraph.appendChild(message);
    document.getElementById('error-message').appendChild(paragraph);
  } else {
    const message = document.createTextNode(result.data.message);
    paragraph.appendChild(message);
    document.getElementById('success-message').appendChild(paragraph);
  }
};

const changeDestination = async (event) => {
  event.preventDefault();
  const data = {
    toLocation: document.getElementById('to-location').value,
  };
  const changeDestinationUrl = `https://mysendit-api.herokuapp.com/api/v1/parcels/${orderId}/destination`;
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
