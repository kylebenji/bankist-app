"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450.59, -400, 3000, -650, -130, 70.34, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790.66, -3210, -1000, 8500.75, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200.97, 340, -300, -20.01, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430.43, 1000, 700, 50.76, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "en-US",
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

//helper functions
const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">$${mov.toFixed(2)}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcPrintBalance = function (account) {
  const balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  account.balance = balance;
  labelBalance.textContent = `$${balance.toFixed(2)}`;
};

const updateSums = function (account) {
  let movements = account.movements;
  let inSum = movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  let outSum = movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `$${inSum.toFixed(2)}`;
  labelSumOut.textContent = `$${Math.abs(outSum).toFixed(2)}`;

  const interest = movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (dep) {
      return (dep * account.interestRate) / 100;
    })
    .filter(function (int) {
      return int > 1; //only include interest > $1
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `$${interest.toFixed(2)}`;
};
// updateSums(account1.movements);

const createUsername = function (userName) {
  return userName
    .toLowerCase()
    .split(" ")
    .map(function (name) {
      return name[0];
    })
    .join("");
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = createUsername(account.owner);
  });
};
createUsernames(accounts);

const displayBody = function (account) {
  let movements = account.movements;
  displayMovements(movements);
  calcPrintBalance(account);
  updateSums(account);
};

//variables
let currAccount;

//Event handlers

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();
  currAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currAccount);
  if (currAccount?.pin === +inputLoginPin.value) {
    console.log("Correct pin");
    //clear inputs
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();

    //display UI and welcome
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //display balance, movements, summary
    displayBody(currAccount);
  }
});

function isValidTransfer(amount, sendAcc, recAcc) {
  if (recAcc === sendAcc) {
    return false;
  }
  if (sendAcc.balance < amount) {
    return false;
  }
  if (amount < 0) {
    return false;
  }
  if (!recAcc) return false;
  return true;
}

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  let recievingAcc = inputTransferTo.value;
  recievingAcc = accounts.find(function (acc) {
    return acc.username === recievingAcc;
  });
  if (isValidTransfer(amount, currAccount, recievingAcc)) {
    currAccount.movements.push(amount * -1);
    recievingAcc.movements.push(amount);
    console.log("transfer valid");
  } else console.log("transfer invalid");
  displayBody(currAccount);
  inputTransferAmount.value = inputTransferTo.value = "";
  console.log(amount, recievingAcc);
});

//bank only grants the loan if there is a single deposit greater than 10% of the loan amount
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(+inputLoanAmount.value); //round off decimals
  if (
    loanAmount > 0 &&
    currAccount.movements.some(function (mov) {
      return mov >= loanAmount / 10;
    })
  ) {
    currAccount.movements.push(loanAmount);
    displayBody(currAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  //check if credentials are correct
  if (
    currAccount.username === inputCloseUsername.value &&
    currAccount.pin === +inputClosePin.value
  ) {
    console.log("deleting");
    const index = accounts.findIndex(function (acc) {
      return acc.username === currAccount.username;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

let sorting = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currAccount.movements, !sorting);
  sorting = !sorting;
});
