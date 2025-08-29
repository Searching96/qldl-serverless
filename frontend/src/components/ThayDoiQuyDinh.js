import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getLastThamSo, updateThamSo } from '../services/api';

export const ThayDoiQuyDinh = () => {
	const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
	const navigate = useNavigate();

	const [parameters, setParameters] = useState({
		soluongdailytoida: null,
		quydinhtienthutienno: null
	});
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [showSuccess, setShowSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [showError, setShowError] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		fetchParameters();
	}, []);

	useEffect(() => {
		// Set form values when parameters are loaded
		setValue("soluongdailytoida", parameters.soluongdailytoida);
		setValue("quydinhtienthutienno", parameters.quydinhtienthutienno);
	}, [parameters, setValue]);

	const fetchParameters = async () => {
		setLoading(true);
		try {
			const data = await getLastThamSo();
			if (data) {
				setParameters({
					soluongdailytoida: data.soluongdailytoida,
					quydinhtienthutienno: data.quydinhtienthutienno
				});
				console.log('Loaded parameters:', data);
			} else {
				// No parameters found - show appropriate message
				setErrorMessage('Chưa có tham số nào được thiết lập trong hệ thống. Vui lòng liên hệ quản trị viên.');
				setShowError(true);
				setTimeout(() => {
					setShowError(false);
				}, 8000);
			}
		} catch (error) {
			console.error('Error fetching parameters:', error);
			setErrorMessage('Không thể tải thông tin quy định: ' + error.message);
			setShowError(true);

			setTimeout(() => {
				setShowError(false);
			}, 8000);
		} finally {
			setLoading(false);
		}
	};

	const handleParameterChange = (field, value) => {
		setHasChanges(true);
		setValue(field, value);
	};

	const submitHandler = async (data) => {
		setLoading(true);
		try {
			// Validate data
			const soluongdailytoida = parseInt(data.soluongdailytoida);
			const quydinhtienthutienno = parseInt(data.quydinhtienthutienno);

			if (soluongdailytoida < 1 || soluongdailytoida > 100) {
				throw new Error('Số lượng đại lý tối đa phải từ 1 đến 100');
			}

			if (![0, 1].includes(quydinhtienthutienno)) {
				throw new Error('Quy định tiền thu tiền nợ không hợp lệ');
			}

			const updateData = {
				soluongdailytoida,
				quydinhtienthutienno
			};

			console.log('Updating parameters:', updateData);

			const result = await updateThamSo(updateData);
			console.log('Update result:', result);

			setParameters(updateData);
			setHasChanges(false);
			setSuccessMessage('Cập nhật quy định thành công');
			setShowSuccess(true);

			setTimeout(() => {
				setShowSuccess(false);
			}, 5000);
		} catch (error) {
			console.error('Error updating parameters:', error);
			setErrorMessage('Không thể cập nhật quy định: ' + error.message);
			setShowError(true);

			setTimeout(() => {
				setShowError(false);
			}, 8000);
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setValue("soluongdailytoida", parameters.soluongdailytoida);
		setValue("quydinhtienthutienno", parameters.quydinhtienthutienno);
		setHasChanges(false);
	};

	const handleExitToHome = () => {
		if (hasChanges) {
			if (window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát?')) {
				navigate("/");
			}
		} else {
			navigate("/");
		}
	};

	return (
		<div className="container-fluid px-0 mt-4">
			<h1 className="ms-3">Thay đổi quy định</h1>

			{/* Alert messages */}
			{showSuccess && (
				<Alert variant="success" className="mx-3" dismissible onClose={() => setShowSuccess(false)}>
					{successMessage}
				</Alert>
			)}

			{showError && (
				<Alert variant="danger" className="mx-3" dismissible onClose={() => setShowError(false)}>
					<div style={{ whiteSpace: 'pre-line' }}>
						{errorMessage}
					</div>
				</Alert>
			)}

			<div className="px-3">
				<div className="container-fluid">
					<Card className="shadow">
						<Card.Header className="bg-primary text-white text-center py-3">
							<h4 className="mb-0">⚙️ Cấu hình tham số hệ thống</h4>
						</Card.Header>
						<Card.Body className="p-4">
							{loading && (
								<div className="text-center mb-3">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">Đang tải...</span>
									</div>
									<p className="mt-2 text-muted">Đang tải thông tin quy định...</p>
								</div>
							)}

							<Form onSubmit={handleSubmit(submitHandler)}>
								<div className="bg-light rounded p-4 mb-4">
									<h6 className="text-primary fw-semibold mb-3 border-bottom border-primary pb-2">Quy định về đại lý</h6>
									<Row className="mb-4">
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label className="fw-medium mb-2">
													Số lượng đại lý tối đa trong một quận
												</Form.Label>
												<Form.Control
													type="number"
													{...register("soluongdailytoida", {
														required: "Số lượng đại lý tối đa là bắt buộc",
														min: { value: 1, message: "Số lượng tối thiểu là 1" },
														max: { value: 100, message: "Số lượng tối đa là 100" }
													})}
													placeholder="Nhập số lượng đại lý tối đa"
													min="1"
													max="100"
													onChange={(e) => handleParameterChange("soluongdailytoida", e.target.value)}
												/>
												{errors.soluongdailytoida && (
													<span className="text-danger">{errors.soluongdailytoida.message}</span>
												)}
												<Form.Text className="text-muted">
													Quy định số lượng đại lý tối đa có thể tiếp nhận trong một quận (1-100)
												</Form.Text>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Alert variant="info" className="h-100 d-flex flex-column justify-content-center">
												<h6><i className="bi bi-info-circle"></i> Thông tin</h6>
												<p className="mb-1"><strong>Giá trị hiện tại:</strong> {parameters.soluongdailytoida || 'Chưa thiết lập'} đại lý/quận</p>
												<p className="mb-0">Tham số này ảnh hưởng đến việc tiếp nhận đại lý mới trong hệ thống.</p>
											</Alert>
										</Col>
									</Row>
								</div>

								<div className="bg-light rounded p-4 mb-4">
									<h6 className="text-primary fw-semibold mb-3 border-bottom border-primary pb-2">Quy định về thu tiền</h6>
									<Row className="mb-4">
										<Col md={6}>
											<Form.Group className="mb-3">
												<Form.Label className="fw-medium mb-2">
													Quy định về việc thu tiền nợ
												</Form.Label>
												<Form.Select
													{...register("quydinhtienthutienno", {
														required: "Quy định thu tiền nợ là bắt buộc"
													})}
													onChange={(e) => handleParameterChange("quydinhtienthutienno", e.target.value)}
												>
													<option value="">-- Chọn quy định --</option>
													<option value="1">Chỉ thu tiền không vượt quá số tiền nợ</option>
													<option value="0">Cho phép thu tiền vượt quá số tiền nợ</option>
												</Form.Select>
												{errors.quydinhtienthutienno && (
													<span className="text-danger">{errors.quydinhtienthutienno.message}</span>
												)}
												<Form.Text className="text-muted">
													Quy định về cách thu tiền từ đại lý khi có công nợ
												</Form.Text>
											</Form.Group>
										</Col>
										<Col md={6}>
											<Alert variant="warning" className="h-100 d-flex flex-column justify-content-center">
												<h6><i className="bi bi-exclamation-triangle"></i> Lưu ý</h6>
												<p className="mb-1">
													<strong>Quy định hiện tại:</strong>
													{parameters.quydinhtienthutienno === 1
														? " Chỉ thu tiền không vượt quá số tiền nợ"
														: parameters.quydinhtienthutienno === 0
															? " Cho phép thu tiền vượt quá số tiền nợ"
															: " Chưa thiết lập"
													}
												</p>
												<p className="mb-0">
													Thay đổi quy định này sẽ ảnh hưởng đến tất cả các giao dịch thu tiền trong tương lai.
												</p>
											</Alert>
										</Col>
									</Row>
								</div>

								<div className="d-flex flex-wrap gap-2 justify-content-center pt-3 border-top">
									<Button
										type="submit"
										variant="primary"
										disabled={loading || !hasChanges}
										className="px-4"
									>
										{loading ? 'Đang cập nhật...' : '💾 Lưu thay đổi'}
									</Button>
									<Button
										type="button"
										variant="outline-secondary"
										onClick={handleReset}
										disabled={loading || !hasChanges}
										className="px-4"
									>
										🔄 Khôi phục
									</Button>
									<Button
										type="button"
										variant="outline-secondary"
										onClick={fetchParameters}
										disabled={loading}
										className="px-4"
									>
										🔃 Tải lại
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
			</div>
		</div>
	);
};
