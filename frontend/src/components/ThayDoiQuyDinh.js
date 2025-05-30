import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../styles/FormComponent.css";
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
                <div className="alert alert-success mx-3" role="alert">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>{successMessage}</span>
                        <button
                            className="btn btn-outline-primary btn-sm ms-2"
                            onClick={() => setShowSuccess(false)}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            )}

            {showError && (
                <div className="alert alert-danger mx-3" role="alert">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>{errorMessage}</span>
                        <button
                            className="btn btn-outline-primary btn-sm ms-2"
                            onClick={() => setShowError(false)}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className="px-3">
                <div className="form-component">
                    <Card>
                        <Card.Header>
                            <h4>⚙️ Cấu hình tham số hệ thống</h4>
                        </Card.Header>
                        <Card.Body>
                            {loading && (
                                <div className="text-center mb-3">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Đang tải...</span>
                                    </div>
                                    <p className="mt-2 text-muted">Đang tải thông tin quy định...</p>
                                </div>
                            )}

                            <Form onSubmit={handleSubmit(submitHandler)}>
                                <div className="form-layout">
                                    <div className="form-section">
                                        <h6>Quy định về đại lý</h6>
                                        <Row className="mb-4">
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        <strong>Số lượng đại lý tối đa trong một quận</strong>
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
                                                <div className="alert alert-info">
                                                    <h6><i className="bi bi-info-circle"></i> Thông tin</h6>
                                                    <p className="mb-1"><strong>Giá trị hiện tại:</strong> {parameters.soluongdailytoida || 'Chưa thiết lập'} đại lý/quận</p>
                                                    <p className="mb-0">Tham số này ảnh hưởng đến việc tiếp nhận đại lý mới trong hệ thống.</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="form-section">
                                        <h6>Quy định về thu tiền</h6>
                                        <Row className="mb-4">
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>
                                                        <strong>Quy định về việc thu tiền nợ</strong>
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
                                                <div className="alert alert-warning">
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
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                                <div className="form-buttons">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={loading || !hasChanges}
                                    >
                                        {loading ? 'Đang cập nhật...' : '💾 Lưu thay đổi'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={handleReset}
                                        disabled={loading || !hasChanges}
                                    >
                                        🔄 Khôi phục
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={fetchParameters}
                                        disabled={loading}
                                    >
                                        🔃 Tải lại
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        onClick={handleExitToHome}
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
