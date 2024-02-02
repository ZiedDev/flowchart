const conditions = {
    '=': '==',
    '<>': '!=',
    '>': '>',
    '>=': '>=',
    '<': '<',
    '<=': '<=',
    'AND': '&&',
    'OR': '||',
    'NOT': '!',
};
const operations = {
    '<-': (x, y) => { return y },
    '+=': (x, y) => { return x + y },
    '-=': (x, y) => { return x - y },
    '*=': (x, y) => { return x * y },
    '/=': (x, y) => { return x / y },
    '%=': (x, y) => { return x % y },
    '**=': (x, y) => { return x ** y },
    '<<=': (x, y) => { return x << y },
    '>>=': (x, y) => { return x >> y },
    '>>>=': (x, y) => { return x >>> y },
    '&=': (x, y) => { return x & y },
    '^=': (x, y) => { return x ^ y },
    '|=': (x, y) => { return x | y },
};
function DIV(x, y) {
    return Math.floor(x / y)
}
function MOD(x, y) {
    return x % y
}
function INT(x) {
    return Math.floor(x)
}
const allowedFunctions = [
    'Math.abs', 'Math.acos', 'Math.asin', 'Math.atan', 'Math.atan2', 'Math.ceil',
    'Math.cos', 'Math.exp', 'Math.floor', 'Math.log', 'Math.max', 'Math.min',
    'Math.pow', 'Math.random', 'Math.round', 'Math.sin', 'Math.sqrt', 'Math.tan',
    'DIV', 'MOD', 'INT',
];
const timeout = 1000;
// Globals

const operationPattern = Object.keys(operations).map(escapeRegExp).join('|');
const regexPattern = new RegExp(`([^=<>]+)\\s*(${operationPattern})\\s*([^=<>]+)`);

function safeEval(expression) {
    const allowedFunctionNames = allowedFunctions.map(func => func.split('.')[1] || func);
    const sanitizedExpression = expression.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, (match, p1) => {
        if (!allowedFunctionNames.includes(p1)) {
            return 'function ' + p1 + '() { return 0; }(';
        }
        return match;
    });
    try {
        const result = Function('"use strict"; return (' + sanitizedExpression + ')')();
        return result;
    } catch (error) {
        console.error('Error evaluating expression:', error.message);
        return 0;
    }
}
function isQuotedString(str) {
    return str.length > 1 && (str[0] === str[str.length - 1]) && (str[0] === '"' || str[0] === "'");
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function onNodeStart(id) {
    document.getElementById('block-' + id).childNodes[1].classList.add('outline');
}
function onNodeEnd(id) {
    document.getElementById('block-' + id).childNodes[1].classList.remove('outline');
}

function onChartFinish() {
    document.getElementById('run-button').disabled = false
    document.getElementById('run-button').classList.remove('running-button')

    document.getElementById('play-icon').classList.remove('hide')
    document.getElementById('pause-icon').classList.add('hide')
}

// ASSUME start is at id 0 ----> runNode(chart_json, "0") to start the run
function runNode(chart, id, vars = {}) {
    let type = chart['nodes'][id]['type'];
    let content = chart['nodes'][id]['content'];
    let connection = chart['wires'][id];

    console.log(content + ',', 'variables: ', JSON.parse(JSON.stringify(vars)));
    onNodeStart(id);

    if (type == 'decision') {
        Object.keys(conditions).forEach((condition) => {
            const regex = new RegExp(condition, 'g');
            content = content.replace(regex, conditions[condition]);
        });
        Object.keys(vars).forEach((variable) => {
            const regex = new RegExp(variable, 'g');
            content = content.replace(regex, vars[variable]);
        });

        let truthy = safeEval(content);
        if (truthy) {
            setTimeout(() => { runNode(chart, connection[0], vars); onNodeEnd(id); }, timeout);
        } else {
            setTimeout(() => { runNode(chart, connection[1], vars); onNodeEnd(id); }, timeout)
        }
    } else if (type != 'terminal') {
        if (type == 'process') {
            content.split('\n').forEach((line) => {
                const [, leftOperand, operation, rightOperand] = line.match(regexPattern);
                let [leftrep, rightrep] = [leftOperand, rightOperand];
                Object.keys(vars).forEach((variable) => {
                    const regex = new RegExp(variable, 'g');
                    leftrep = leftrep.replace(regex, vars[variable]);
                    rightrep = rightrep.replace(regex, vars[variable]);
                });
                if (Object.keys(vars).includes(leftOperand)) {
                    vars[leftOperand] = operations[operation](safeEval(leftrep), safeEval(rightrep));
                } else {
                    vars[leftOperand] = operations[operation](0, safeEval(rightrep));
                }
            })
        }
        if (type == 'inputOutput') {
            if (content.startsWith('input')) {
                let varNames = content.replace("input ", "").split(',');
                for (let i = 0; i < varNames.length; i++) {
                    let inputValue = parseFloat(prompt("Enter value for " + varNames[i]));
                    vars[varNames[i]] = inputValue;
                }
            } else if (content.startsWith('output') || content.startsWith('print')) {
                let outputs = content.replace("output ", "").replace("print ", "").split(',');
                let evaluatedValues = [];

                for (let i = 0; i < outputs.length; i++) {
                    let varName = outputs[i].trim();
                    if (vars.hasOwnProperty(varName)) {
                        evaluatedValues.push(vars[varName]);
                    } else {
                        if (isQuotedString(varName)) {
                            varName = varName.substring(1, varName.length - 1);
                        }
                        evaluatedValues.push(varName);
                    }
                }
                alert(evaluatedValues.join(' '));
            }
        }
        setTimeout(() => { runNode(chart, connection, vars); onNodeEnd(id); }, timeout)
    } else {
        if (content == 'start') {
            // START
            setTimeout(() => { runNode(chart, connection, vars); onNodeEnd(id); }, timeout)
        } else {
            // END
            setTimeout(() => { onNodeEnd(id); onChartFinish(); }, timeout)
        }
    }
}

export { runNode }