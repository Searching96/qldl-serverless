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
        const { maphieuxuat, madaily } = JSON.parse(event.body);
        console.log('Parsed body:', { maphieuxuat, madaily });
        const maPhieuXuat = await phieuXuatService.createPhieuXuat({ maphieuxuat, madaily });
        console.log('Đã tạo phiếu xuất với ID:', maPhieuXuat);
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: 'Đã tạo phiếu xuất thành công.', maPhieuXuat }),
        };
    } catch (error) {
        console.error('Lỗi khi tạo phiếu xuất: ', error);
        return {
            statusCode: error.message.includes('required') ? 400 : 500,
            headers,
            body: JSON.stringify({ message: 'Lỗi khi tạo phiếu xuất: ', error: error.message }),
        };
    }
};

// export const getallldl = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;
//     try {
//         const LoaiDaiLy = await loaiDaiLyService.getAllLoaiDaiLy();
//         if (!LoaiDaiLy) {
//             return {
//                 statusCode: 404,
//                 headers,
//                 body: JSON.stringify({ message: 'Không tìm thấy loại đại lý nào.' }),
//             };
//         }
//         console.log('Tra cứu loại đại lý thành công:', JSON.stringify(LoaiDaiLy));
//         return {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(LoaiDaiLy),
//         };
//     } catch (error) {
//         console.error('Lỗi khi tra cứu loại đại lý: ', error);
//         return {
//             statusCode: 500,
//             headers,
//             body: JSON.stringify({ message: 'Lỗi khi tra cứu loại đại lý: ', error: error.message }),
//         };
//     }
// };

// export const getldlbyid = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;
//     try {
//         const { maLoaiDaiLy } = event.pathParameters;
//         const LoaiDaiLy = await loaiDaiLyService.getLoaiDaiLy(maLoaiDaiLy);
//         if (!LoaiDaiLy) {
//             return {
//                 statusCode: 404,
//                 headers,
//                 body: JSON.stringify({ message: 'Không tìm thấy loại đại lý.' }),
//             };
//         }
//         console.log('Tra cứu loại đại lý thành công:', LoaiDaiLy);
//         return {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(LoaiDaiLy),
//         };
//     } catch (error) {
//         console.error('Lỗi khi tra cứu loại đại lý: ', error);
//         return {
//             statusCode: 500,
//             headers,
//             body: JSON.stringify({ message: 'Lỗi khi tra cứu loại đại lý: ', error: error.message }),
//         };
//     }
// };

// export const updateldl = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;
//     try {
//         const { maLoaiDaiLy } = event.pathParameters;
//         const { tenLoaiDaiLy } = JSON.parse(event.body);
//         await loaiDaiLyService.updateLoaiDaiLy(maLoaiDaiLy, tenLoaiDaiLy);
//         return {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify({ message: 'Cập nhật loại đại lý thành công.' }),
//         };
//     } catch (error) {
//         console.error('Lỗi khi cập nhật loại đại lý: ', error);
//         return {
//             statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
//             headers,
//             body: JSON.stringify({ message: 'Lỗi khi cập nhật loại đại lý: ', error: error.message }),
//         };
//     }
// };

// export const deleteldl = async (event, context) => {
//     context.callbackWaitsForEmptyEventLoop = false;
//     try {
//         const { maLoaiDaiLy } = event.pathParameters;
//         await loaiDaiLyService.deleteLoaiDaiLy(maLoaiDaiLy);
//         return {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify({ message: 'Xóa loại đại lý thành công.' }),
//         };
//     } catch (error) {
//         console.error('Lỗi khi xóa loại đại lý: ', error);
//         return {
//             statusCode: error.message.includes('Không tìm thấy') ? 404 : 500,
//             headers,
//             body: JSON.stringify({ message: 'Lỗi khi xóa loại đại lý: ', error: error.message }),
//         };
//     }
// };