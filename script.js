"use strict";

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
      <div class="movements__value">$${mov}</div>
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
  labelBalance.textContent = `$${balance}`;
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
  labelSumIn.textContent = `$${inSum}`;
  labelSumOut.textContent = `$${Math.abs(outSum)}`;

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
  if (currAccount?.pin === Number(inputLoginPin.value)) {
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
  const amount = Number(inputTransferAmount.value);
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
  const loanAmount = Number(inputLoanAmount.value);
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
    currAccount.pin === Number(inputClosePin.value)
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
