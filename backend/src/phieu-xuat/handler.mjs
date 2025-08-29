// src/loai-dai-ly/handler.js

import PhieuXuatService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';

const phieuXuatService = new PhieuXuatService();

export const createpx = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const { maphieuxuat, madaily, ngaylap, chitiet, tongtien } = JSON.parse(event.body);
        const maPhieuXuat = await phieuXuatService.createPhieuXuat({ maphieuxuat, madaily, ngaylap, chitiet, tongtien });
        return {
            statusCode: HTTP_STATUS.CREATED,
            body: JSON.stringify({ message: 'Lập phiếu xuất thành công.', maPhieuXuat }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
}

export const getallpx = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const phieuXuat = await phieuXuatService.getAllPhieuXuat();
        if (!phieuXuat || phieuXuat.length === 0) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Không tìm thấy phiếu xuất nào.' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(phieuXuat),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

