// src/quan/handler.js

import QuanService from './services.mjs';

const quanService = new QuanService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

export const createquan = async (event) => {
    try {
        const { tenQuan } = JSON.parse(event.body);
        const maQuan = await quanService.createQuan(tenQuan);
        console.log('Đã tạo quận với ID:', maQuan);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Đã tạo quận thành công.', maQuan }),
        };
    } catch (error) {
        console.error('Lỗi khi tạo quận: ', error);
        return {
            statusCode: error.message.includes('required') ? 400 : 500,
            body: JSON.stringify({ message: 'Lỗi khi tạo quận: ', error: error.message }),
        };
    }
};

export const getallquan = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const Quan = await quanService.getAllQuan();
        if (!Quan) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy quận nào.' }),
            };
        }
        console.log('Tra cứu quận thành công:', JSON.stringify(Quan));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(Quan),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu quận: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu quận: ', error: error.message }),
        };
    }
};

export const getquanbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maQuan } = event.pathParameters;
        const Quan = await quanService.getQuan(maQuan);
        if (!Quan) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy quận.' }),
            };
        }
        console.log('Tra cứu quận thành công:', Quan);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(Quan),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu quận: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu quận: ', error: error.message }),
        };
    }
};

export const updatequan = async (event) => {
    try {
        const { maQuan } = event.pathParameters;
        const { tenQuan } = JSON.parse(event.body);
        await quanService.updateQuan(maQuan, tenQuan);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Cập nhật quận thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi cập nhật quận: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            body: JSON.stringify({ message: 'Lỗi khi cập nhật quận: ', error: error.message }),
        };
    }
};

export const deletequan = async (event) => {
    try {
        const { maQuan } = event.pathParameters;
        await quanService.deleteQuan(maQuan);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Xóa quận thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi xóa quận: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            body: JSON.stringify({ message: 'Lỗi khi xóa quận: ', error: error.message }),
        };
    }
};