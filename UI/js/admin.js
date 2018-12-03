const token = localStorage.getItem('token');

const getAllUserOrders = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const allOrdersUrl = `https://mysendit-api.herokuapp.com/api/v1/parcels`;

  const response = await fetch(allOrdersUrl, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token,
    },
  });


  const result = await response.json();
  if (result.status !== 200) {
    console.log(result.data);
  } else {
    const orders = result.data;

    orders.forEach((order) => {
      console.log(order);
      const eachOrder = `<tr>
      <td>${order.id}</td>
      <td>${order.weight}</td>
      <td>${order.senton.slice(0, 10)}</td>
      <td>${order.fromlocation}</td>
      <td>${order.tolocation}</td>
      <td>${order.currentlocation}</td>
      <td>${order.status}</td>
      <td ><a href="./adminorders.html?id=${order.id}" >View details</a></td>
    </tr>`;
      tablebody.insertAdjacentHTML('afterend', eachOrder);
    });
  }
};

getAllUserOrders();
