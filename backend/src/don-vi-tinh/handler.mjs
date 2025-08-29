import DonViTinhService from './services.mjs';
import { handleLambdaError, handleLambdaSuccess } from '../shared/errorHandler.mjs';
import { HTTP_STATUS } from '../shared/constants.mjs';

const donViTinhService = new DonViTinhService();

export const createdvt = async (event) => {
    try {
        const { tenDonViTinh } = JSON.parse(event.body);
        const maDonViTinh = await donViTinhService.createDonViTinh(tenDonViTinh);
        return {
            statusCode: HTTP_STATUS.CREATED,
            body: JSON.stringify({ message: 'Unit of measurement created successfully', maDonViTinh }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const getalldvt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const DonViTinh = await donViTinhService.getAllDonViTinh();
        if (!DonViTinh) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Không tìm thấy đơn vị tính nào.' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(DonViTinh),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const getdvtbyid = async (event) => {
    try {
        const { maDonViTinh } = event.pathParameters;
        const donViTinh = await donViTinhService.getDonViTinh(maDonViTinh);
        if (!donViTinh) {
            return {
                statusCode: HTTP_STATUS.NOT_FOUND,
                body: JSON.stringify({ message: 'Unit of measurement not found' }),
            }
        }
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify(donViTinh),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const updatedvt = async (event) => {
    try {
        const { maDonViTinh } = event.pathParameters;
        const { tenDonViTinh } = JSON.parse(event.body);
        await donViTinhService.updateDonViTinh(maDonViTinh, tenDonViTinh);
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Unit of measurement updated successfully' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};

export const deletedvt = async (event) => {
    try {
        const { maDonViTinh } = event.pathParameters;
        await donViTinhService.deleteDonViTinh(maDonViTinh);
        return {
            statusCode: HTTP_STATUS.OK,
            body: JSON.stringify({ message: 'Unit of measurement deleted successfully' }),
        }
    } catch (error) {
        return handleLambdaError(error, operation_name);
    }
};