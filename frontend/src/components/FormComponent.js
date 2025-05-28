import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Card } from "react-bootstrap";
import "../styles/FormComponent.css";

export const FormComponent = ({ selectedDaily, onSubmit, dsQuan, dsLoaiDaiLy, resetTrigger, getLatestId }) => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [editId, setEditId] = useState(null);
    const [newId, setNewId] = useState(null);
    const [cachedNextId, setCachedNextId] = useState(null);

    // Load cached ID from localStorage on component mount
    useEffect(() => {
        const storedId = localStorage.getItem('cachedDailyId');
        if (storedId) {
            setCachedNextId(storedId);
            console.log("Loaded cached ID from localStorage:", storedId);
        }
    }, []);

    // Save cachedNextId to localStorage whenever it changes
    useEffect(() => {
        if (cachedNextId) {
            localStorage.setItem('cachedDailyId', cachedNextId);
            console.log("Saved ID to localStorage:", cachedNextId);
        }
    }, [cachedNextId]);

    useEffect(() => {
        if (selectedDaily) {
            // Set form values for editing
            setValue("tendaily", selectedDaily.tendaily);
            setValue("diachi", selectedDaily.diachi);
            setValue("sodienthoai", selectedDaily.sodienthoai);
            setValue("email", selectedDaily.email);
            setValue("maquan", selectedDaily.maquan);
            setValue("maloaidaily", selectedDaily.maloaidaily);
            
            // Format the date properly for the date input
            let formattedDate;
            if (selectedDaily.ngaytiepnhan) {
                // Handle different date formats
                const date = new Date(selectedDaily.ngaytiepnhan);
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                }
            }
            
            setValue("ngaytiepnhan", formattedDate || new Date().toISOString().split("T")[0]);

            // Make sure to store the ID - handle both madaily and maDaiLy formats
            const dailyId = selectedDaily.madaily || selectedDaily.maDaiLy;
            setEditId(dailyId);
            setNewId(null);
        }
        else {
            // Don't auto-fetch ID anymore, wait for button click
            setEditId(null);
            
            // Reset other fields
            setValue("tendaily", "");
            setValue("diachi", "");
            setValue("sodienthoai", "");
            setValue("email", "");
            setValue("maquan", "");
            setValue("maloaidaily", "");
            setValue("ngaytiepnhan", new Date().toISOString().split("T")[0]); // Set today's date explicitly
        }
    }, [selectedDaily, setValue]);

    const resetForm = useCallback(() => {
        reset();
        setEditId(null);
        setNewId(null); // Reset ID, don't auto-fetch
        
        // Reset other fields
        setValue("tendaily", "");
        setValue("diachi", "");
        setValue("sodienthoai", "");
        setValue("email", "");
        setValue("maquan", "");
        setValue("maloaidaily", "");
        setValue("ngaytiepnhan", new Date().toISOString().split("T")[0]); // Set default date when resetting
    }, [reset, setValue]);

    // Listen for reset trigger from parent
    useEffect(() => {
        if (resetTrigger > 0) {
            resetForm();
        }
    }, [resetTrigger, resetForm]);

    // Modified getnewId function to use cached ID without fetching a new one
    const getnewId = async () => {
        try {
            // Reset form first to clear any existing data
            resetForm();
            
            if (cachedNextId) {
                // Use the cached ID if available
                setNewId(cachedNextId);
                setValue("madaily", cachedNextId);
                // Don't fetch a new ID here
            } else {
                // If no cached ID (first time), fetch it now
                const nextId = await getLatestId();
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

    const submitHandler = (data) => {
        // Find the objects for display purposes
        const selectedQuan = dsQuan.find(q => q.maquan === data.maquan);
        const selectedLoaiDaiLy = dsLoaiDaiLy.find(l => l.maloaidaily === data.maloaidaily);

        // Create payload to send to API
        const payload = {
            madaily: editId || newId, // Use editId for updates, newId for new entries
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

        // Pass a callback function to get notified of successful operations
        onSubmit(payload, async (success) => {
            // Only fetch a new ID if the operation was successful
            if (success) {
                try {
                    const nextId = await getLatestId();
                    if (nextId) {
                        setCachedNextId(nextId);
                        console.log("Updated cached ID after successful operation:", nextId);
                        // localStorage is updated automatically via the useEffect
                    }
                } catch (error) {
                    console.error("Error fetching next ID after successful operation:", error);
                }
            }
        });
    };

    // Check if form should be enabled (when we have an ID)
    const isFormEnabled = Boolean(editId || newId);    return (
        <div className="form-component">
            <Card>
                <Card.Header>
                    <h4>{editId ? "✏️ Cập nhật đại lý" : "➕ Tiếp nhận đại lý"}</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit(submitHandler)}>
                        <div className="form-layout">
                            <div className="form-section">
                                <h6>Thông tin cơ bản</h6>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mã đại lý</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Mã đại lý"
                                                value={editId || newId || ""}
                                                readOnly />
                                            {errors.madaily && <span className="text-danger">{errors.madaily.message}</span>}
                                        </Form.Group>
                                    </div>                                    <div className="form-field">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tên đại lý</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập tên đại lý"
                                                disabled={!isFormEnabled}
                                                {...register("tendaily", { required: "Tên đại lý là bắt buộc" })} />
                                            {errors.tendaily && <span className="text-danger">{errors.tendaily.message}</span>}
                                        </Form.Group>
                                    </div>
                                    <div className="form-field">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Loại đại lý</Form.Label>
                                            <Form.Select
                                                disabled={!isFormEnabled}
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
                                    <div className="form-field">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Quận</Form.Label>
                                            <Form.Select
                                                disabled={!isFormEnabled}
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
                            </div>

                            <div className="form-section">
                                <h6>Thông tin liên hệ</h6>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Số điện thoại</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập số điện thoại"
                                                disabled={!isFormEnabled}
                                                {...register("sodienthoai", { required: "Số điện thoại là bắt buộc" })} />
                                            {errors.sodienthoai && <span className="text-danger">{errors.sodienthoai.message}</span>}
                                        </Form.Group>
                                    </div>
                                    <div className="form-field">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Nhập email"
                                                disabled={!isFormEnabled}
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
                                    <div className="form-field">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ngày tiếp nhận</Form.Label>
                                            <Form.Control
                                                type="date"
                                                disabled={!isFormEnabled}
                                                {...register("ngaytiepnhan", { required: "Ngày tiếp nhận là bắt buộc" })} />
                                            {errors.ngaytiepnhan && <span className="text-danger">{errors.ngaytiepnhan.message}</span>}
                                        </Form.Group>
                                    </div>
                                    <div className="form-field form-field-full">
                                        <Form.Group className="mb-3">
                                            <Form.Label>Địa chỉ</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập địa chỉ"
                                                disabled={!isFormEnabled}
                                                {...register("diachi", { required: "Địa chỉ là bắt buộc" })} />
                                            {errors.diachi && <span className="text-danger">{errors.diachi.message}</span>}
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>

                            <div className="form-buttons">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={!isFormEnabled}
                                >
                                    {editId ? "💾 Cập nhật đại lý" : "➕ Tiếp nhận đại lý"}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={getnewId}
                                >
                                    🆕 Đại lý mới
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline-secondary" 
                                    onClick={resetForm}
                                    disabled={!isFormEnabled}
                                >
                                    🗑️ Hủy
                                </Button>
                            </div>                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};