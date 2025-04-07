// src/don-vi-tinh/handler.js

import DonViTinhService from './services.mjs';

const donViTinhService = new DonViTinhService();

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

export const createdvt = async (event) => {
    try {
        const { tenDonViTinh } = JSON.parse(event.body);
        const maDonViTinh = await donViTinhService.createDonViTinh(tenDonViTinh);
        console.log('Unit of measurement created with ID:', maDonViTinh);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Unit of measurement created successfully', maDonViTinh }),
        };
    } catch (error) {
        console.error('Error creating unit of measurement:', error);
        return {
            statusCode: error.message.includes('required') ? 400 : 500,
            body: JSON.stringify({ message: 'Failed to create unit of measurement', error: error.message }),
        };
    }
};

export const getalldvt = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const DonViTinh = await donViTinhService.getAllDonViTinh();
        if (!DonViTinh) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Không tìm thấy đơn vị tính nào.' }),
            };
        }
        console.log('Tra cứu đơn vị tính thành công:', JSON.stringify(DonViTinh));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(DonViTinh),
        };
    } catch (error) {
        console.error('Lỗi khi tra cứu đơn vị tính: ', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tra cứu đơn vị tính: ', error: error.message }),
        };
    }
};

export const getdvtbyid = async (event) => {
    try {
        const { maDonViTinh } = event.pathParameters;
        const donViTinh = await donViTinhService.getDonViTinh(maDonViTinh);
        if (!donViTinh) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Unit of measurement not found' }),
            };
        }
        console.log('Unit of measurement retrieved successfully:', donViTinh);
        return {
            statusCode: 200,
            body: JSON.stringify(donViTinh),
        };
    } catch (error) {
        console.error('Error reading unit of measurement:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to read unit of measurement', error: error.message }),
        };
    }
};

export const updatedvt = async (event) => {
    try {
        const { maDonViTinh } = event.pathParameters;
        const { tenDonViTinh } = JSON.parse(event.body);
        await donViTinhService.updateDonViTinh(maDonViTinh, tenDonViTinh);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Unit of measurement updated successfully' }),
        };
    } catch (error) {
        console.error('Error updating unit of measurement:', error);
        return {
            statusCode: error.message.includes('not found') ? 404 : 500,
            body: JSON.stringify({ message: 'Failed to update unit of measurement', error: error.message }),
        };
    }
};

export const deletedvt = async (event) => {
    try {
        const { maDonViTinh } = event.pathParameters;
        await donViTinhService.deleteDonViTinh(maDonViTinh);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Unit of measurement deleted successfully' }),
        };
    } catch (error) {
        console.error('Error deleting unit of measurement:', error);
        return {
            statusCode: error.message.includes('not found') ? 404 : 500,
            body: JSON.stringify({ message: 'Failed to delete unit of measurement', error: error.message }),
        };
    }
};