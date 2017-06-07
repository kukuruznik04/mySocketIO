//ERROR///////////
let ErrorMessage = module.exports.ErrorMessage = function (code, title, error) {
	this.level = "ERROR";
	this.code = code;
	this.title = title;
	this.stacktrace = error ? (error.stack ? error.stack : error ) : null;
};
//static codes/title
ErrorMessage.ERROR_MONGO_CONNECTION = Object.freeze({code: "ERROR_MONGO_CONNECTION"});
ErrorMessage.WRONG_FORMAT = Object.freeze({code: "WRONG_FORMAT"});
ErrorMessage.ERROR_UNEXPECTED = Object.freeze({code: "ERROR_UNEXPECTED",title: "An unexpected error occurred. Please check stacktrace for more info."});
ErrorMessage.TOKEN_ISSUER_NOT_FOUND = Object.freeze({code: "TOKEN_ISSUER_NOT_FOUND"});
ErrorMessage.SECURITY_HACK = Object.freeze({code: "SECURITY_HACK"});
ErrorMessage.OBJECT_NOT_FOUND = Object.freeze({code: "OBJECT_NOT_FOUND"});
ErrorMessage.OBJECT_LOCKED = Object.freeze({code: "OBJECT_LOCKED"});
ErrorMessage.USER_NOTALLOWED = Object.freeze({code: "USER_NOTALLOWED"});
ErrorMessage.VALIDATION_FAILED = Object.freeze({code: "VALIDATION_FAILED"});
ErrorMessage.MISSING_PARAMETERS = Object.freeze({code: "MISSING_PARAMETERS"});
ErrorMessage.INVALID_REQUEST_PARAMETER = Object.freeze({code: "INVALID_REQUEST_PARAMETER"});
ErrorMessage.UNSUPPORTED_PATCH_ATTRIBUTE = Object.freeze({code: "UNSUPPORTED_PATCH_ATTRIBUTE"});
ErrorMessage.TIMEOUT = Object.freeze({code: "TIMEOUT"});



/////////////////
//WARNING////////

let WarningMessage = module.exports.WarningMessage = function (code, title, error) {
	this.level = "WARN";
	this.code = code;
	this.title = title;
	this.stacktrace = error ? (error.stack ? error.stack : error ) : null;
};
//static codes/title

/////////////////
//INFO///////////

let InfoMessage = module.exports.InfoMessage = function (code, title, error) {
	this.level = "INFO";
	this.code = code;
	this.title = title;
	this.stacktrace = error ? (error.stack ? error.stack : error ) : null;
};
//static codes/title

/**
 *
 */

let StatusMessage = module.exports.StatusMessage = function (code, description) {
	this.code = code;
	this.description = description;
};
//static codes/title
StatusMessage.SUCCESS = Object.freeze({code: 0, description: "success"});
StatusMessage.NOT_FOUND = Object.freeze({code: 1, description: "not found"});
StatusMessage.DUPLICATE = Object.freeze({code: 2, description: "duplicate"});
StatusMessage.VALIDATION_FAILED = Object.freeze({code: 3, description: "validation"});
StatusMessage.UNSUPPORTED_PATCH_ATTRIBUTE = Object.freeze({code: 4, description: "unsupported patch attribute"});


let ApiInfo = module.exports.ApiInfo = function (name, description) {
	this.name = name;
	this.description = description;
};
//static codes/title
//Example route
// ApiInfo.FIND_CENTER = Object.freeze({name: "find center", description: "find a center"});