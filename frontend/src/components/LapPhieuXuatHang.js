import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card } from "react-bootstrap";
import "../styles/FormComponent.css";
import { createPhieuXuat } from "../services/api.js"; // Adjust the import path as necessary

export const LapPhieuXuatHang = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = (data) => {
        console.log(data);
        createPhieuXuat(data)
            .then(response => {
                console.log("Phiếu xuất hàng đã được tạo thành công:", response);
                // Handle success, e.g., show a success message or redirect
            })
            .catch(error => {
                console.error("Lỗi khi tạo phiếu xuất hàng:", error);
                // Handle error, e.g., show an error message
            });
    };

    return (
        <div className="container-fluid px-0 mt-4">
            <h1 className="ms-3">Lập phiếu xuất hàng</h1>
            
            <div className="px-3">
                <Card className="mb-4">
                    <Card.Body>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mã phiếu xuất</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register("maphieuxuat", { required: "Mã phiếu xuất là bắt buộc" })}
                                            isInvalid={!!errors.maphieuxuat}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.maphieuxuat?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mã Đại Lý</Form.Label>
                                        <Form.Control
                                            type="text"
                                            {...register("madaily", { required: "Mã đại lý là bắt buộc" })}
                                            isInvalid={!!errors.madaily}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.madaily?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </div>
                            
                            <div className="d-flex gap-2">
                                <Button variant="primary" type="submit">
                                    Lưu
                                </Button>
                                <Button variant="secondary" type="button">
                                    Hủy
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}