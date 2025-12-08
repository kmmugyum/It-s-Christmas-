import './CreateTreePromptModal.css';
import modalBackground from '../assets/modal_background.png';

interface CreateTreePromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTree: () => void;
}

export function CreateTreePromptModal({ isOpen, onClose, onCreateTree }: CreateTreePromptModalProps) {
    if (!isOpen) return null;

    return (
        <div className="prompt-modal-overlay" onClick={onClose}>
            <div className="prompt-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Background */}
                <img
                    src={modalBackground}
                    alt=""
                    className="prompt-modal-bg"
                />

                {/* X Close Button */}
                <button className="prompt-close-button" onClick={onClose}>
                    x
                </button>

                <div className="prompt-modal-content">
                    {/* Success Icon */}
                    <div className="prompt-success-icon">🎄✨</div>

                    {/* Message */}
                    <h2 className="prompt-title">
                        아이콘이 설정되었어요!
                    </h2>

                    <p className="prompt-question">
                        혹시 본인의 트리는 없나요?
                    </p>

                    {/* Create Tree Button */}
                    <button className="prompt-create-button" onClick={onCreateTree}>
                        나도 생성하러 가기 🎁
                    </button>

                    {/* Skip Button */}
                    <button className="prompt-skip-button" onClick={onClose}>
                        괜찮아요
                    </button>
                </div>
            </div>
        </div>
    );
}
