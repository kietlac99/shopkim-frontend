import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Confirm = ({ show, onClose, onConfirm, confirmType, type }) => {
  return (
    <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Xác nhận {confirmType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn {confirmType} {type} này?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Hủy
            </Button>
            <Button variant='primary' onClick={onConfirm}>
                Đồng ý
            </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default Confirm;