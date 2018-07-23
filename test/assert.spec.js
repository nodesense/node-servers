const assert = require("assert");

function add(num1, num2) {
    if (!num1 || !num2) {
        throw new Error("Invalid input")
    }

    return num1 + num2;
}

assert(add(1,2), 3);

assert.throws( ()=> {
    add(5)
})


assert.throws( ()=> {
    add()
})

assert.doesNotThrow( () => {
    add(1, 2)
})