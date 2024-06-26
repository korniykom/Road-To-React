"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movement, key, arr) {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${key + 1} ${type} 
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">${movement}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUserNames = (accounts) => {
  accounts.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((current) => current[0])
      .join("")
      .toUpperCase();
  });
};

createUserNames(accounts);
// accounts.map((el) => {
//   console.log(el.userName);
// });

const calcBallence = function (acc) {
  const balance = acc.movements.reduce(
    (accumulator, value) => value + accumulator,
    0
  );
  acc.balance = balance;
  labelBalance.textContent = `${balance} EUR`;
  return balance;
};

const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter((movement) => movement > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = incomes;
  const outcomes = acc.movements
    .filter((movement) => movement < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = Math.abs(outcomes);
  const interest = acc.movements
    .filter((value) => value > 0)
    .map((element) => (element * acc.interestRate) / 100)
    .filter((element) => element > 1)
    .reduce((acc, element) => acc + element, 0);
  labelSumInterest.textContent = interest;
};

let currentAccount;

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    displayMovements(currentAccount.movements);
    calcBallence(currentAccount);
    calcDisplaySummery(currentAccount);
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    (account) => account.userName === inputTransferTo.value
  );
  console.log(amount, receiver);
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver?.username !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    displayMovements(currentAccount.movements);
    calcBallence(currentAccount);
    calcDisplaySummery(currentAccount);
  }
});
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin == inputClosePin.value
  ) {
    containerApp.style.opacity = 0;

    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    console.log(accounts[index]);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    displayMovements(currentAccount.movements);
    calcBallence(currentAccount);
    calcDisplaySummery(currentAccount);
  }
  inputLoanAmount.value = "";
});
let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
const initialValue = movements[0];
const max = movements.reduce(
  (accumulator, value) => (accumulator > value ? accumulator : value),
  initialValue
);
console.log(max);
