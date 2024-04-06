import React from 'react'

const DeleteConfirm = ({ show, onClose, onConfirm }) => {
    const deleteStyle = {
        display: show ? 'block' : 'none'
    };

  return (
    <div className="delete" style={deleteStyle}>
        <div className='delete-content'>
            <p>Bạn có chắc muốn xóa?</p>
            <button onClick={onConfirm}>Đồng ý</button>
            <button onClick={onClose}>Hủy</button>
        </div>
    </div>
  );
};

export default DeleteConfirm;