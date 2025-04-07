// src/id-tracker/handler.mjs

import IdTrackerService from './services.mjs';

const idTrackerService = new IdTrackerService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

// Generic response handler to reduce code duplication
const handleResponse = (statusCode, body) => ({
    statusCode,
    headers,
    body: JSON.stringify(body)
});

// Generic error handler
const handleError = (error, operation) => {
    console.error(`Error when ${operation}: `, error);
    return handleResponse(500, {
        message: `Error when ${operation}`,
        error: error.message
    });
};

// Handler for getting the latest MaDaiLy
export const getlatestmadl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const madaily = await idTrackerService.getLatestMaDaiLy();
        console.log('Latest MaDaiLy generated:', madaily);
        return handleResponse(200, { madaily });
    } catch (error) {
        return handleError(error, 'generating MaDaiLy');
    }
};

// Handler for getting the latest MaDonViTinh
export const getlatestmadvt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const madonvitinh = await idTrackerService.getLatestMaDonViTinh();
        console.log('Latest MaDonViTinh generated:', madonvitinh);
        return handleResponse(200, { madonvitinh });
    } catch (error) {
        return handleError(error, 'generating MaDonViTinh');
    }
};

// Handler for getting the latest MaLoaiDaiLy
export const getlatestmaldl = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const maloaidaily = await idTrackerService.getLatestMaLoaiDaiLy();
        console.log('Latest MaLoaiDaiLy generated:', maloaidaily);
        return handleResponse(200, { maloaidaily });
    } catch (error) {
        return handleError(error, 'generating MaLoaiDaiLy');
    }
};

// Handler for getting the latest MaQuan
export const getlatestmaquan = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const maquan = await idTrackerService.getLatestMaQuan();
        console.log('Latest MaQuan generated:', maquan);
        return handleResponse(200, { maquan });
    } catch (error) {
        return handleError(error, 'generating MaQuan');
    }
};

// Handler for getting the latest MaMatHang
export const getlatestmamh = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const mamathang = await idTrackerService.getLatestMaMatHang();
        console.log('Latest MaMatHang generated:', mamathang);
        return handleResponse(200, { mamathang });
    } catch (error) {
        return handleError(error, 'generating MaMatHang');
    }
};

// Handler for getting the latest MaPhieuThu
export const getlatestmapt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const maphieuthu = await idTrackerService.getLatestMaPhieuThu();
        console.log('Latest MaPhieuThu generated:', maphieuthu);
        return handleResponse(200, { maphieuthu });
    } catch (error) {
        return handleError(error, 'generating MaPhieuThu');
    }
};

// Handler for getting the latest MaPhieuXuat
export const getlatestmapx = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const maphieuxuat = await idTrackerService.getLatestMaPhieuXuat();
        console.log('Latest MaPhieuXuat generated:', maphieuxuat);
        return handleResponse(200, { maphieuxuat });
    } catch (error) {
        return handleError(error, 'generating MaPhieuXuat');
    }
};