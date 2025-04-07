// src/tham-so/handler.js

import ThamSoService from './services.mjs';

const thamSoService = new ThamSoService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

export const createts = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { mathamso, soluongdailytoida, quydinhtienthutienno } = JSON.parse(event.body);
        const maThamSo = await thamSoService.createThamSo({ mathamso, soluongdailytoida, quydinhtienthutienno });
        console.log('Đã tạo tham số với ID:', maThamSo);
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: 'Đã tạo tham số thành công.', maThamSo }),
        };
    } catch (error) {
        console.error('Lỗi khi tạo tham số: ', error);
        return {
            statusCode: error.message.includes('required') ? 400 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tạo tham số: ', error: error.message }),
        };
    }
};

export const getlastts = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const ThamSo = await thamSoService.getLastThamSo();
        if (!ThamSo) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy tham số nào.' }),
            };
        }
        console.log('Tra cứu tham số thành công:', JSON.stringify(ThamSo));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(ThamSo),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu tham số: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu tham số: ', error: error.message }),
        };
    }
};

export const deletets = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maThamSo } = event.pathParameters;
        await thamSoService.deleteThamSo(maThamSo);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Xóa tham số thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi xóa tham số: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi xóa tham số: ', error: error.message }),
        };
    }
};