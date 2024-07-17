// utils/wrapAsync.js

// A utility function to wrap async functions and handle errors
const wrapAsync = (fn) => {
    return function(req, res, next) {
        // Make sure to execute the function and catch any errors
        fn(req, res, next).catch(next);
    };
};

module.exports = wrapAsync;
