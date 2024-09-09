"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res
        .status(statusCode)
        .json({
        message,
        stack: err.stack,
    });
};
exports.default = errorHandler;