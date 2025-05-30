import React from 'react';
import { Modal } from 'react-bootstrap';
import { TimKiemDaiLy } from './TimKiemDaiLy';

export const DaiLySelectionModal = ({ show, onHide, onSelect }) => {
    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="xl" 
            fullscreen="lg-down"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Body className="p-0">
                <TimKiemDaiLy 
                    isModal={true}
                    onSelect={onSelect}
                    onClose={onHide}
                />
            </Modal.Body>
        </Modal>
    );
};