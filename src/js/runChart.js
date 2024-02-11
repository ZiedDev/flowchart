const conditions = {
    '<>': '!=',
    'AND': '&&',
    'OR': '||',
    'NOT': '!',
    '>=': '>=',
    '<=': '<=',
    '>': '>',
    '<': '<',
    '=': '==',
};
const operations = {
    '<-': (x, y) => { return y },
    '<=': (x, y) => { return y },
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
const allowedFunctions = {
    abs: Math.abs, acos: Math.acos, asin: Math.asin, atan: Math.atan,
    atan2: Math.atan2, ceil: Math.ceil, cos: Math.cos, exp: Math.exp,
    floor: Math.floor, log: Math.log, max: Math.max, min: Math.min,
    pow: Math.pow, random: Math.random, round: Math.round, sin: Math.sin,
    sqrt: Math.sqrt, tan: Math.tan, DIV, MOD, INT,
};
const timeout = 1000;
// Globals

const operationPattern = Object.keys(operations).map(escapeRegExp).join('|');
const regexPattern = new RegExp(`([^=<>]+)\\s*(${operationPattern})\\s*([^=<>]+)`);


function safeEval(expression) {
    const regex1 = /[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*/g;
    expression = expression.replace(regex1, (match, offset, input) => {
        const nextChar = input.charAt(offset + match.length);
        return nextChar !== '(' ? '0' : match;
    });

    const safeEvalFunction = new Function('Math', 'DIV', 'MOD', 'INT', 'return ' + expression);

    try {
        const result = safeEvalFunction(allowedFunctions, DIV, MOD, INT);
        return result;
    } catch (error) {
        return null;
    }
}
function isQuotedString(str) {
    return str.length > 1 && (str[0] === str[str.length - 1]) && (str[0] === '"' || str[0] === "'");
}
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
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
    if (id == -1 || id == undefined) {
        document.querySelectorAll('.block-container').forEach(e => {e.childNodes[1].classList.remove('outline');})
        onChartFinish();
        alert('Invalid Flowchart');
        return;
    }
    let type = chart['nodes'][id]['type'];
    let content = chart['nodes'][id]['content'].trim();
    let connection = chart['wires'][id];

    console.log(content + ' |', 'variables: ', JSON.parse(JSON.stringify(vars)));
    onNodeStart(id);

    if (type == 'decision') {
        let condarr = Object.keys(conditions);
        for (let i = 0; i < condarr.length; i++) {
            content = content.replace(condarr[i], '卐' + i);
        }
        for (let i = 0; i < condarr.length; i++) {
            content = content.replace('卐' + i, conditions[condarr[i]]);
        }

        Object.keys(vars).forEach((variable) => {
            const regex = new RegExp(variable, 'g');
            content = content.replace(regex, vars[variable]);
        });

        let truthy = safeEval(content);

        if (truthy) {
            setTimeout(() => { runNode(chart, connection[0], vars); onNodeEnd(id); }, timeout);
        } else {
            setTimeout(() => { runNode(chart, connection[1], vars); onNodeEnd(id); }, timeout);
        }
    } else if (type != 'terminal') {
        if (type == 'process') {
            content = content.replace(/,(?![^()]*\))/g, ';')
            content.split(';').forEach((line) => {
                line = line.trim();
                const match = line.match(regexPattern);
                if (match) {
                    const [, leftOperand, operation, rightOperand] = match.map(e => e.trim());
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
                }
            })
        }
        if (type == 'inputOutput') {
            if (content.startsWith('input')) {
                let varNames = content.replace("input ", "").split(',');
                varNames = varNames.filter(e => e !== '');
                for (let i = 0; i < varNames.length; i++) {
                    varNames[i] = varNames[i].trim()
                    let inputValue = parseFloat(prompt("Enter value for " + varNames[i]));
                    vars[varNames[i]] = inputValue;
                }
            } else if (content.startsWith('output') || content.startsWith('print')) {
                content = content.replace(/,(?![^()]*\))/g, ';')
                let outputs = content.replace("output ", "").replace("print ", "").split(';');
                let evaluatedValues = [];

                for (let i = 0; i < outputs.length; i++) {
                    let varName = outputs[i].trim();
                    if (isQuotedString(varName)) {
                        varName = varName.substring(1, varName.length - 1);
                    } else {
                        Object.keys(vars).forEach((variable) => {
                            const regex = new RegExp(variable, 'g');
                            varName = varName.replace(regex, vars[variable]);
                        });
                        varName = safeEval(varName);
                    }
                    evaluatedValues.push(varName);
                }
                alert(evaluatedValues.join(' '));
            }
        }
        setTimeout(() => { runNode(chart, connection, vars); onNodeEnd(id); }, timeout);
    } else {
        if (content == 'start') {
            // START
            setTimeout(() => { runNode(chart, connection, vars); onNodeEnd(id); }, timeout);
        } else {
            // END
            setTimeout(() => { onNodeEnd(id); onChartFinish(); }, timeout);
        }
    }
}

export default runNode 