import IdTrackerService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';

const idTrackerService = new IdTrackerService();

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
        return handleResponse(200, { maphieuxuat });
    } catch (error) {
        return handleError(error, 'generating MaPhieuXuat');
    }
};