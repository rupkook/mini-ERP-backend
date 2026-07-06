"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, message, data, pagination) => {
    const response = {
        success: statusCode < 400,
        message,
        ...(data !== undefined && { data }),
        ...(pagination && { pagination }),
    };
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=apiResponse.js.map