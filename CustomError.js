/**
 * Custom Error class to have a support for error code
 * @param{String} message Error message
 * @param{String} code error code
*/
module.exports = function CustomError(message, code) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code;
};