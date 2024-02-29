window.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    const numberBtns = Array.from(document.querySelectorAll(".number-btn"));
    const operatorBtns = Array.from(document.querySelectorAll(".operator-btn"));
    const specialBtns = Array.from(document.querySelectorAll(".special-btn"));
    const output = document.querySelector(".output");
    const expressionText = document.querySelector(".expression");
    const equalBtn = document.querySelector(".equal-btn");
    const clearBtn = document.querySelector(".clear-btn");
    const deleteBtn = document.querySelector(".delete-btn");
    const decimalBtn = document.querySelector(".decimal-btn");

    const themeToggleBtn = document.querySelector(".theme-toggle");
    let firstNumber = "";
    let secondNumber = "";
    let operator = "";
    let expression = "";
    let isSecondNumber = false;
    function updateExpressionDisplay(text) {
        expressionText.textContent = text;
    }

    function updateOutputScreen(text) {
        output.textContent = text;
    }

    function format(text) {
        let output = "";
        for (let i = 0; i < text.length; i++) {
            if (text[i] === "+" || text[i] === "-" || text[i] === "x" || text[i] === "/" || text[i] === "%") output += " ";
            output += text[i];
            if (text[i] === "+" || text[i] === "-" || text[i] === "x" || text[i] === "/" || text[i] === "%") output += " ";
        }
        return output;
    }

    function updateExpression(text) {
        expression = format(text);
        updateExpressionDisplay(expression);
    }

    function debug() {
        console.log("First Number: " + firstNumber);
        console.log("Second Number: " + secondNumber);
        console.log("Operator " + operator);
    }

    function reset() {
        firstNumber = "";
        secondNumber = "";
        operator = "";
        isSecondNumber = false;
        updateExpression("");
        updateOutputScreen(0);
    }

    function removeLastChar(text) {
        return text.substring(0, text.length - 1);
    }


    function evaluate() {
        let output = 0;
        if (firstNumber === "") return 0;
        if (secondNumber === "") return firstNumber;
        switch (operator) {
            case "": output = "";
                break;
            case "+": output = String(Number(firstNumber) + Number(secondNumber));
                break;
            case "x": output = String(Number(firstNumber) * Number(secondNumber));
                break;
            case "-": output = String(Number(firstNumber) - Number(secondNumber));
                break;
            case "/": output = String(Number(firstNumber) / Number(secondNumber));
                break;
            case "%": output = String(Number(firstNumber) * Number(secondNumber) / 100);
                break;
        }
        // Checking for decimal values
        const roundingFactor = 10000;
        output = Math.round((Number(output) + Number.EPSILON) * roundingFactor) / roundingFactor;
        return String(output);
    }

    function updateResult() {
        firstNumber = evaluate();
        updateExpression(firstNumber.toString());
        updateOutputScreen(firstNumber);
    }

    themeToggleBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        if (body.classList.contains("light-mode")) themeToggleBtn.children[0].src = "assets/images/moon.png";
        else themeToggleBtn.children[0].src = "assets/images/sun.png";
    })

    for (btn of numberBtns) {
        btn.addEventListener("click", (event) => {
            updateExpression(expression + event.target.textContent);
            if (!isSecondNumber) firstNumber += event.target.textContent;
            else secondNumber += event.target.textContent;
            debug();
        })
    }

    for (btn of operatorBtns) {
        btn.addEventListener("click", (event) => {
            if (operator === "" && isSecondNumber === false) {
                updateExpression(expression + event.target.textContent);
                operator = event.target.textContent;
            }
            else {
                operator = event.target.textContent;
                updateResult();
                secondNumber = "";
                updateExpression(firstNumber + event.target.textContent);
                updateOutputScreen(firstNumber);
            }
            isSecondNumber = true;
            debug();
        })
    }

    clearBtn.addEventListener("click", reset)

    deleteBtn.addEventListener("click", () => {
        if (expression.length > 0) {
            if (isSecondNumber) {
                if (secondNumber.length > 0) {
                    secondNumber = removeLastChar(secondNumber);
                }
                else {
                    isSecondNumber = false;
                    operator = "";
                }
            }
            else {
                firstNumber = removeLastChar(firstNumber);
            }
            updateExpression(removeLastChar(expression));
        }
    })

    specialBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (btn.textContent === "00") {
                updateExpression(expression + btn.textContent);
                if (!isSecondNumber) firstNumber += btn.textContent;
                else secondNumber += btn.textContent;
            }
            else if (btn.textContent === ".") {
                if (!isSecondNumber && !firstNumber.includes(".")) {
                    firstNumber += btn.textContent;
                    updateExpression(expression + btn.textContent);
                }
                else if (!secondNumber.includes(".")) {
                    secondNumber += btn.textContent;
                    updateExpression(expression + btn.textContent);
                }
            }
        })
    })

    equalBtn.addEventListener("click", () => {
        updateResult();
        operator = "";
        secondNumber = "";
        isSecondNumber = false;
    })
})