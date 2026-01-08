import { createPortal } from "react-dom"; 
import DeleteIcon from '../../assets/icons/Delete-red-icon.svg?react';
import CrossIcon from '../../assets/icons/Cross-icon.svg?react';

const DeleteChat = ({
    isOpen,
    title,
    message,
    onCancel,
    onConfirm,
    confirmText = "Delete",
    cancelText = "Cancel"
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-105 shadow-2xl overflow-hidden border border-bordercolor py-3 mx-4">
                
                <div className="flex justify-between items-center p-4 border-b border-bordercolor">
                    <h3 className="text-lg font-medium text-primarytext">{title}</h3>
                    <button className='cursor-pointer' onClick={onCancel}>
                        <CrossIcon />
                    </button>
                </div>

                <div className="flex flex-col items-center p-6 gap-4">
                    <DeleteIcon />
                    <p className="text-lg font-medium text-primarytext text-center px-6">{message}</p>
                </div>

                
                <div className="flex justify-center gap-4 p-4 border-t border-bordercolor">
                    <button
                        onClick={onCancel}
                        className="bg-white w-full text-warning border font-semibold text-sm border-borderwarning p-2.5 rounded-full hover:bg-gray-50 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-warning w-full font-semibold text-base text-white p-2.5 rounded-full border text-center border-borderwarning hover:opacity-90 cursor-pointer"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body 
    );
}

export default DeleteChat;