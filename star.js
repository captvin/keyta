function printA(rows) {
    let pattern = '';
    for (let i = 1; i <= rows; i++) {
        let str = '';
        for (let j = 1; j <= i; j++) {
            str += '* ';
        }
        pattern += str + '\n';
    }
    return pattern;
}

// Function to print pattern b
function printB(rows) {
    let pattern = '';
    for (let i = rows; i >= 1; i--) {
        let str = '';
        for (let j = 1; j <= i; j++) {
            str += '* ';
        }
        pattern += str + '\n';
    }
    return pattern;
}

// Function to print pattern c
function printC(rows) {
    let pattern = '';
    for (let i = 1; i <= rows; i++) {
        let str = '';
        for (let s = 1; s <= rows - i; s++) {
            str += '  ';
        }
        for (let j = 1; j <= i; j++) {
            str += '* ';
        }
        pattern += str + '\n';
    }
    return pattern;
}

// Function to print pattern d
function printD(rows) {
    let pattern = '';
    for (let i = 1; i <= rows; i++) {
        let str = '';
        for (let s = 1; s <= rows - i; s++) {
            str += ' ';
        }
        for (let j = 1; j <= i; j++) {
            str += '* ';
        }
        pattern += str.trimRight() + '\n';
    }
    return pattern;
}

function printAll(rows) {
    console.log("Pattern A:");
    console.log(printA(rows));

    console.log("Pattern B:");
    console.log(printB(rows));

    console.log("Pattern C:");
    console.log(printC(rows));

    console.log("Pattern D:");
    console.log(printD(rows));
}

module.exports = printAll