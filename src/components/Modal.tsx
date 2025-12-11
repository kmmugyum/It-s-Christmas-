import './Modal.css';
import modalBackground from '../assets/modal_background.png';
import xmas20 from '../assets/xmas20.png';
import xmas85 from '../assets/xmas85.png';

interface ModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    message?: string;
}

export function Modal({ isOpen, onConfirm, message }: ModalProps) {
    if (!isOpen) return null;

    const defaultMessage = "친구에게\n크리스마스 캐롤과 메시지로\n마음을 전해보세요!";

    return (
        <div className="modal-overlay" onClick={onConfirm}>
            <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="modal-container">
                    {/* Background Image */}
                    <img
                        src={modalBackground}
                        alt=""
                        className="modal-background"
                    />

                    {/* Content */}
                    <div className="modal-content">
                        <p className="modal-text">
                            {message || defaultMessage}
                        </p>
                    </div>

                    {/* Small Decoration - Top Right */}
                    <img
                        src={xmas20}
                        alt=""
                        className="xmas-decoration-small"
                    />

                    {/* Large Decoration - Bottom Left */}
                    <img
                        src={xmas85}
                        alt=""
                        className="xmas-decoration-large"
                    />

                    {/* Confirm Button */}
                    <div className="modal-button-container">
                        <button className="modal-button" onClick={onConfirm}>
                            <span className="modal-button-text">확인</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
