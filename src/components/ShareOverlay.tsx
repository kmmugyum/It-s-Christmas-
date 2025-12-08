import './ShareOverlay.css';
import modalBackground from '../assets/modal_background.png';
import kakaoIcon from '../assets/kakao_icon.png';
import instagramIcon from '../assets/instagram_icon.png';

interface ShareOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShareOverlay({ isOpen, onClose }: ShareOverlayProps) {
    if (!isOpen) return null;

    const handleCopyLink = async () => {
        const url = window.location.href;

        try {
            // 먼저 Clipboard API 시도
            await navigator.clipboard.writeText(url);
            alert('링크가 복사되었습니다!');
        } catch {
            // Fallback: 구식 방법 사용 (HTTP에서도 작동)
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                alert('링크가 복사되었습니다!');
            } catch {
                // 모든 방법 실패 시 수동 복사 안내
                prompt('아래 링크를 복사하세요:', url);
            }

            document.body.removeChild(textArea);
        }
    };

    const handleKakaoShare = () => {
        // 카카오톡 공유 URL
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent('🎄 내 크리스마스 트리에 캐롤을 남겨주세요!');
        const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${shareUrl}&text=${shareText}`;
        window.open(kakaoShareUrl, '_blank', 'width=600,height=400');
    };

    const handleInstagramShare = () => {
        // 모바일에서는 Web Share API 사용
        if (navigator.share) {
            navigator.share({
                title: '🎄 내 크리스마스 트리',
                text: '내 크리스마스 트리에 캐롤을 남겨주세요!',
                url: window.location.href,
            });
        } else {
            // 데스크톱에서는 인스타그램 홈페이지로 이동
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
                        <button className="share-option link-option" onClick={handleCopyLink}>
                            <svg className="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            링크 복사
                        </button>
                        <button className="share-option kakao-option" onClick={handleKakaoShare}>
                            <img src={kakaoIcon} alt="KakaoTalk" className="share-icon-img" />
                            카카오톡
                        </button>
                        <button className="share-option instagram-option" onClick={handleInstagramShare}>
                            <img src={instagramIcon} alt="Instagram" className="share-icon-img" />
                            인스타그램
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
