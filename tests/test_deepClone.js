/* Test cases for functions used in invitePartner.js */

const chai = require("chai");
const expect = chai.expect;

const deepClone = require('../deepClone');
const CustomError = require('../CustomError');

/* Test cases for deepClone */
describe("Unit tests for deepClone", function () {
    it("returns null for null input", function () {
        expect(deepClone(null))
            .to
            .equal(null);
    });
    it("returns undefined for undefined input", function () {
        expect(deepClone(undefined))
            .to
            .equal(undefined);
    });
    it("returns copy of primitive data types", function () {
        expect(deepClone(2))
            .to
            .equal(2);
        expect(deepClone("s"))
            .to
            .equal("s");
        expect(deepClone(true))
            .to
            .equal(true);
    });
    it("deeply clones array of numbers", function () {
        const source = [1, 2, 3, 4];
        const copy = source;
        const target = deepClone(source);
        /* make change to source array */
        source.push(89)
        expect(source)
            .to
            .not
            .equal(target);
        expect(copy)
            .to
            .equal(source);
    });

    it("deeply clones array of objects", function () {
        const source = [
            {
                a: 1
            }, {
                b: 2
            }, {
                c: 3
            }, {
                d: 4
            }
        ];
        const copy = source;
        const target = deepClone(source);
        /* make change to source array */
        source[0].a = 78
        expect(source)
            .to
            .not
            .equal(target);
        expect(copy)
            .to
            .equal(source);
    });
    it("deeply copies array of objects", function () {
        const source = [
            {
                a: 1
            }, {
                b: 2
            }, {
                c: 3
            }, {
                d: 4
            }
        ];
        const copy = source;
        const target = deepClone(source);
        /* make change to source array */
        source[0].a = 78
        expect(source)
            .to
            .not
            .equal(target);
        expect(copy)
            .to
            .equal(source);
    });
    it("deeply clones data object", function () {
        const source = new Date(2018, 11, 24, 10, 33, 30, 0);
        const copy = source;
        const target = deepClone(source);
        /* make changes to date object */
        source.setFullYear(2099);
        expect(source)
            .to
            .not
            .equal(target);
        expect(copy)
            .to
            .equal(source);
    });
    it("deeply clones Error object", function () {
        const source = new Error("hello");
        const copy = source;
        const target = deepClone(source);
        /* make changes to date object */
        source.lineNumber = 9999;
        expect(source)
            .to
            .not
            .equal(target);
        expect(copy)
            .to
            .equal(source);
    });

    it("deeply clones nested object", function () {
        const source = {
            a: 1,
            b: 2,
            c: [
                {
                    e: 3,
                    g: 78,
                    l: [1, 2, 3]
                }
            ]
        };
        const copy = source;
        const target = deepClone(source);
        /* make changes to date object */
        source.c[0].g = 9999;
        expect(source)
            .to
            .not
            .equal(target);
        expect(copy)
            .to
            .equal(source);
    });
    it("deeply clones regex object", function () {
        const source = new RegExp("foo", "g");
        const str1 = 'table football, foosball';
        const copy = source;
        const target = deepClone(source);

        /* make changes to date object */
        source.test(str1);
        source.lastIndex = 6;
        expect(source)
            .to
            .not
            .equal(target);
        expect(copy)
            .to
            .equal(source);
    });

});
