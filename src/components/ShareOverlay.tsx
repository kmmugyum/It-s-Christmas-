import './ShareOverlay.css';
import modalBackground from '../assets/modal_background.png';
import instagramIcon from '../assets/instagram_icon.png';

interface ShareOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    treeId?: string;
    secretKey?: string;
}

export function ShareOverlay({ isOpen, onClose, treeId, secretKey }: ShareOverlayProps) {
    if (!isOpen) return null;

    // 기본 URL (트리 ID가 없으면 현재 URL 사용)
    const baseUrl = window.location.origin;

    // 방문자용 URL (공개)
    const visitorUrl = treeId ? `${baseUrl}/tree/${treeId}` : window.location.href;

    // 관리자용 URL (비밀)
    const adminUrl = treeId && secretKey ? `${baseUrl}/admin/${treeId}/${secretKey}` : window.location.href;

    const handleCopyVisitorLink = async () => {
        try {
            await navigator.clipboard.writeText(visitorUrl);
            alert('방문자 링크가 복사되었습니다! 친구들에게 공유하세요 🎄');
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = visitorUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                alert('방문자 링크가 복사되었습니다! 친구들에게 공유하세요 🎄');
            } catch {
                prompt('아래 링크를 복사하세요:', visitorUrl);
            }

            document.body.removeChild(textArea);
        }
    };

    const handleCopyAdminLink = async () => {
        try {
            await navigator.clipboard.writeText(adminUrl);
            alert('관리자 링크가 복사되었습니다!\n⚠️ 이 링크는 본인만 보관하세요!');
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = adminUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                alert('관리자 링크가 복사되었습니다!\n⚠️ 이 링크는 본인만 보관하세요!');
            } catch {
                prompt('아래 링크를 복사하세요:', adminUrl);
            }

            document.body.removeChild(textArea);
        }
    };

    const handleInstagramShare = () => {
        if (navigator.share) {
            navigator.share({
                title: '🎄 내 크리스마스 트리',
                text: '내 크리스마스 트리에 캐롤을 남겨주세요!',
                url: visitorUrl,
            });
        } else {
            window.open('https://www.instagram.com/', '_blank');
        }
    };

    return (
        <div className="share-overlay" onClick={onClose}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Background Image */}
                <img
                    src={modalBackground}
                    alt=""
                    className="share-modal-bg"
                />

                {/* X Close Button */}
                <button className="close-x-button" onClick={onClose}>
                    x
                </button>

                <div className="share-modal-content">
                    <h2 className="share-title">나만의 트리 링크를 {"\n"} SNS에 공유하여 {"\n"} 캐롤과 편지를 나누세요!</h2>

                    <div className="share-buttons">
                        {/* 방문자 링크 복사 */}
                        <button className="share-option link-option" onClick={handleCopyVisitorLink}>
                            <svg className="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            공유 링크 복사
                        </button>

                        {/* 관리자 링크 복사 (비밀) */}
                        {secretKey && (
                            <>
                                <button className="share-option admin-link-option" onClick={handleCopyAdminLink}>
                                    <svg className="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    관리자 링크 (보관용)
                                </button>
                                <p className="admin-link-warning">
                                    관리자 링크를 잃어버리면{"\n"}소중한 편지를 읽을 수 없어요 ㅠㅠ{"\n"}꼭 보관하세요 !!
                                </p>
                            </>
                        )}
                        <button className="share-option instagram-option" onClick={handleInstagramShare}>
                            <img src={instagramIcon} alt="Instagram" className="share-icon-img" />
                            인스타그램 공유하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
