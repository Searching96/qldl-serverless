import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
	createDaily, getAllDaily, getAllLoaiDaiLy, getAllQuan,
	getDaily, updateDaily, deleteDaily, getLatestMaDaiLy
} from "../services/api.js";
import { Quan, LoaiDaiLy } from "../models";
import { TimKiemDaiLy } from "./TimKiemDaiLy";
import { DataTable } from "./DataTable";

export const TiepNhanDaiLy = () => {
	// Form state
	const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
	const navigate = useNavigate();
	const [editId, setEditId] = useState(null);
	const [newId, setNewId] = useState(null);
	const [cachedNextId, setCachedNextId] = useState(null);

	// Component state
	const [dsDaiLy, setDSDaiLy] = useState([]);
	const [dsQuan, setDSQuan] = useState([]);
	const [dsLoaiDaiLy, setDSLoaiDaiLy] = useState([]);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [infoMessage, setInfoMessage] = useState('');
	const [selectedDaily, setSelectedDaily] = useState(null);
	const [showSearchModal, setShowSearchModal] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setInfoMessage('Đang tải dữ liệu...');

				const [loaiDaiLyResponse, quanResponse] = await Promise.all([
					getAllLoaiDaiLy(),
					getAllQuan()
				]);

				console.log("API Response - LoaiDaiLy:", loaiDaiLyResponse);
				console.log("API Response - Quan:", quanResponse);

				const loaiDaiLyList = Array.isArray(loaiDaiLyResponse) ?
					loaiDaiLyResponse.map(ldl => new LoaiDaiLy(ldl.maloaidaily, ldl.tenloaidaily))
						.sort((a, b) => {
							const numA = parseInt(a.tenloaidaily.replace(/\D/g, ""));
							const numB = parseInt(b.tenloaidaily.replace(/\D/g, ""));

							if (!isNaN(numA) && !isNaN(numB)) {
								return numA - numB;
							}

							return a.tenloaidaily.localeCompare(b.tenloaidaily);
						}) : [];

				const quanList = Array.isArray(quanResponse) ?
					quanResponse
						.map(q => new Quan(q.maquan, q.tenquan))
						.sort((a, b) => {
							const numA = parseInt(a.tenquan.replace(/\D/g, ""));
							const numB = parseInt(b.tenquan.replace(/\D/g, ""));

							if (!isNaN(numA) && !isNaN(numB)) {
								return numA - numB;
							}

							return a.tenquan.localeCompare(b.tenquan);
						}) : [];

				setDSLoaiDaiLy(loaiDaiLyList);
				setDSQuan(quanList);

				const dailyResponse = await getAllDaily();
				setDSDaiLy(dailyResponse || []);

			} catch (error) {
				console.error("Error loading data:", error);
			} finally {
				setInfoMessage('');
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (selectedDaily) {
			setEditId(selectedDaily.madaily || selectedDaily.maDaiLy);
			setValue("madaily", selectedDaily.madaily || selectedDaily.maDaiLy);
			setValue("tendaily", selectedDaily.tendaily || "");
			setValue("diachi", selectedDaily.diachi || "");
			setValue("sodienthoai", selectedDaily.sodienthoai || selectedDaily.dienthoai || "");
			setValue("email", selectedDaily.email || "");
			setValue("maquan", selectedDaily.maquan || "");
			setValue("maloaidaily", selectedDaily.maloaidaily || "");
			setValue("ngaytiepnhan", selectedDaily.ngaytiepnhan ?
				new Date(selectedDaily.ngaytiepnhan).toISOString().split("T")[0] :
				new Date().toISOString().split("T")[0]
			);
		}
	}, [selectedDaily, setValue]);

	// Function to get the latest DaiLy ID
	const fetchLatestDaiLyId = async () => {
		try {
			setInfoMessage('Đang lấy mã đại lý mới...');
			const idResponse = await getLatestMaDaiLy();
			setInfoMessage('');
			return idResponse?.maDaiLy || idResponse?.madaily;
		} catch (error) {
			console.error("Error fetching latest ID:", error);
			setErrorMessage("Không thể lấy mã đại lý mới: " + error.message);
			setInfoMessage('');
			return null;
		}
	};

	useEffect(() => {
		console.log("State Updated - dsQuan:", dsQuan);
		console.log("State Updated - dsLoaiDaiLy:", dsLoaiDaiLy);
	}, [dsQuan, dsLoaiDaiLy]);

	const handleEditRow = async (row) => {
		console.log("Edit row (full object):", JSON.stringify(row));

		try {
			setInfoMessage('Đang tải thông tin đại lý...');
			// Handle both ID formats
			const idToUse = row.madaily || row.maDaiLy;
			console.log("maDaiLy value:", idToUse || "NOT FOUND");

			if (!idToUse) {
				throw new Error("Could not find mã đại lý in the row data");
			}

			const daily = await getDaily(idToUse);
			console.log("Fetched daily for edit (full):", JSON.stringify(daily));
			setSelectedDaily(daily);
			setInfoMessage('');
		} catch (error) {
			console.error("Error fetching daily for edit:", error);
			setErrorMessage("Không thể tải thông tin đại lý: " + error.message);
			setInfoMessage('');
		}
	};

	const handleDeleteRow = async (row) => {
		console.log("Delete row (full object):", JSON.stringify(row));

		const idToUse = row.maDaiLy || row.madaily;
		if (!idToUse) {
			setErrorMessage("Không tìm thấy mã đại lý để xóa");
			return;
		}

		const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa đại lý ${idToUse}?`);

		if (isConfirmed) {
			try {
				setInfoMessage('Đang xóa đại lý...');

				await deleteDaily(idToUse);

				setSuccessMessage(`Đại lý ${idToUse} đã được xóa thành công`);

				setInfoMessage('Đang cập nhật danh sách đại lý...');
				const updatedDaily = await getAllDaily();
				setDSDaiLy(updatedDaily || []);

				setInfoMessage('');

				if (selectedDaily && (selectedDaily.maDaiLy === idToUse || selectedDaily.madaily === idToUse)) {
					setSelectedDaily(null);
				}
			} catch (error) {
				console.error("Error deleting daily:", error);
				setErrorMessage(`Không thể xóa đại lý: ${error.message}`);
				setInfoMessage('');
			}
		}
	};

	const handleFormSubmit = async (formData, callback) => {
		if (formData.preventDefault) {
			formData.preventDefault();
		}

		console.log("Dữ liệu đã nhập: ", formData);

		setSuccessMessage('');
		setErrorMessage('');
		let operationSuccess = false;

		try {
			let result;

			if (selectedDaily) {
				setInfoMessage('Đang cập nhật đại lý...');
				// Ensure we have the ID in the correct format
				const idToUse = formData.madaily;
				result = await updateDaily(idToUse, formData);
				setSuccessMessage('Đại lý được cập nhật thành công: ' + idToUse);
				operationSuccess = true;
			} else {
				setInfoMessage('Đang tạo đại lý mới...');
				result = await createDaily(formData);
				const newId = result.madaily || result.maDaiLy;
				setSuccessMessage('Đại lý được tạo thành công: ' + newId);
				operationSuccess = true;
			}

			setInfoMessage('Đang cập nhật danh sách đại lý...');
			const updatedDaily = await getAllDaily();
			setDSDaiLy(updatedDaily || []);
			setInfoMessage('');

			// Clear form state and disable form after successful submission
			setSelectedDaily(null);
			setEditId(null);
			setNewId(null);
			setCachedNextId(null);
			resetForm();

		} catch (err) {
			console.error("Có lỗi xảy ra:", err);
			setErrorMessage(err.message || 'Có lỗi xảy ra khi xử lý đại lý');
			setInfoMessage('');
			operationSuccess = false;
		}

		// Call the callback with the operation result if provided
		if (callback && typeof callback === 'function') {
			callback(operationSuccess);
		}
	};

	const handleRefresh = async () => {
		try {
			setInfoMessage('Đang cập nhật danh sách đại lý...');
			const updatedDaily = await getAllDaily();
			setDSDaiLy(updatedDaily || []);
			setSuccessMessage('Danh sách đại lý đã được cập nhật');
			setInfoMessage('');
		} catch (error) {
			console.error("Error refreshing data:", error);
			setErrorMessage("Không thể cập nhật danh sách đại lý: " + error.message);
			setInfoMessage('');
		}
	};

	// Form logic (moved from FormComponent)
	const resetForm = useCallback(() => {
		reset();
		setEditId(null);
		setNewId(null);
		setValue("tendaily", "");
		setValue("diachi", "");
		setValue("sodienthoai", "");
		setValue("email", "");
		setValue("maquan", "");
		setValue("maloaidaily", "");
		setValue("ngaytiepnhan", new Date().toISOString().split("T")[0]);
	}, [reset, setValue]);

	const getnewId = async () => {
		try {
			resetForm();
			if (cachedNextId) {
				setNewId(cachedNextId);
				setValue("madaily", cachedNextId);
			} else {
				const nextId = await fetchLatestDaiLyId();
				if (nextId) {
					setNewId(nextId);
					setValue("madaily", nextId);
					setCachedNextId(nextId);
				}
			}
		} catch (error) {
			console.error("Error using cached ID:", error);
		}
	};

	const isFormEnabled = Boolean(editId || newId);

	const handleShowSearchModal = () => {
		setShowSearchModal(true);
	};

	const handleCloseSearchModal = () => {
		setShowSearchModal(false);
	};

	const handleSelectFromSearch = (selectedAgent) => {
		// Use the selected agent data to populate the form for editing
		setSelectedDaily(selectedAgent);
		setShowSearchModal(false);
	};

	const handleExitToHome = () => {
		navigate("/");
	};

	// Define columns for DataTable
	const columns = [
		{
			header: 'Mã đại lý',
			accessor: 'madaily',
			width: '8%',
			cellClassName: 'fw-bold text-primary'
		},
		{
			header: 'Tên đại lý',
			accessor: 'tendaily',
			width: '18%'
		},
		{
			header: 'Số điện thoại',
			accessor: 'sodienthoai',
			width: '10%',
			render: (row) => row.sodienthoai || row.dienthoai
		},
		{
			header: 'Địa chỉ',
			accessor: 'diachi',
			width: '20%'
		},
		{
			header: 'Email',
			accessor: 'email',
			width: '15%'
		},
		{
			header: 'Loại đại lý',
			accessor: 'tenloaidaily',
			width: '10%',
			render: (row) => row.tenloaidaily || "N/A"
		},
		{
			header: 'Quận',
			accessor: 'tenquan',
			width: '8%',
			render: (row) => row.tenquan || "N/A"
		},
		{
			header: 'Ngày tiếp nhận',
			accessor: 'ngaytiepnhan',
			width: '12%',
			render: (row) => row.ngaytiepnhan ?
				new Date(row.ngaytiepnhan).toLocaleDateString('vi-VN') : "N/A"
		},
		{
			header: 'Thao tác',
			accessor: 'actions',
			width: '15%',
			sortable: false,
			cellClassName: 'text-center',
			render: (row) => (
				<div className="d-flex gap-1 justify-content-center">
					<Button
						size="sm"
						variant="primary"
						onClick={() => handleEditRow(row)}
					>
						<i className="bi bi-pencil-square"></i> Sửa
					</Button>
					<Button
						size="sm"
						variant="danger"
						onClick={() => handleDeleteRow(row)}
					>
						<i className="bi bi-trash"></i> Xóa
					</Button>
				</div>
			)
		}
	];

	return (
		<div className="container-fluid px-0 mt-4">
			<h1 className="ms-3">Thông tin đại lý</h1>
			{successMessage && (
				<div className="alert alert-success mx-3" role="alert">
					<div className="d-flex justify-content-between align-items-center">
						<span>{successMessage}</span>
						<button
							className="btn btn-outline-primary btn-sm ms-2"
							onClick={() => setSuccessMessage('')}
						>
							<i className="bi bi-x"></i>
						</button>
					</div>
				</div>
			)}
			{errorMessage && (
				<div className="alert alert-danger mx-3" role="alert">
					<div className="d-flex justify-content-between align-items-start">
						<div style={{ whiteSpace: 'pre-line', lineHeight: '1.5', flex: 1 }}>
							{errorMessage}
						</div>
						<button
							className="btn btn-outline-primary btn-sm ms-2"
							onClick={() => setErrorMessage('')}
						>
							<i className="bi bi-x"></i>
						</button>
					</div>
				</div>
			)}
			{infoMessage && (
				<div className="alert alert-info mx-3" role="alert">
					<div className="d-flex justify-content-between align-items-center">
						<span>{infoMessage}</span>
						<button
							className="btn btn-outline-primary btn-sm ms-2"
							onClick={() => setInfoMessage('')}
						>
							<i className="bi bi-x"></i>
						</button>
					</div>
				</div>
			)}
			<div className="px-3">
				{/* Form Component */}
				<div className="container-fluid mb-4">
					<Card>
						<Card.Header className="bg-primary text-white text-center py-3">
							<h4 className="mb-0">{editId ? "✏️ Cập nhật đại lý" : "➕ Tiếp nhận đại lý"}</h4>
						</Card.Header>
						<Card.Body className="p-4">
							<Form onSubmit={handleSubmit(handleFormSubmit)}>
								<div className="bg-light rounded p-4 mb-4">
									<h6 className="text-primary fw-semibold mb-3 border-bottom border-primary pb-2">Thông tin cơ bản</h6>

									{/* First row - 4 inputs */}
									<Row>
										<Col>
											<Form.Group>
												<Form.Label className="fw-medium mb-2">Mã đại lý</Form.Label>
												<Form.Control
													type="text"
													placeholder="Mã đại lý"
													value={editId || newId || ""}
													{...register("madaily")}
													readOnly />
												{errors.madaily && <div className="text-danger small mt-1">{errors.madaily.message}</div>}
											</Form.Group>
										</Col>
										<Col>

											<Form.Group>
												<Form.Label className="fw-medium mb-2">Tên đại lý</Form.Label>
												<Form.Control
													type="text"
													placeholder="Nhập tên đại lý"
													disabled={!isFormEnabled}
													{...register("tendaily", { required: "Tên đại lý là bắt buộc" })} />
												{errors.tendaily && <div className="text-danger small mt-1">{errors.tendaily.message}</div>}
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label className="fw-medium mb-2">Quận/Huyện</Form.Label>
												<Form.Select
													disabled={!isFormEnabled}
													{...register("maquan", { required: "Vui lòng chọn quận/huyện" })}
												>
													<option value="">Chọn quận/huyện</option>
													{dsQuan.map(q => (
														<option key={q.maquan} value={q.maquan}>
															{q.tenquan}
														</option>
													))}
												</Form.Select>
												{errors.maquan && <div className="text-danger small mt-1">{errors.maquan.message}</div>}
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label className="fw-medium mb-2">Loại đại lý</Form.Label>
												<Form.Select
													disabled={!isFormEnabled}
													{...register("maloaidaily", { required: "Vui lòng chọn loại đại lý" })}
												>
													<option value="">Chọn loại đại lý</option>
													{dsLoaiDaiLy.map(ldl => (
														<option key={ldl.maloaidaily} value={ldl.maloaidaily}>
															{ldl.tenloaidaily}
														</option>
													))}
												</Form.Select>
												{errors.maloaidaily && <div className="text-danger small mt-1">{errors.maloaidaily.message}</div>}
											</Form.Group>
										</Col>
									</Row>

									{/* Second row - 3 inputs */}
									<Row>
										<Col>
											<Form.Group>
												<Form.Label className="fw-medium mb-2">Số điện thoại</Form.Label>
												<Form.Control
													type="text"
													placeholder="Nhập số điện thoại"
													disabled={!isFormEnabled}
													{...register("sodienthoai", { required: "Số điện thoại là bắt buộc" })} />
												{errors.sodienthoai && <div className="text-danger small mt-1">{errors.sodienthoai.message}</div>}
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label className="fw-medium mb-2">Email</Form.Label>
												<Form.Control
													type="email"
													placeholder="Nhập email"
													disabled={!isFormEnabled}
													{...register("email", { required: "Email là bắt buộc" })} />
												{errors.email && <div className="text-danger small mt-1">{errors.email.message}</div>}
											</Form.Group>
										</Col>
										<Col>
											<Form.Group>
												<Form.Label className="fw-medium mb-2">Ngày tiếp nhận</Form.Label>
												<Form.Control
													type="date"
													disabled={!isFormEnabled}
													{...register("ngaytiepnhan", { required: "Ngày tiếp nhận là bắt buộc" })}
												/>
												{errors.ngaytiepnhan && <div className="text-danger small mt-1">{errors.ngaytiepnhan.message}</div>}
											</Form.Group>
										</Col>
									</Row>
									<Row>
										<Col>
											<Form.Group>
												<Form.Label className="fw-medium mb-2">Địa chỉ</Form.Label>
												<Form.Control
													type="text"
													placeholder="Nhập địa chỉ"
													disabled={!isFormEnabled}
													{...register("diachi", { required: "Địa chỉ là bắt buộc" })} />
												{errors.diachi && <div className="text-danger small mt-1">{errors.diachi.message}</div>}
											</Form.Group>
										</Col>
									</Row>
								</div>

								<div className="d-flex flex-wrap gap-2 justify-content-center pt-3 border-top">

									<Button
										type="submit"
										variant="primary"
										disabled={!isFormEnabled}
										className="px-4"
									>
										{editId ? "💾 Cập nhật đại lý" : "➕ Tiếp nhận đại lý"}
									</Button>
									<Button
										type="button"
										variant="outline-secondary"
										onClick={getnewId}
									>
										🆕 Đại lý mới
									</Button>
									<Button
										type="button"
										variant="outline-primary"
										onClick={handleShowSearchModal}
										className="px-4"
									>
										🔍 Tìm đại lý
									</Button>
									<Button
										type="button"
										variant="outline-secondary"
										onClick={resetForm}
										disabled={!isFormEnabled}
										className="px-4"
									>
										🗑️ Hủy
									</Button>
									<Button
										type="button"
										variant="outline-secondary"
										onClick={handleExitToHome}
										className="px-4"
									>
										❌ Thoát
									</Button>
								</div>
							</Form>
						</Card.Body>
					</Card>
				</div>

				{/* Table Component */}
				<div className="container-fluid mt-4">
					<Card>
						<Card.Header className="bg-primary text-white py-3">
							<h5 className="mb-0 text-white">Danh sách đại lý</h5>
						</Card.Header>
						<Card.Body className="p-3">
							<DataTable
								data={dsDaiLy}
								columns={columns}
								pageSize={10}
								searchable={true}
								sortable={true}
								refreshable={true}
								onRefresh={handleRefresh}
								refreshButtonText="Làm mới dữ liệu"
								refreshButtonIcon="bi bi-arrow-clockwise"
							/>
						</Card.Body>
					</Card>
				</div>
			</div>

			{/* Search Modal */}
			<Modal
				show={showSearchModal}
				onHide={handleCloseSearchModal}
				size="xl"
				fullscreen="lg-down"
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton className="bg-primary text-white">
					<Modal.Title>🔍 Tìm kiếm đại lý</Modal.Title>
				</Modal.Header>
				<Modal.Body className="p-0">
					<TimKiemDaiLy
						isModal={true}
						onSelect={handleSelectFromSearch}
						onClose={handleCloseSearchModal}
					/>
				</Modal.Body>
			</Modal>
		</div >
	);
}
