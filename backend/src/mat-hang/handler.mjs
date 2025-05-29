// src/mat-hang/handler.js

import MatHangService from './services.mjs';

const matHangService = new MatHangService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

export const createmh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { mamathang, tenmathang, donvitinh, giaban } = JSON.parse(event.body);
        const maMatHang = await matHangService.createMatHang({ mamathang, tenmathang, donvitinh, giaban });
        console.log('Đã tạo mặt hàng với mã:', maMatHang);
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: 'Đã tạo mặt hàng thành công.', mamathang: maMatHang }),
        };
    } catch (error) {
        console.error('Lỗi khi tạo mặt hàng: ', error);
        return {
            statusCode: error.message.includes('required') || error.message.includes('Thiếu') ? 400 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tạo mặt hàng: ', error: error.message }),
        };
    }
};

export const getallmh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const matHang = await matHangService.getAllMatHang();
        if (!matHang || matHang.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy mặt hàng nào.' }),
            };
        }
        console.log('Tra cứu mặt hàng thành công:', JSON.stringify(matHang));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(matHang),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu mặt hàng: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu mặt hàng: ', error: error.message }),
        };
    }
};

export const getmhbyid = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maMatHang } = event.pathParameters;
        const matHang = await matHangService.getMatHang(maMatHang);
        if (!matHang) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy mặt hàng.' }),
            };
        }
        console.log('Tra cứu mặt hàng thành công:', matHang);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(matHang),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu mặt hàng: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu mặt hàng: ', error: error.message }),
        };
    }
};

export const updatemh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maMatHang } = event.pathParameters;
        const { tenmathang, donvitinh, giaban } = JSON.parse(event.body);
        await matHangService.updateMatHang(maMatHang, { tenmathang, donvitinh, giaban });
        console.log('Cập nhật mặt hàng thành công:', maMatHang);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Cập nhật mặt hàng thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi cập nhật mặt hàng: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi cập nhật mặt hàng: ', error: error.message }),
        };
    }
};

export const deletemh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maMatHang } = event.pathParameters;
        console.log('Xóa mặt hàng với mã:', maMatHang);
        await matHangService.deleteMatHang(maMatHang);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Xóa mặt hàng thành công.' }),
        };
    } catch (error) {
        console.error('Lỗi khi xóa mặt hàng: ', error);
        return {
            statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi xóa mặt hàng: ', error: error.message }),
        };
    }
};

export const searchmh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const searchParams = event.queryStringParameters || {};
        const results = await matHangService.searchMatHang(searchParams);

        if (!results || results.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy mặt hàng nào phù hợp với tiêu chí tìm kiếm.', data: [] }),
            };
        }

        console.log('Tìm kiếm mặt hàng thành công, số kết quả:', results.length);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(results),
        };
    } catch (error) {
        console.error('Lỗi khi tìm kiếm mặt hàng: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tìm kiếm mặt hàng: ', error: error.message }),
        };
    }
};