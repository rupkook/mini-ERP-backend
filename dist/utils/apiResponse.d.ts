import { Response } from 'express';
interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare const sendResponse: <T>(res: Response, statusCode: number, message: string, data?: T, pagination?: ApiResponse["pagination"]) => void;
export {};
//# sourceMappingURL=apiResponse.d.ts.map