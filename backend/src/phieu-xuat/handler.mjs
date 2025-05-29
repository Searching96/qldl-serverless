// src/loai-dai-ly/handler.js

import PhieuXuatService from './services.mjs';

const phieuXuatService = new PhieuXuatService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

export const createpx = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        console.log('Event body:', event.body);
        const { maphieuxuat, madaily, ngaylap, chitiet, tongtien } = JSON.parse(event.body);
        console.log('Parsed body:', { maphieuxuat, madaily, ngaylap, chitiet, tongtien });
        const maPhieuXuat = await phieuXuatService.createPhieuXuat({ maphieuxuat, madaily, ngaylap, chitiet, tongtien });
        console.log('Đã tạo phiếu xuất với ID:', maPhieuXuat);
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: 'Lập phiếu xuất thành công.', maPhieuXuat }),
        };
    } catch (error) {
        console.error('Lỗi khi tạo phiếu xuất: ', error);
        return {
            statusCode: error.message.includes('required') || error.message.includes('Thiếu') ? 400 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tạo phiếu xuất: ', error: error.message }),
        };
    }
};

export const getallpx = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const phieuXuat = await phieuXuatService.getAllPhieuXuat();
        if (!phieuXuat || phieuXuat.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu xuất nào.' }),
            };
        }
        console.log('Tra cứu phiếu xuất thành công:', JSON.stringify(phieuXuat));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(phieuXuat),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu phiếu xuất: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu phiếu xuất: ', error: error.message }),
        };
    }
};

