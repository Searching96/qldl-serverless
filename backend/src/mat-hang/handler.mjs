import MatHangService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';
import { HTTP_STATUS } from '../shared/constants.mjs';

const matHangService = new MatHangService();

export const createmh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { mamathang, tenmathang, donvitinh, giaban } = JSON.parse(event.body);
        const maMatHang = await matHangService.createMatHang({ mamathang, tenmathang, donvitinh, giaban });
        return {
            statusCode: HTTP_STATUS.CREATED,
            body: JSON.stringify({ message: 'Đã tạo mặt hàng thành công.', mamathang: maMatHang }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const getallmh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const matHang = await matHangService.getAllMatHang();
        if (!matHang || matHang.length === 0) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Không tìm thấy mặt hàng nào.' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(matHang),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const getmhbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maMatHang } = event.pathParameters;
        const matHang = await matHangService.getMatHang(maMatHang);
        if (!matHang) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Không tìm thấy mặt hàng.' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(matHang),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const updatemh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maMatHang } = event.pathParameters;
        const { tenmathang, donvitinh, giaban } = JSON.parse(event.body);
        await matHangService.updateMatHang(maMatHang, { tenmathang, donvitinh, giaban });
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Cập nhật mặt hàng thành công.' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const deletemh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maMatHang } = event.pathParameters;
        await matHangService.deleteMatHang(maMatHang);
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Xóa mặt hàng thành công.' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const searchmh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const searchParams = event.queryStringParameters || {};
        const results = await matHangService.searchMatHang(searchParams);

        if (!results || results.length === 0) {
            return {
                statusCode: HTTP_STATUS.OK,
                body: JSON.stringify({ message: 'Không tìm thấy mặt hàng nào phù hợp với tiêu chí tìm kiếm.', data: [] }),
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