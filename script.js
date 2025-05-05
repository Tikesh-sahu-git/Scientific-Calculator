class ScientificCalculator {
            constructor(previousOperandTextElement, currentOperandTextElement) {
                this.previousOperandTextElement = previousOperandTextElement;
                this.currentOperandTextElement = currentOperandTextElement;
                this.clear();
            }

            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.resetScientific();
            }

            delete() {
                this.currentOperand = this.currentOperand.toString().slice(0, -1);
                if (this.currentOperand === '') {
                    this.currentOperand = '0';
                }
            }

            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number.toString();
                } else {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
            }

            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
            }

            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;

                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        computation = prev / current;
                        break;
                    default:
                        return;
                }

                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
            }

            applyFunction(func) {
                const current = parseFloat(this.currentOperand);
                if (isNaN(current) && func !== 'π' && func !== 'e') return;

                switch (func) {
                    case 'sin':
                        this.currentOperand = Math.sin(current * Math.PI / 180).toString();
                        break;
                    case 'cos':
                        this.currentOperand = Math.cos(current * Math.PI / 180).toString();
                        break;
                    case 'tan':
                        this.currentOperand = Math.tan(current * Math.PI / 180).toString();
                        break;
                    case 'log':
                        this.currentOperand = Math.log10(current).toString();
                        break;
                    case 'ln':
                        this.currentOperand = Math.log(current).toString();
                        break;
                    case '√':
                        this.currentOperand = Math.sqrt(current).toString();
                        break;
                    case 'x²':
                        this.currentOperand = Math.pow(current, 2).toString();
                        break;
                    case 'x³':
                        this.currentOperand = Math.pow(current, 3).toString();
                        break;
                    case 'x^y':
                        this.operation = '^';
                        this.previousOperand = this.currentOperand;
                        this.currentOperand = '';
                        break;
                    case 'π':
                        this.currentOperand = Math.PI.toString();
                        break;
                    case 'e':
                        this.currentOperand = Math.E.toString();
                        break;
                    case '(':
                        this.currentOperand += '(';
                        break;
                    case ')':
                        this.currentOperand += ')';
                        break;
                }
            }

            computeScientific() {
                if (this.operation === '^') {
                    const prev = parseFloat(this.previousOperand);
                    const current = parseFloat(this.currentOperand);
                    if (isNaN(prev) || isNaN(current)) return;
                    
                    this.currentOperand = Math.pow(prev, current).toString();
                    this.operation = undefined;
                    this.previousOperand = '';
                }
            }

            resetScientific() {
                this.operation = undefined;
            }

            updateDisplay() {
                this.currentOperandTextElement.innerText = this.currentOperand;
                if (this.operation != null) {
                    this.previousOperandTextElement.innerText = 
                        `${this.previousOperand} ${this.operation}`;
                } else {
                    this.previousOperandTextElement.innerText = '';
                }
            }
        }

        // Initialize calculator
        const numberButtons = document.querySelectorAll('[data-number]');
        const operationButtons = document.querySelectorAll('.operation');
        const functionButtons = document.querySelectorAll('.function');
        const constButtons = document.querySelectorAll('.const');
        const equalsButton = document.querySelector('.equals');
        const deleteButton = document.querySelector('.delete');
        const allClearButton = document.querySelector('.clear');
        const previousOperandTextElement = document.querySelector('.previous-operand');
        const currentOperandTextElement = document.querySelector('.current-operand');

        const calculator = new ScientificCalculator(previousOperandTextElement, currentOperandTextElement);

        // Add click animation to all buttons
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.add('button-pop');
                setTimeout(() => {
                    button.classList.remove('button-pop');
                }, 300);
            });
        });

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.innerText);
                calculator.updateDisplay();
            });
        });

        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.innerText);
                calculator.updateDisplay();
            });
        });

        functionButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.applyFunction(button.innerText);
                calculator.updateDisplay();
            });
        });

        constButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.applyFunction(button.innerText);
                calculator.updateDisplay();
            });
        });

        equalsButton.addEventListener('click', () => {
            calculator.compute();
            calculator.computeScientific();
            calculator.updateDisplay();
        });

        allClearButton.addEventListener('click', () => {
            calculator.clear();
            calculator.updateDisplay();
        });

        deleteButton.addEventListener('click', () => {
            calculator.delete();
            calculator.updateDisplay();
        });

        // Handle keyboard input
        document.addEventListener('keydown', (event) => {
            if (event.key >= 0 && event.key <= 9) {
                const button = document.querySelector(`button[data-number]:contains('${event.key}')`);
                if (button) {
                    button.click();
                    button.classList.add('button-pop');
                    setTimeout(() => button.classList.remove('button-pop'), 300);
                }
            } else if (event.key === '.') {
                const button = document.querySelector(`button[data-number]:contains('.')`);
                if (button) {
                    button.click();
                    button.classList.add('button-pop');
                    setTimeout(() => button.classList.remove('button-pop'), 300);
                }
            } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                const operation = event.key === '*' ? '×' : event.key === '/' ? '÷' : event.key;
                const button = Array.from(document.querySelectorAll('.operation')).find(btn => btn.innerText === operation);
                if (button) {
                    button.click();
                    button.classList.add('button-pop');
                    setTimeout(() => button.classList.remove('button-pop'), 300);
                }
            } else if (event.key === 'Enter' || event.key === '=') {
                equalsButton.click();
                equalsButton.classList.add('button-pop');
                setTimeout(() => equalsButton.classList.remove('button-pop'), 300);
            } else if (event.key === 'Backspace') {
                deleteButton.click();
                deleteButton.classList.add('button-pop');
                setTimeout(() => deleteButton.classList.remove('button-pop'), 300);
            } else if (event.key === 'Escape') {
                allClearButton.click();
                allClearButton.classList.add('button-pop');
                setTimeout(() => allClearButton.classList.remove('button-pop'), 300);
            }
        });