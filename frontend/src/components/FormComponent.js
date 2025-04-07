import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import "../styles/FormComponent.css";

export const FormComponent = ({ selectedDaily, onSubmit, dsQuan, dsLoaiDaiLy, nextDailyId }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [editId, setEditId] = useState(null);
    const [newId, setNewId] = useState(null);

    useEffect(() => {
        if (selectedDaily) {
            // Set form values for editing
            setValue("tendaily", selectedDaily.tendaily);
            setValue("diachi", selectedDaily.diachi);
            setValue("sodienthoai", selectedDaily.sodienthoai);
            setValue("email", selectedDaily.email);
            setValue("maquan", selectedDaily.maquan);
            setValue("maloaidaily", selectedDaily.maloaidaily);

            // Make sure to store the ID
            setEditId(selectedDaily.madaily);
            setNewId(null);
        }
        else {
            // Use the ID from ID-tracker or generate a UUID as fallback
            setNewId(nextDailyId || uuidv4());
            setEditId(null);
            setValue("madaily", nextDailyId || uuidv4());
            
            // Reset other fields
            setValue("tendaily", "");
            setValue("diachi", "");
            setValue("sodienthoai", "");
            setValue("email", "");
            setValue("maquan", "");
            setValue("maloaidaily", "");
        }
    }, [selectedDaily, setValue, nextDailyId]);

    const submitHandler = (data) => {
        // Find the objects for display purposes
        const selectedQuan = dsQuan.find(q => q.maquan === data.maquan);
        const selectedLoaiDaiLy = dsLoaiDaiLy.find(l => l.maloaidaily === data.maloaidaily);

        // Create payload to send to API
        const payload = {
            madaily: editId || newId || nextDailyId || uuidv4(), // Use editId for updates, newId or nextDailyId for new entries
            tendaily: data.tendaily,
            diachi: data.diachi,
            sodienthoai: data.sodienthoai,
            email: data.email,
            maquan: data.maquan,
            maloaidaily: data.maloaidaily,
            ngaytiepnhan: data.ngaytiepnhan || new Date().toISOString().split("T")[0], // Default to today if not provided
            // Extra info for display
            tenquan: selectedQuan?.tenquan,
            tenloaidaily: selectedLoaiDaiLy?.tenloaidaily
        };

        onSubmit(payload);
        resetForm();
    };

    const resetForm = () => {
        reset();
        setEditId(null);
        // Set to next ID from tracker when resetting
        setNewId(nextDailyId || uuidv4());
        setValue("madaily", nextDailyId || uuidv4());
    };

    return (
        <>
            <Card>
                <Card.Header>{editId ? "Cập nhật đại lý" : "Tiếp nhận đại lý"}</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit(submitHandler)}>
                        <section className="form-layout">
                            <div className="header">
                            <div className="left">
                                <Form.Group className="mb-3">
                                    <Form.Label>Mã đại lý</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Mã đại lý"
                                        value={editId || newId || ""}
                                        readOnly />
                                    {errors.madaily && <span className="text-danger">{errors.madaily.message}</span>}
                                </Form.Group>
                            </div>
                            <div className="leftcenter">
                                <Form.Group className="mb-3">
                                    <Form.Label>Tên đại lý</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên đại lý"
                                        {...register("tendaily", { required: "Tên đại lý là bắt buộc" })} />
                                    {errors.tendaily && <span className="text-danger">{errors.tendaily.message}</span>}
                                </Form.Group>
                            </div>
                            <div className="rightcenter">
                                <Form.Group className="mb-3">
                                    <Form.Label>Loại đại lý</Form.Label>
                                    <Form.Select
                                        {...register("maloaidaily", { required: "Loại đại lý là bắt buộc" })}>
                                        <option value="">-- Chọn Loại đại lý --</option>
                                        {dsLoaiDaiLy.map((loai) => (
                                            <option key={loai.maloaidaily} value={loai.maloaidaily}>
                                                {loai.tenloaidaily}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.maloaidaily && <span className="text-danger">{errors.maloaidaily.message}</span>}
                                </Form.Group>
                            </div>
                            <div className="right">
                                <Form.Group className="mb-3">
                                    <Form.Label>Quận</Form.Label>
                                    <Form.Select
                                        {...register("maquan", { required: "Quận là bắt buộc" })}>
                                        <option value="">-- Chọn Quận --</option>
                                        {dsQuan.map((quan) => (
                                            <option key={quan.maquan} value={quan.maquan}>
                                                {quan.tenquan}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.maquan && <span className="text-danger">{errors.maquan.message}</span>}
                                </Form.Group>
                            </div>
                            </div>
                            <div className="body">
                                <div className="left">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            {...register("sodienthoai", { required: "Số điện thoại là bắt buộc" })} />
                                        {errors.sodienthoai && <span className="text-danger">{errors.sodienthoai.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="center">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Nhập email"
                                            {...register("email", {
                                                required: "Email là bắt buộc",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Email không hợp lệ"
                                                }
                                            })} />
                                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="right">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày tiếp nhận</Form.Label>
                                        <Form.Control
                                            type="date"
                                            defaultValue={new Date().toISOString().split("T")[0]}
                                            {...register("ngaytiepnhan", { required: "Ngày tiếp nhận là bắt buộc" })} />
                                        {errors.ngaytiepnhan && <span className="text-danger">{errors.ngaytiepnhan.message}</span>}
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="footer">
                                <Form.Group className="mb-3">
                                    <Form.Label>Địa chỉ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập địa chỉ"
                                        {...register("diachi", { required: "Địa chỉ là bắt buộc" })} />
                                    {errors.diachi && <span className="text-danger">{errors.diachi.message}</span>}
                                </Form.Group>
                            </div>
                        </section>
                        <div className="d-flex justify-content-between">
                            <Button type="submit" variant="primary" className="mt-3">
                                {editId ? "Cập nhật đại lý" : "Tiếp nhận đại lý"}
                            </Button>
                            <Button type="button" variant="secondary" className="mt-3" onClick={resetForm}>
                                Hủy
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
};