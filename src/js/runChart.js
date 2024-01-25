const conditions = {
    '=': '==',
    '<>': '!=',
    '>': '>',
    '>=': '>=',
    '<': '<',
    '<=': '<=',
    ' AND ': '&&',
    ' OR ': '||',
};
const operations = {
    '<-': (x, y) => { return y },
    '+=': (x, y) => { return x + y },
    '-=': (x, y) => { return x - y },
    '*=': (x, y) => { return x * y },
    '/=': (x, y) => { return x / y },
    '%=': (x, y) => { return x % y },
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
    'DIV', 'MOD', 'INT'
];
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

// ASSUME start is at id 0 ----> runNode(chart_json, "0") to start the run
function runNode(chart, id, vars = {}) {
    let type = chart['nodes'][id]['type'];
    let content = chart['nodes'][id]['content'];
    let connection = chart['wires'][id];

    // OBJECT CSS
    console.log(content, vars);

    if (type == 'condition') {
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
            runNode(chart, connection[0], vars);
        } else {
            runNode(chart, connection[1], vars);
        }
    } else if (type != 'end') {
        if (type == 'start') {
            // START
        }
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
        if (type == 'input') {
            let varNames = content.replace("input ", "").split(',');
            for (let i = 0; i < varNames.length; i++) {
                let inputValue = parseFloat(prompt("Enter value for " + varNames[i]));
                vars[varNames[i]] = inputValue;
            }
        }
        if (type == 'output') {
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
        runNode(chart, connection, vars);
    } else {
        // END
    }
}