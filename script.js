let numberButtons = document.querySelectorAll(".number-btn");
let operatorButtons = document.querySelectorAll(".operator-btn");
let equalsBtn = document.querySelector(".equals-btn");
let clearBtn = document.querySelector(".clear-btn");
let deleteBtn = document.querySelector(".delete-btn");
let previousOperand = document.querySelector(".previous-operand");
let currentOperand = document.querySelector(".current-operand");

let firstNumber = null;
let operator = null;
let currentInput = "0";

function updateDisplay() {
  currentOperand.textContent = currentInput;
  if (operator !== null && operator !== "=" && operator !== "ERROR") {
    previousOperand.textContent = `${firstNumber} ${operator}`;
  } else {
    previousOperand.textContent = "";
  }
}

function appendNumber(number) {
  if (operator === "=" || operator === "ERROR") {
    firstNumber = null;
    operator = null;
    currentInput = number === "." ? "0." : number;
    updateDisplay();
    return;
  }
  if (number === "." && currentInput.includes(".")) {
    return;
  } else if (currentInput === "0" && number !== ".") {
    currentInput = number;
  } else {
    currentInput += number;
  }
  updateDisplay();
}

function chooseOperator(selectedOperator) {
  if (operator === "ERROR") {
    return;
  }
  if (operator === "=") {
    firstNumber = Number(currentInput);
    operator = selectedOperator;
    currentInput = "";
    updateDisplay();
    return;
  }
  if (currentInput === "" && operator !== null) {
    operator = selectedOperator;
    updateDisplay();
    return;
  }
  if (firstNumber !== null && operator !== null) {
    let success = calculate();

    if (!success) {
      return;
    }
  } else {
    firstNumber = Number(currentInput);
  }
  operator = selectedOperator;
  currentInput = "";
  updateDisplay();
}

function calculate() {
  if (firstNumber === null || operator === null || currentInput === "") {
    return false;
  }
  let secondNumber = Number(currentInput);
  let result;

  if (operator === "+") {
    result = firstNumber + secondNumber;
  } else if (operator === "-") {
    result = firstNumber - secondNumber;
  } else if (operator === "*") {
    result = firstNumber * secondNumber;
  } else if (operator === "/") {
    if (secondNumber === 0) {
      currentInput = "Can't divide by 0";
      operator = "ERROR";
      updateDisplay();
      return false;
    }
    result = firstNumber / secondNumber;
  }

  currentInput = String(Number(result.toFixed(10)));
  firstNumber = Number(currentInput);
  updateDisplay();
  return true;
}

function showResult() {
  if (operator === null || operator === "=" || operator === "ERROR") {
    return;
  }
  let success = calculate();
  if (success) {
    operator = "=";
    updateDisplay();
  }
}

function clearCalculator() {
  firstNumber = null;
  operator = null;
  currentInput = "0";
  updateDisplay();
}

function deleteNumber() {
  if (operator === "=" || operator === "ERROR") {
    firstNumber = null;
    operator = null;
    currentInput = "0";
  } else if (currentInput !== "") {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

numberButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    appendNumber(button.dataset.number);
  });
});

operatorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    chooseOperator(button.dataset.operator);
  });
});

equalsBtn.addEventListener("click", showResult);
clearBtn.addEventListener("click", clearCalculator);
deleteBtn.addEventListener("click", deleteNumber);

document.addEventListener("keydown", function (event) {
  if (event.key >= "0" && event.key <= "9") {
    appendNumber(event.key);
  }
  if (event.key === ".") {
    appendNumber(".");
  }
  if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  }
  if (event.key === "Enter" || event.key === "=") {
    showResult();
  }
  if (event.key === "Backspace") {
    deleteNumber();
  }
});
