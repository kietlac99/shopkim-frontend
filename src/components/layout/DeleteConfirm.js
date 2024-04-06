import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirm = ({ show, onClose, onConfirm, deleteType }) => {
  return (
    <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa {deleteType} này?</Modal.Body>
        <Modal.Footer>
            <Button varriant="secondary" onClick={onClose}>
                Hủy
            </Button>
            <Button variant='primary' onClick={onConfirm}>
                Đồng ý
            </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirm;