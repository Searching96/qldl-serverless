// src/loai-dai-ly/handler.js

import LoaiDaiLyService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';
import { ValidationError } from '../shared/errorHandler.mjs';
import { HTTP_STATUS } from '../shared/constants.mjs';

const loaiDaiLyService = new LoaiDaiLyService();

export const createldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { tenLoaiDaiLy } = JSON.parse(event.body);
        const maLoaiDaiLy = await loaiDaiLyService.createLoaiDaiLy(tenLoaiDaiLy);
        return {
            statusCode: HTTP_STATUS.CREATED,
                        body: JSON.stringify({ message: 'Đã tạo loại đại lý thành công.', maLoaiDaiLy }),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};

export const getallldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const LoaiDaiLy = await loaiDaiLyService.getAllLoaiDaiLy();
        if (!LoaiDaiLy) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                                body: JSON.stringify({ message: 'Không tìm thấy loại đại lý nào.' }),
                }
}
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify(LoaiDaiLy),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};

export const getldlbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maLoaiDaiLy } = event.pathParameters;
        const LoaiDaiLy = await loaiDaiLyService.getLoaiDaiLy(maLoaiDaiLy);
        if (!LoaiDaiLy) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                                body: JSON.stringify({ message: 'Không tìm thấy loại đại lý.' }),
                }
}
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify(LoaiDaiLy),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};

export const updateldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maLoaiDaiLy } = event.pathParameters;
        const { tenLoaiDaiLy } = JSON.parse(event.body);
        await loaiDaiLyService.updateLoaiDaiLy(maLoaiDaiLy, tenLoaiDaiLy);
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify({ message: 'Cập nhật loại đại lý thành công.' }),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};

export const deleteldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maLoaiDaiLy } = event.pathParameters;
        await loaiDaiLyService.deleteLoaiDaiLy(maLoaiDaiLy);
        return {
            statusCode: HTTP_STATUS.OK,
                        body: JSON.stringify({ message: 'Xóa loại đại lý thành công.' }),
            }
} catch (error) {
        return handleLambdaError(error, operation_name);
            }
}
};