"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (res, error, message) => {
    console.error(`[error]: ${message}`, error);
    res.status(500).json({ message: "Internal server Error" });
};
exports.errorHandler = errorHandler;
