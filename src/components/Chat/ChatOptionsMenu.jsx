import { useEffect, useRef, useState } from "react";
import DeleteIcon from '../../assets/icons/Delete-icon.svg?react';
import Newchatlogo from '../../assets/icons/New-chat.svg?react';
import ThreeDotIcoon from '../../assets/icons/3-dot.svg?react';
import DeleteChat from "./DeleteChat";

const ChatOptionsMenu = ({ onRename, onDelete, index, setMenuIndex }) => {
    const menuButtonRef = useRef(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const menuRef = useRef(null);
    const [openmenu, setOpenmenu] = useState(false);
    const [menuPosition, setmenuPosition] = useState({
        top: 0,
        left: 0
    });

    const handleopenmenu = (e, index) => {
        setMenuIndex(index);
        if (!e.currentTarget) return;

        menuButtonRef.current = e.currentTarget;
        const rect = e.currentTarget.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const menuHeight = 105; 

        const isNearBottom = (windowHeight - rect.bottom) < menuHeight;

        setmenuPosition({
            top: isNearBottom ? rect.top - 180 : rect.top - 45,
            left: rect.left + 5
        });

        setOpenmenu(true);
    };

    useEffect(() => {


        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !menuButtonRef.current?.contains(e.target)
            ) {
                setOpenmenu(false);
                setMenuIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    const handleRenameClick = () => {
        onRename();        
        setOpenmenu(false); 
        setMenuIndex(null); 
    };

    return (
        <>

            <button
                onClick={(e) => handleopenmenu(e, index)}
                className="p-1 opacity-0 group-hover:opacity-100 cursor-pointer"
            >
                <ThreeDotIcoon />
            </button>

            {openmenu && (
                <div
                    className="w-44 py-2.5 pr-2.75 pl-2.25 z-50 h-24.5 bg-white border border-bordercolor rounded-xl shadow-lg"
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                    }}
                >
                    <button
                        onClick={handleRenameClick}
                        className="w-full flex items-center gap-3 px-5 py-2 text-sm text-primarytext hover:bg-secondarybtn cursor-pointer rounded-lg"
                    >
                        <Newchatlogo className="shrink-0" />
                        <span>Rename</span>
                    </button>

                    <button
                        onClick={() => {
                            setConfirmOpen(true);
                            setOpenmenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-2 text-sm text-primarytext hover:bg-secondarybtn cursor-pointer rounded-lg"
                    >
                        <DeleteIcon className="shrink-0" />
                        <span>Delete</span>
                    </button>
                </div>
            )}

            <DeleteChat
                isOpen={confirmOpen}
                title="Delete Chat"
                message="Are you sure you want to Delete this chat?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => { onDelete(); setConfirmOpen(false); }}
                confirmText="Yes, Delete"
            />

        </>
    );
};

export default ChatOptionsMenu;
