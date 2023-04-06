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
    "2023-04-01T17:01:17.194Z",
    "2023-04-05T23:36:17.929Z",
    "2023-04-06T10:51:36.790Z",
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
  currency: "GPB",
  locale: "en-GB", // de-DE
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
  currency: "EUR",
  locale: "es-ES",
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
//format and create html elements for all movements
const displayMovements = function (account, sort) {
  let movements = account.movements;
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[i]);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${formatDate(
        account,
        date,
        false,
        true
      )}</div>
      <div class="movements__value">${formatCurrency(
        account,
        mov.toFixed(2)
      )}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//calculate total balance and display
const calcPrintBalance = function (account) {
  const balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  account.balance = balance;
  labelBalance.textContent = `${formatCurrency(account, balance.toFixed(2))}`;
  labelDate.textContent = formatDate(account, new Date());
};

//update in/out/interest sums
const updateSums = function (account) {
  let movements = account.movements;
  //calculate total deposits
  let inSum = movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  //calculate total withdrawals
  let outSum = movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${formatCurrency(account, inSum.toFixed(2))}`;
  labelSumOut.textContent = `${formatCurrency(
    account,
    Math.abs(outSum).toFixed(2)
  )}`;

  //calculate total interest
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
  labelSumInterest.textContent = `${formatCurrency(
    account,
    interest.toFixed(2)
  )}`;
};

//individual username creation
const createUsername = function (userName) {
  return userName
    .toLowerCase()
    .split(" ")
    .map(function (name) {
      return name[0];
    })
    .join("");
};

//generating usernames
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = createUsername(account.owner);
  });
};
createUsernames(accounts); //call on startup so info is saved when logging in

//combined function for showing the account information
const displayBody = function (account) {
  let movements = account.movements;
  displayMovements(account);
  calcPrintBalance(account);
  updateSums(account);
};

function hideUI() {
  containerApp.style.opacity = 0;
}

function showUI() {
  containerApp.style.opacity = 100;
}

//constants
const daysToSimplify = 7; //how many days back to show a count rather than a specific date when simplifying

//variables
let currAccount;

//Internationalization
//Dates
//options objects
//complex date format
const optionsWTime = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

//basic date format
const optionsNumeric = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

//Dates functions
//determines the number of days between two dates
function calcDaysBetween(date1, date2) {
  return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
}

//format a date based on account specifications and specific use case
function formatDate(account, date, includeTime = true, simplify = false) {
  if (simplify) {
    let timeSince = calcDaysBetween(date, new Date());
    if (timeSince < daysToSimplify) {
      if (timeSince === 0) return "Today";
      if (timeSince === 1) return "Yesterday";
      if (timeSince < daysToSimplify) return `${timeSince} days ago`;
    }
  }
  let formattedDate;

  if (includeTime) {
    formattedDate = new Intl.DateTimeFormat(
      account.locale,
      optionsWTime
    ).format();
  } else {
    formattedDate = new Intl.DateTimeFormat(
      account.locale,
      optionsNumeric
    ).format();
  }
  return formattedDate;
}

//get a formatted string for this instant
function nowString() {
  return new Date().toISOString();
}

//Numbers formatting
const currencyOptions = {
  style: "currency",
  //actual currency will be set based on account info
};

//format currency based on account locale and currency
function formatCurrency(account, num) {
  currencyOptions.currency = account.currency;
  return new Intl.NumberFormat(account.locale, currencyOptions).format(num);
}

//Timer function
let logoutTimer;
const startLogoutTimer = function () {
  //set time to 5 minutes
  let time = 300;

  //clear timer if already running
  clearInterval(logoutTimer);

  //call timer every second
  const tick = function () {
    //in each call, print the remaining time to UI
    labelTimer.textContent = `${Math.floor(time / 60)}:${`${
      time % 60
    }`.padStart(2, "0")}`;

    //when time is at 0, stop timer, hide UI, log out user
    if (time === 0) {
      clearInterval(logoutTimer);
      hideUI();
      labelWelcome.textContent = "Login to get started";
      currAccount = null;
    }
    time--;
  };
  tick();
  logoutTimer = setInterval(tick, 1000);
};

//Fake Always logged in
// currAccount = account1;
// displayBody(currAccount);
// showUI();

//Event handlers
btnLogin.addEventListener("click", function (event) {
  //prevent page reload
  event.preventDefault();

  //find account
  currAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  //check for correct pin
  if (currAccount?.pin === +inputLoginPin.value) {
    //clear inputs
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();

    //display UI and welcome
    labelWelcome.textContent = `Welcome back, ${
      currAccount.owner.split(" ")[0]
    }`;
    showUI();

    //display balance, movements, summary
    displayBody(currAccount);

    //Timer at bottom right
    startLogoutTimer();
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
  //prevent reload
  e.preventDefault();

  //get transfer amounts and accounts
  const amount = +inputTransferAmount.value;
  let recievingAcc = inputTransferTo.value;
  recievingAcc = accounts.find(function (acc) {
    return acc.username === recievingAcc;
  });

  //check if we have enough money and send money
  if (isValidTransfer(amount, currAccount, recievingAcc)) {
    currAccount.movements.push(amount * -1);
    recievingAcc.movements.push(amount);
    currAccount.movementsDates.push(nowString());
    recievingAcc.movementsDates.push(nowString());
    displayBody(currAccount);
  }

  //clear inputs
  inputTransferAmount.value = inputTransferTo.value = "";

  //restart timer
  startLogoutTimer();
});

//bank only grants the loan if there is a single deposit greater than 10% of the loan amount
btnLoan.addEventListener("click", function (e) {
  //prevent page reload
  e.preventDefault();

  //get loan amount, check if it is a valid amount
  const loanAmount = Math.floor(+inputLoanAmount.value); //round off decimals
  if (
    loanAmount > 0 &&
    currAccount.movements.some(function (mov) {
      return mov >= loanAmount / 10;
    })
  ) {
    setTimeout(function () {
      currAccount.movements.push(loanAmount);
      currAccount.movementsDates.push(nowString());
      displayBody(currAccount);
    }, 2500); //adding timeout to simulate an approval process
  }

  //clear inputs
  inputLoanAmount.value = "";

  //restart timer
  startLogoutTimer();
});

btnClose.addEventListener("click", function (e) {
  //prevent reload
  e.preventDefault();

  //check if credentials are correct
  if (
    currAccount.username === inputCloseUsername.value &&
    currAccount.pin === +inputClosePin.value
  ) {
    //delete account, hide UI
    const index = accounts.findIndex(function (acc) {
      return acc.username === currAccount.username;
    });
    accounts.splice(index, 1);
    hideUI();
  }

  //clear inputs
  inputClosePin.value = inputCloseUsername.value = "";
});

//global so it persists across clicks
let sorting = false;
btnSort.addEventListener("click", function (e) {
  //prevent reload
  e.preventDefault();

  //sort movements
  displayMovements(currAccount, !sorting);

  //toggle sorting variable so it will toggle sorting if clicked again
  sorting = !sorting;

  //restart timer
  startLogoutTimer();
});
