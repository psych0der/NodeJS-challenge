const deepClone = require('./deepClone');
const CustomError = require('./CustomError');
/* Fetch invitees for meal party! */
const source = {
    a: [
        1, 2, 3, 4
    ],
    b: {
        c: 1,
        d: 2,
        e: new Date(),
        f: new RegExp('\\w+')
    }
}

const target = deepClone(source);
console.group("Set1")
console.log("source ==>", source)
console.log("target ==>", target);
console.groupEnd();

/* *************************************** */

const source1 = {
    name: "Paddy",
    address: {
        town: "Lerum",
        country: "Sweden"
    }
}
const target1 = deepClone(source1);
console.group("Set2");
console.log("source ==>", source1);
console.log("target ===>", target1);
console.groupEnd();