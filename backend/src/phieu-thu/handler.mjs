import PhieuThuService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';
import { HTTP_STATUS } from '../shared/constants.mjs';

const phieuThuService = new PhieuThuService();

export const creatept = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { madaily, ngaythutien, sotienthu } = JSON.parse(event.body);
        const maphieuthu = await phieuThuService.createPhieuThu({ madaily, ngaythutien, sotienthu });
        return {
            statusCode: HTTP_STATUS.CREATED,
            body: JSON.stringify({ message: 'Tạo phiếu thu thành công.' }),
        };
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const getallpt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const phieuThu = await phieuThuService.getAllPhieuThu();
        if (!phieuThu || phieuThu.length === 0) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu thu nào.' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(phieuThu),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const getptbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maPhieuThu } = event.pathParameters;
        const phieuThu = await phieuThuService.getPhieuThu(maPhieuThu);
        if (!phieuThu) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu thu.' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(phieuThu),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const updatept = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maPhieuThu } = event.pathParameters;
        const { madaily, ngaythutien, sotienthu } = JSON.parse(event.body);
        await phieuThuService.updatePhieuThu(maPhieuThu, { madaily, ngaythutien, sotienthu });
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Cập nhật phiếu thu thành công.' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const deletept = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maPhieuThu } = event.pathParameters;
        await phieuThuService.deletePhieuThu(maPhieuThu);
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Xóa phiếu thu thành công.' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const searchpt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const searchParams = event.queryStringParameters || {};
        const results = await phieuThuService.searchPhieuThu(searchParams);

        if (!results || results.length === 0) {
            return {
                statusCode: HTTP_STATUS.OK,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu thu nào phù hợp với tiêu chí tìm kiếm.', data: [] }),
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