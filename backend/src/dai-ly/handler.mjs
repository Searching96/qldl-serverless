// src/dai-ly/handler.js

import DaiLyService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';

const daiLyService = new DaiLyService();

export const exequery = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        // Handle both JSON and plain text body
        let queryString;
        try {
            const parsed = JSON.parse(event.body);
            queryString = parsed.queryString || parsed.query;
        } catch {
            // If JSON parse fails, treat as plain SQL string
            queryString = event.body;
        }
        
        if (!queryString) {
            return handleLambdaError(new Error('Query string is required.'), 'Query execution');
        }

        const result = await daiLyService.executeQuery(queryString);
        return handleLambdaSuccess({ 
            message: 'Query executed successfully.', 
            result: result 
        });
    } catch (error) {
        return handleLambdaError(error, 'Query execution');
    }
};

export const exeinsert = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        // Handle both JSON and plain text body
        let insertString;
        try {
            const parsed = JSON.parse(event.body);
            insertString = parsed.insertString || parsed.insert || parsed.query;
        } catch {
            // If JSON parse fails, treat as plain SQL string
            insertString = event.body;
        }
        
        if (!insertString) {
            return handleLambdaError(new Error('Insert string is required.'), 'Insert execution');
        }

        const result = await daiLyService.executeInsert(insertString);
        return handleLambdaSuccess({ 
            message: 'Insert executed successfully.', 
            rowCount: result.rowCount,
            data: result.rows 
        }, 201);
    } catch (error) {
        return handleLambdaError(error, 'Insert execution');
    }
};

export const createdl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const {madaily, tendaily, diachi, sodienthoai, email, maquan, maloaidaily, ngaytiepnhan } = JSON.parse(event.body);
        
        // Call createDaiLy once with all parameters (including optional madaily)
        const resultMadaily = await daiLyService.createDaiLy({
            madaily, 
            tendaily, 
            diachi, 
            sodienthoai, 
            email, 
            maquan, 
            maloaidaily, 
            ngaytiepnhan 
        });
        
        return handleLambdaSuccess({ 
            message: 'Đã tạo đại lý thành công.', 
            madaily: resultMadaily 
        }, 201);
    } catch (error) {
        return handleLambdaError(error, 'Tạo đại lý');
    }
};

export const getalldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const DaiLy = await daiLyService.getAllDaiLy();
        if (!DaiLy || DaiLy.length === 0) {
            return handleLambdaError(new Error('Không tìm thấy đại lý nào.'), 'Tra cứu đại lý');
        }
        return handleLambdaSuccess(DaiLy);
    } catch (error) {
        return handleLambdaError(error, 'Tra cứu đại lý');
    }
};

export const getdlbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maDaiLy } = event.pathParameters; // Changed from madaily to maDaiLy to match API Gateway
        const DaiLy = await daiLyService.getDaiLy(maDaiLy);
        if (!DaiLy) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                                body: JSON.stringify({ message: 'Không tìm thấy đại lý.' }),
                }
}
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify(DaiLy),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const updatedl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maDaiLy } = event.pathParameters; // Changed from madaily to maDaiLy
        const { tendaily, diachi, sodienthoai, email, maquan, maloaidaily, ngaytiepnhan } = JSON.parse(event.body);
        await daiLyService.updateDaiLy(maDaiLy, { tendaily, diachi, sodienthoai, email, maquan, maloaidaily, ngaytiepnhan });
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify({ message: 'Cập nhật đại lý thành công.' }),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
};

export const deletedl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maDaiLy } = event.pathParameters; // Changed from madaily to maDaiLy to match API Gateway
        await daiLyService.deleteDaiLy(maDaiLy);
        return handleLambdaSuccess({ message: 'Xóa đại lý thành công.' });
    } catch (error) {
        return handleLambdaError(error, 'Xóa đại lý');
    }
};

export const searchdl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const searchParams = event.queryStringParameters || {};
        const results = await daiLyService.searchDaiLy(searchParams);

        if (!results || results.length === 0) {
            return {
                statusCode: HTTP_STATUS.OK,
                                body: JSON.stringify({ message: 'Không tìm thấy đại lý nào phù hợp với tiêu chí tìm kiếm.', data: [] }),
                }
}

        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify(results),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
};

export const getmrr = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { month, year } = JSON.parse(event.body);
        
        if (!month || !year) {
            return {
                statusCode: HTTP_STATUS.BAD_REQUEST,
                                body: JSON.stringify({ message: 'Thiếu tham số month và year.' }),
                }
}

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (monthNum < 1 || monthNum > 12) {
            return {
                statusCode: HTTP_STATUS.BAD_REQUEST,
                                body: JSON.stringify({ message: 'Tháng phải từ 1 đến 12.' }),
                }
}

        if (yearNum < 1900 || yearNum > 2100) {
            return {
                statusCode: HTTP_STATUS.BAD_REQUEST,
                                body: JSON.stringify({ message: 'Năm không hợp lệ.' }),
                }
}

        const report = await daiLyService.getMonthlyRevenueReport(monthNum, yearNum);
        
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify(report),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
};