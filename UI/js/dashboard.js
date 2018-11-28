const newOrder = async (event) => {
  event.preventDefault();
  document.getElementById('submit').disabled = true;
  const registerationUrl = 'http://localhost:8000/parcels';
  const paragraph = document.createElement('P'); // Create a <p> element

  const data = {
    weight: document.getElementById('order-weight').value,
    fromLocation: document.getElementById('order-from').value,
    toLocation: document.getElementById('order-to').value,

  };
  const token = localStorage.getItem('token');


  const response = await fetch(registerationUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token,
    },
    mode: 'cors',
    body: JSON.stringify(data),
  });

  // result = response.json();


  const result = await response.json();
  if (result.status !== 201) {
    const message = document.createTextNode(result.data.message);
    paragraph.appendChild(message);
    document.getElementById('error-message').appendChild(paragraph);
  } else {
    const message = document.createTextNode('Your order was placed succesfully.');
    paragraph.appendChild(message);
    document.getElementById('success-message').appendChild(paragraph);
  }

  document.getElementById('submit').disabled = false;
};


const getUserOrders = async () => {
  const userId = JSON.parse(localStorage.getItem('user'));
  console.log(userId);
  const registerationUrl = `http://localhost:8000/users/${userId.id}/parcels`;

  const response = await fetch(registerationUrl, {
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
    const orders = result.data;
    const totalOrders = result.data.length;
    const deliveredOrders = result.data.filter(order => order.status === 'delivered').length;
    const cancelledOrders = result.data.filter(order => order.status === 'cancelled').length;
    const transitOrders = result.data.filter(order => order.status === 'transit').length;
    const tablebody = document.getElementById('tablebody');
    document.getElementById('totalOrders').innerHTML = totalOrders;
    document.getElementById('deliveredOrders').innerHTML = deliveredOrders;
    document.getElementById('cancelledOrders').innerHTML = cancelledOrders;
    document.getElementById('transitOrders').innerHTML = transitOrders;

    orders.forEach((order) => {
      const eachOrder = `<tr>
      <td>${order.id}</td>
      <td>${order.weight}</td>
      <td>${order.senton.slice(0, 10)}</td>
      <td>${order.fromlocation}</td>
      <td>${order.tolocation}</td>
      <td>${order.currentlocation}</td>
      <td>${order.status}</td>
      <td ><a href="./orderdetails.html?id=${order.id}" >View details</a></td>
    </tr>`;
      tablebody.insertAdjacentHTML('afterend', eachOrder);
    });
  }
};

getUserOrders();
