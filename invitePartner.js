/**
 * This program allows reading a list of partners and return a list of partners
 * within 100KM of central london (51.515419, -0.141099) and sort them in Ascending
 * order of company name.
 *
 * Distance b/w two geo coordinates if found using  Vincenty formula for an ellipsoid
 * with equal major and minor axes (https://en.wikipedia.org/wiki/Great-circle_distance?#Computational_formulas).
 *
 * For this formula mean earth radius is assumed to be 6371KM
 *
 * Since Earth is not an ideal sphere, calculator uses mean radius value according to WGS 84,
 * which can give 0.5% error, according to wikipedia.
*/

const CustomError = require('./CustomError');

const EARTH_RADIUS = 6371.0

/**
 * Utility function to validate latitude value
 * @param {Number} latitude latitude to be validated
 * @return {Boolean} result of validation
 */
const validateLatitude = (latitude) => {
    return typeof(latitude) === "number" && latitude >= -90.0 && latitude <= 90.0
}

/**
 * Utility function to validate latitude value
 * @param {Number} longitude longitude to be validated
 * @return {Boolean} result of validation
 */
const validateLongitude = (longitude) => {
    return typeof(longitude) === "number" && longitude >= -180.0 && longitude <= 180.0
}

/**
 * This function converts degree to radians. For this
 * module, geo coordinates need to be converted to Radians
 * to calculate distance between 2 coordinates
 * @param {Number} deg Degree to be converted to radians
 * @return {Number} Radian count
 */
const degreeToRadian = (deg) => {
    return (deg * Math.PI / 180.0);
}

/**
 *
 * @param {Object} locationA object containing latitude and longitude
 * @param {Object} locationB object containing latitude and longitude
 * @return {Number} Distance between locations in Kilometers
 */
const vincentyDistance = (locationA = {}, locationB = {}) => {
    if (typeof(locationA) !== "object" || typeof(locationB) !== "object") {
        throw new CustomError("Invalid type for location inputs", "ERR::LOC::INV");
    }
    const {latitude: latitudeA, longitude: longitudeA} = locationA;
    const {latitude: latitudeB, longitude: longitudeB} = locationB;

    /* Validate input */
    if (!(latitudeA && latitudeB && longitudeA && longitudeB)) {
        throw new CustomError("Incomplete location input provided", "ERR::LOC::INC");
    }

    if (!validateLatitude(latitudeA)) {
        throw new CustomError("Invalid latitude in locationA", "ERR::LAT::INV");
    }
    if (!validateLatitude(latitudeB)) {
        throw new CustomError("Invalid latitude in locationB", "ERR::LAT::INV");
    }

    if (!validateLongitude(longitudeA)) {
        throw new CustomError("Invalid longitude in locationA", "ERR::LON::INV");
    }
    if (!validateLongitude(longitudeB)) {
        throw new CustomError("Invalid longitude in locationB", "ERR::LON::INV");
    }

    /* Convert all coordinates to radians */
    const latA = degreeToRadian(latitudeA),
        lngA = degreeToRadian(longitudeA),
        latB = degreeToRadian(latitudeB),
        lngB = degreeToRadian(longitudeB);

    /* Difference between longitudes */
    const longDiff = Math.abs(lngA - lngB);

    /* Numerator for  Vincenty formula */
    const partA = Math.pow(Math.cos(latB) * Math.sin(longDiff), 2.0);
    const partB = Math.cos(latA) * Math.sin(latB);
    const partC = Math.sin(latA) * Math.cos(latB) * Math.cos(longDiff);
    const partD = Math.pow(partB - partC, 2.0);
    const numerator = Math.sqrt(partA + partD);

    /* Denominator for  Vincenty formula */
    const partE = Math.sin(latA) * Math.sin(latB);
    const partF = Math.cos(latA) * Math.cos(latB) * Math.cos(longDiff);
    const denominator = partE + partF;

    /* central angle formed by the locations at the center of the earth */
    const sigmaDiff = Math.atan2(numerator, denominator);

    return (EARTH_RADIUS * sigmaDiff);
}

/**
 * This function denormalizes company data for easy filtering.
 * It creates a separate entry for each office
 * @param {Array} companyData Array of objects
 * @param {Array} Array of offices with display information
 */
const deNormalizeData = (companyData) => {
    const officeData = [];
    companyData.forEach(company => {
        const offices = company.offices;
        if (!Array.isArray(offices)) {
            // we can't extract out office data for this company so continue to next object
            return;
        }
        offices.forEach(office => {
            const {address, coordinates} = office;
            if (typeof(coordinates) != 'string') {
                throw new CustomError("Invalid location data for office of <" + company.organization + ">", "ERR::LOC::OFF::INV");
            }
            const csplit = coordinates.split(",");

            if (csplit.length != 2) {
                throw new CustomError('Invalid format of coordinates for office of <' + company.organization + '>. Expected comma separated values', "ERR::LOC::OFF::INV");
            }

            let latitude = null,
                longitude = null;
            try {
                latitude = parseFloat(csplit[0]),
                longitude = parseFloat(csplit[1]);

            } catch (err) {
                throw new CustomError('Invalid format of coordinates for office of <' + company.organization + '>', "ERR::LOC::OFF::INV");
            }

            officeData.push({address, companyName: company.organization, latitude, longitude});
        });
    });
    return officeData;
}

/**
 * Given a list of file with array of objects containing
 * locations, this function will list out companies
 * that lie withing radius of `distance` KM
 * @param {String} fileLocation location of file containing data
 * @param {number} distance which will be used as radius to find companies
 * @param {Object} Coordinates of the location from where we want to calculate distances of various offices
        For this assignment this the central London. This can be overridden when calling the function
 */
const getInviteCandidates = (fileLocation, distance = 100, EPICENTER_COORDINATES = {
    latitude: 51.515419,
    longitude: -0.141099
}) => {
    /**
     * fileLocation should an absolute path or a relative but shouldn't be a localfile name
     * If a local file is provided it should be prefixed by ./
    */
    let data = [];
    try {
        data = require(fileLocation);
    } catch (err) {
        throw new CustomError('Unable to read input file : ' + err.message, "ERR::INP::INV");
    }

    if (!Array.isArray(data)) {
        throw new CustomError('Input file is in invalid format. Expected array of objects', "ERR::INP::INV");
    }

    /* Validate epicenter coordinates */
    try {
        if (!(validateLatitude(EPICENTER_COORDINATES.latitude) && validateLongitude(EPICENTER_COORDINATES.longitude))) {
            throw new CustomError('Invalid epicenter coordinates provided', "ERR::EPI::INV");
        }
    } catch (err) {
        throw new CustomError('Invalid epicenter object provided. Invalid type', "ERR::EPI::INV");
    }

    /* denormalize data to make it filter and sort friendly */
    const officeData = deNormalizeData(data);
    /* filter office data to extract offices less than 100km from central london */
    const filteredData = officeData.filter(office => {
        const {latitude, longitude} = office;
        /* We are filtering offices which have distance less than 1.05*distance because
            our calculator have margin of 0.5% error
        */
        return vincentyDistance(EPICENTER_COORDINATES, {latitude, longitude}) <= 1.05 * distance
    })

    /* sort office data by company name */
    filteredData.sort((officeA, officeB) => {
        return ('' + officeA.companyName).localeCompare(officeB.companyName);
    })

    /* Remove coordinates from final result */
    return filteredData;
}

module.exports.degreeToRadian = degreeToRadian;
module.exports.vincentyDistance = vincentyDistance;
module.exports.getInviteCandidates = getInviteCandidates;