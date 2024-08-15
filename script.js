const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const total = document.getElementById("total-amount");
const random = document.getElementById("random");
let price = 0;

function generatePrice() {
    changeDue.textContent = "";
    cash.value = "";
    const coinflip = Math.floor(Math.random() * 2);

    if (coinflip === 1) {
        price = Math.floor(Math.random() * 100 + 1);
    } else {
        price = Math.random() * 100 + 1;
        price = parseFloat(price.toFixed(2));
    }
    total.textContent = "Total: " + price;
}

random.addEventListener("click", () => {
    generatePrice();
})

let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const dependencies = [
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.1],
  ['QUARTER', 0.25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
];

function CashRegister() {
  let change = parseFloat((cash.value - price).toFixed(2));
  const changeArray = [];
  let totalCID = parseFloat(cid.reduce((total, currency) => total + currency[1], 0).toFixed(2));

  for (let i = 8; i >= 0; i--) {
    while (dependencies[i][1] <= change && cid[i][1] >= dependencies[i][1] && totalCID >= change) {
      change -= dependencies[i][1];
      change = parseFloat(change.toFixed(2));
      cid[i][1] -= dependencies[i][1];
      cid[i][1] = parseFloat(cid[i][1].toFixed(2));
      totalCID -= dependencies[i][1];
      totalCID = parseFloat(totalCID.toFixed(2));
      const currency = dependencies[i][0];
      const value = dependencies[i][1];
      const found = changeArray.find(([curr, _]) => curr  === currency);
      if (found) {
        found[1] += value;
        found[1] = parseFloat(found[1].toFixed(2));
      } else {
        changeArray.push([currency, value]);
      }
    }
  }

  const changeText = changeArray.map((element) => {
    return `${element[0]}: $${element[1]}`;
  }).join(" ");

  // handle all situations for the cash register
  const changeTotal = changeArray.reduce((total, element) => {
    return total + element[1];
  }, 0);

  if (change === 0 && changeTotal > 0 && totalCID > 0) {
    return changeDue.textContent = `Status: OPEN ${changeText}`
  } else if (change > changeTotal) {
    return changeDue.textContent = `Status: INSUFFICIENT_FUNDS`
  } else if (totalCID === 0 && changeTotal > 0 && change === 0) {
    return changeDue.textContent = `Status: CLOSED ${changeText}`;
  }
}

purchaseBtn.addEventListener("click", () => {
  if (cash.value < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (parseFloat(cash.value) === price) {
      changeDue.textContent = "No change due - customer paid with exact cash";
  } else {
     CashRegister();  
  }
})