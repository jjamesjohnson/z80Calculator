//global values
let numsReg = /(?<!𝑥)(?<![A-Za-z0-9])([0-9])(?!\/|𝑥)/g;
let cursorPosition = 0
let currentOperator = null
let firstOperand = null
let secondOperand = null
let currentInput = null
let actionKey = null
let digitDisplay = 12

// calculation basics
function add(a,b) {
    c = parseFloat(a)
    d = parseFloat(b)
    return (c+d)
}

function subtract(a,b) {
    return (a-b)
}

function divide(a,b) { return (a/b)}

function multiply(a,b) {
    return (a*b)
}

// do the calculation
function operate(a,b,c) {
    if (b == "+") {return add(a,c)}
    if (b == "-") {return subtract(a,c)}
    if (b == "/") {
        if (c == "0") {
            return "not maths";
        } 
        else {return divide(a,c)}
    }
    if (b == "*") {return multiply(a,c)}
    else return "Err"
}

// reset cursor
function resetCursor() {
    cursorPosition = 0
}

// rounder - return back the digits display can accomodate based on digits left of decimal
function rounder(num) {
    if (Number.isInteger(num)) {
        return num
        setBase(1)
        }
    else {
    setBase("off")
    num = parseFloat(num);
    split = num.toString().split('.')
    digits = (digitDisplay - split[0].length)
    if (digits < 0 ) {digits = 1 }
    return num.toFixed(digits).replace(/0+$/, "");
    }
 }

 function setBase(flag) {
    var x = document.querySelector(".base");
    if (flag == 1) {
        x.style.display = "flex";
    }
    else {
      x.style.display = "none";
    }
  } 

//update display
function displayUpdate(content) {
    display = document.querySelector('.display-text')
    currentDisplay = display.textContent
    if (actionKey != null) {
        display.innerText= '';
        currentDisplay = display.innerText;
        actionKey = null;
    }
    if (content == "") {
        resetCursor();
        display.textContent = "0"
        currentInput = ""
        setBase(1)
        return
    } 
    if (content.toString().includes('e+')) {
        display.textContent = "upgrade req"
        return;
    }
    if (content.toString().includes('not maths')) {
        display.textContent = "not maths"
        return;
    }
    if (cursorPosition >= digitDisplay ) {
        toggleNotification ()
        return;
    }
    else if (cursorPosition > 0) {
    var num = currentDisplay + content;
    display.textContent = num;
    currentInput = display.textContent
    cursorPosition ++
    }
    else if (cursorPosition == 0 ) {
        display.textContent = content;
        currentInput = display.textContent
        cursorPosition ++
    }
    else {display.textContent = "eRR"}
}

// processBtn
function processBtn(value) {
    if (value == "AC") {
        displayUpdate("")
        return;
    }
    if (value == "=") { 
        setBase(1)
        secondOperand = currentInput 
        const calc = operate(firstOperand,currentOperator,secondOperand)
        displayUpdate("")
        displayUpdate(rounder(calc))
        actionKey = 1
        currentOperator = null
        firstOperand = null
        secondOperand = null
        resetCursor()
        return;
    }
    if (value == "+") {
        setBase(1)
        if (currentOperator != null) {
            secondOperand = currentInput
            const calc = operate(firstOperand,currentOperator,secondOperand)
            displayUpdate("")
            displayUpdate(rounder(calc))
            resetCursor()
        }
        currentOperator = "+"
        firstOperand = currentInput
        actionKey = 1
        resetCursor()
        return;
    }
    if (value == "—") {
        setBase(1)
        if (currentOperator != null) {
            secondOperand = currentInput
            const calc = operate(firstOperand,currentOperator,secondOperand)
            displayUpdate("")
            displayUpdate(rounder(calc))
            resetCursor()
        }
        currentOperator = "-"
        firstOperand = currentInput
        actionKey = 1
        resetCursor()
        return;
    }
    if (value == "÷") {
        setBase(1)
        if (currentOperator != null) {
            secondOperand = currentInput
            const calc = operate(firstOperand,currentOperator,secondOperand)
            displayUpdate("")
            displayUpdate(rounder(calc))
            resetCursor()
        }
        currentOperator = "/"
        firstOperand = currentInput
        actionKey = 1
        resetCursor()
        return;
    }
    if (value == "x") {
        setBase(1)
        if (currentOperator != null) {
            secondOperand = currentInput
            const calc = operate(firstOperand,currentOperator,secondOperand)
            displayUpdate(rounder(calc))
            resetCursor()
        }
        currentOperator = "*"
        firstOperand = currentInput
        actionKey = 1
        resetCursor()
        return;
    }
    if (value == "•") {
        display = document.querySelector('.display-text')
        if (!display.textContent.includes(".")) {
            addDot = display.textContent + "."
            displayUpdate("")
            setBase(0)
            displayUpdate(addDot)
            return;
        }
        else return;
    }
    if (value == "CE/C") {
        displayUpdate("")
        return;
    }
    if (value.match(numsReg)) {
        displayUpdate(value)
        return;
    }
    else {
        toggleNotification ()
    }
}

/* Handle Clicks from user */
function alertButton(e) {
    btn = `${this.value}`;
    node = this;
    node.classList.toggle('pressed')
    buttonValue = this.innerText
    processBtn(buttonValue)
   }
   
/* Handle Key press from user 
   function eventKey(e) {
    var keyed = document.querySelector(`[data-key="${e.keyCode}"`);
    keyed.classList.toggle('pressed');
  };*/

/* Remove the highlight effect after the transition completes*/
function removeTransition(e) {
    this.classList.remove('pressed');
  }

function toggleNotification () {
    notify = document.querySelector('.notificationBarBottom')
    notify.classList.add('showMe')
}

 /* Handle Key press from user 
     var play = keyed.querySelector('.play')
    hp = play.innerText.toLowerCase()
    keyed.classList.toggle('playing');
    let gr = gameRound(hp);
    returnWin(gr); 
 */
 function eventKey(e) {
     console.log(e)
     if (e.key.match(numsReg)) {
        processBtn(e.key)
        return;
     }
     if (e.key.match("Backspace") || e.key.match("Delete")) {
        processBtn("CE/C")
        return;
     }
     if (e.key.match("/")) {
        processBtn("÷")
        return;
     }
     if (e.key == "*") {
        processBtn("x")
        return;
     }
     if (e.key.match("-")) {
        return;
     }
     if (e.key == "+") {
        processBtn(e.key)
        return;
     }
     if (e.code.match("=") || e.code.match("Enter")) {
        processBtn("=")
        return;
     }
     if (e.code.match(".")) {
        processBtn("•")
        return;
     }
    var keyed = document.querySelector(`.key[data-key="${e.keyCode}"`);
    console.log(keyed)
  };

/* Register Listeners */
const buttons= document.querySelectorAll('[class*="button-"]')
buttons.forEach(button => button.addEventListener('click', alertButton));

document.addEventListener("keydown", eventKey);

const allkeys = document.querySelectorAll('[class*="button-"]')
allkeys.forEach(key => key.addEventListener('transitionend', removeTransition));

document.querySelector('.notificationBarBottom').addEventListener('click', function() {
    this.classList.toggle('showMe');
 })