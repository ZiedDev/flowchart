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
// OPERATORS ??? nuh uh :<

const operationPattern = Object.keys(operations).map(escapeRegExp).join('|');
const regexPattern = new RegExp(`([^=<>]+)\\s*(${operationPattern})\\s*([^=<>]+)`);

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

    console.log(content);
    // maybe add cool ass css on object

    if (type == 'condition') {
        Object.keys(conditions).forEach((condition) => {
            const regex = new RegExp(condition, 'g');
            content = content.replace(regex, conditions[condition]);
        });
        Object.keys(vars).forEach((variable) => {
            const regex = new RegExp(variable, 'g');
            content = content.replace(regex, vars[variable]);
        });

        let truthy = eval(content);
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
                vars[leftOperand] = parseFloat(operations[operation](eval(leftrep.replace(/./g, '0')), eval(rightrep)));
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