// src/tham-so/handler.js

import ThamSoService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';
import { ValidationError } from '../shared/errorHandler.mjs';
import { HTTP_STATUS } from '../shared/constants.mjs';

const thamSoService = new ThamSoService();

export const createts = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { mathamso, soluongdailytoida, quydinhtienthutienno } = JSON.parse(event.body);
        const maThamSo = await thamSoService.createThamSo({ mathamso, soluongdailytoida, quydinhtienthutienno });
        return {
            statusCode: HTTP_STATUS.CREATED,
                        body: JSON.stringify({ message: 'Đã tạo tham số thành công.', maThamSo }),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};

export const getlastts = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const ThamSo = await thamSoService.getLastThamSo();
        if (!ThamSo) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                                body: JSON.stringify({ message: 'Không tìm thấy tham số nào.' }),
                }
}
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify(ThamSo),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};

export const updatets = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { soluongdailytoida, quydinhtienthutienno } = JSON.parse(event.body);
        const updatedThamSo = await thamSoService.updateThamSo(soluongdailytoida, quydinhtienthutienno);
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify({ message: 'Cập nhật tham số thành công.', updatedThamSo }),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};

export const deletets = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maThamSo } = event.pathParameters;
        await thamSoService.deleteThamSo(maThamSo);
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify({ message: 'Xóa tham số thành công.' }),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};