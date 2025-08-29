import QuanService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';
import { HTTP_STATUS } from '../shared/constants.mjs';

const quanService = new QuanService();

export const createquan = async (event) => {
    try {
        const { tenQuan } = JSON.parse(event.body);
        const maQuan = await quanService.createQuan(tenQuan);
        return handleLambdaSuccess({
            message: 'Đã tạo quận thành công.',
            maQuan
        }, 201);
    } catch (error) {
        return handleLambdaError(error, 'Tạo quận');
    }
};

export const getallquan = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const Quan = await quanService.getAllQuan();
        if (!Quan || Quan.length === 0) {
            return handleLambdaError(new Error('Không tìm thấy quận nào.'), 'Tra cứu quận');
        }
        return handleLambdaSuccess(Quan);
    } catch (error) {
        return handleLambdaError(error, 'Tra cứu quận');
    }
};

export const getquanbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maQuan } = event.pathParameters;
        const Quan = await quanService.getQuan(maQuan);
        if (!Quan) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Không tìm thấy quận.' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(Quan),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const updatequan = async (event) => {
    try {
        const { maQuan } = event.pathParameters;
        const { tenQuan } = JSON.parse(event.body);
        await quanService.updateQuan(maQuan, tenQuan);
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Cập nhật quận thành công.' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const deletequan = async (event) => {
    try {
        const { maQuan } = event.pathParameters;
        await quanService.deleteQuan(maQuan);
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Xóa quận thành công.' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};