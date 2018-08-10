/* Test cases for functions used in invitePartner.js */

const chai = require("chai");
const expect = chai.expect;

const {degreeToRadian, vincentyDistance, getInviteCandidates} = require('../invitePartner');
const CustomError = require('../CustomError');

/* Test cases for degreeToRadians */
describe("Unit tests for degreeToRadians", function () {
    it("converts 90 degree to radians correctly", function () {
        expect(degreeToRadian(90))
            .to
            .equal(Math.PI / 2);
    });
    it("converts 180 degree to radians correctly", function () {
        expect(degreeToRadian(180))
            .to
            .equal(Math.PI);
    });
    it("converts -145 degree to radians correctly", function () {
        expect(parseFloat(degreeToRadian(-145).toPrecision(3)))
            .to
            .equal(-2.53)
    });
});

/* Test cases for vincentyDistance */
describe("Unit tests for vincentyDistance", function () {
    it("Throws error for invalid input", function () {
        expect((() => vincentyDistance(1, 2)))
            .to
            .throw(CustomError())
            .with
            .property('code', 'ERR::LOC::INV')
    });

    it("Throws error for missing input", function () {
        expect(() => vincentyDistance({}))
            .to
            .throw(CustomError())
            .with
            .property('code', 'ERR::LOC::INC');
    });

    it("Throws error for invalid latitude", function () {
        expect(() => vincentyDistance({
            latitude: 360.1,
            longitude: 45.0
        }, {
                latitude: 450.1,
                longitude: -137.3
            }))
            .to
            .throw(CustomError())
            .with
            .property('code', 'ERR::LAT::INV')
    });

    it("Throws error for invalid longitude", function () {
        expect(() => vincentyDistance({
            latitude: 67.1,
            longitude: 45.0
        }, {
                latitude: 12.2,
                longitude: -537.3
            }))
            .to
            .throw(CustomError())
            .with
            .property('code', 'ERR::LON::INV');
    });

    it("Returns correct distance between New Delhi and Mumbai", function () {
        expect(parseInt(vincentyDistance({
            latitude: 28.644800,
            longitude: 77.216721
        }, {
                latitude: 19.228825,
                longitude: 72.854118
            })))
            .to
            .equal(1136)
    });
    it("Distance calculation is commutative between destinations (New Delhi and Mumbai)", function () {
        expect(parseInt(vincentyDistance({
            latitude: 19.228825,
            longitude: 72.854118
        }, {
                latitude: 28.644800,
                longitude: 77.216721
            })))
            .to
            .equal(1136)
    });
    it("Returns correct distance between New Delhi and London", function () {
        expect(parseInt(vincentyDistance({
            latitude: 51.509865,
            longitude: -0.118092
        }, {
                latitude: 28.644800,
                longitude: 77.216721
            })))
            .to
            .equal(6708)
    });

});

/* Test cases for degreeToRadians */
describe("Tests for getInviteCandidates", function () {
    it("Throws error on invalid input file location", function () {
        expect(() => getInviteCandidates('./invalid-location'))
            .to
            .throw(CustomError())
            .with
            .property('code', 'ERR::INP::INV');
    });
    it("Throws error on invalid input file data", function () {
        expect(() => getInviteCandidates('./garbage.txt'))
            .to
            .throw(CustomError())
            .with
            .property('code', 'ERR::INP::INV');
    });
    it("Throws error on invalid coordinate for office location", function () {
        expect(() => getInviteCandidates('./tests/partners-test-data-bad.json'))
            .to
            .throw(CustomError())
            .with
            .property('code', 'ERR::LOC::OFF::INV');
    });
    it("Returns correct office for distance specified", function () {
        const result = getInviteCandidates('./tests/partners-test-data.json');
        expect(result)
            .to
            .have
            .lengthOf(1);
        expect(result[0])
            .to
            .have
            .property('companyName', 'Spring Development');
    });

});