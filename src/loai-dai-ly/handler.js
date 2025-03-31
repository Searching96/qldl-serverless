// src/loai-dai-ly/handler.js

import LoaiDaiLyService from './services.js';

const loaiDaiLyService = new LoaiDaiLyService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

export const createldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { tenLoaiDaiLy } = JSON.parse(event.body);
        const maLoaiDaiLy = await loaiDaiLyService.createLoaiDaiLy(tenLoaiDaiLy);
        console.log('Đã tạo loại đại lý với ID:', maLoaiDaiLy);
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: 'Đã tạo loại đại lý thành công.', maLoaiDaiLy }),
        };
    } catch (error) {
        console.error('Lỗi khi tạo loại đại lý: ', error);
        return {
            statusCode: error.message.includes('required') ? 400 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tạo loại đại lý: ', error: error.message }),
        };
    }
};

export const getallldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const LoaiDaiLy = await loaiDaiLyService.getAllLoaiDaiLy();
        if (!LoaiDaiLy) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy loại đại lý nào.' }),
            };
        }
        console.log('Tra cứu loại đại lý thành công:', JSON.stringify(LoaiDaiLy));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(LoaiDaiLy),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu loại đại lý: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu loại đại lý: ', error: error.message }),
        };
    }
};

export const getldlbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maLoaiDaiLy } = event.pathParameters;
        const LoaiDaiLy = await loaiDaiLyService.getLoaiDaiLy(maLoaiDaiLy);
        if (!LoaiDaiLy) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy loại đại lý.' }),
            };
        }
        console.log('Tra cứu loại đại lý thành công:', LoaiDaiLy);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(LoaiDaiLy),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu loại đại lý: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu loại đại lý: ', error: error.message }),
        };
    }
};

export const updateldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maLoaiDaiLy } = event.pathParameters;
        const { tenLoaiDaiLy } = JSON.parse(event.body);
        await loaiDaiLyService.updateLoaiDaiLy(maLoaiDaiLy, tenLoaiDaiLy);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Cập nhật loại đại lý thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi cập nhật loại đại lý: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi cập nhật loại đại lý: ', error: error.message }),
        };
    }
};

export const deleteldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maLoaiDaiLy } = event.pathParameters;
        await loaiDaiLyService.deleteLoaiDaiLy(maLoaiDaiLy);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Xóa loại đại lý thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi xóa loại đại lý: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi xóa loại đại lý: ', error: error.message }),
        };
    }
};