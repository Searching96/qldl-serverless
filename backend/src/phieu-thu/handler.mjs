// src/phieu-thu/handler.js

import PhieuThuService from './services.mjs';

const phieuThuService = new PhieuThuService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

export const creatept = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { madaily, ngaythutien, sotienthu } = JSON.parse(event.body);
        const maphieuthu = await phieuThuService.createPhieuThu({ madaily, ngaythutien, sotienthu });
        //console.log('Đã tạo phiếu thu với mã:', maphieuthu);
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: 'Tạo phiếu thu thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi tạo phiếu thu: ', error);
        return {
            statusCode: error.message.includes('required') || error.message.includes('Thiếu') ? 400 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tạo phiếu thu: ', error: error.message }),
        };
    }
};

export const getallpt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const phieuThu = await phieuThuService.getAllPhieuThu();
        if (!phieuThu || phieuThu.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu thu nào.' }),
            };
        }
        console.log('Tra cứu phiếu thu thành công:', JSON.stringify(phieuThu));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(phieuThu),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu phiếu thu: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu phiếu thu: ', error: error.message }),
        };
    }
};

export const getptbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maPhieuThu } = event.pathParameters;
        const phieuThu = await phieuThuService.getPhieuThu(maPhieuThu);
        if (!phieuThu) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu thu.' }),
            };
        }
        console.log('Tra cứu phiếu thu thành công:', phieuThu);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(phieuThu),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu phiếu thu: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu phiếu thu: ', error: error.message }),
        };
    }
};

export const updatept = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maPhieuThu } = event.pathParameters;
        const { madaily, ngaythutien, sotienthu } = JSON.parse(event.body);
        await phieuThuService.updatePhieuThu(maPhieuThu, { madaily, ngaythutien, sotienthu });
        console.log('Cập nhật phiếu thu thành công:', maPhieuThu);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Cập nhật phiếu thu thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi cập nhật phiếu thu: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi cập nhật phiếu thu: ', error: error.message }),
        };
    }
};

export const deletept = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maPhieuThu } = event.pathParameters;
        console.log('Xóa phiếu thu với mã:', maPhieuThu);
        await phieuThuService.deletePhieuThu(maPhieuThu);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Xóa phiếu thu thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi xóa phiếu thu: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi xóa phiếu thu: ', error: error.message }),
        };
    }
};

export const searchpt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const searchParams = event.queryStringParameters || {};
        const results = await phieuThuService.searchPhieuThu(searchParams);

        if (!results || results.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu thu nào phù hợp với tiêu chí tìm kiếm.', data: [] }),
            };
        }

        console.log('Tìm kiếm phiếu thu thành công, số kết quả:', results.length);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(results),
        };
    } catch (error) {
        console.error('Lỗi khi tìm kiếm phiếu thu: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tìm kiếm phiếu thu: ', error: error.message }),
        };
    }
};