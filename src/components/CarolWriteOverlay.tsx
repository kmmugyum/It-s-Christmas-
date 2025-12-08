import { useState } from 'react';
import './CarolWriteOverlay.css';
import modalBackground from '../assets/modal_background.png';
import { IconSelectModal } from './IconSelectModal';

interface CarolWriteOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onIconSelected?: (iconId: string, letter: string, youtubeUrl: string) => void;
}

// 유튜브 비디오 정보 타입 (추후 백엔드 연동)
interface YouTubeVideoInfo {
    title: string;
    thumbnail: string;
}

export function CarolWriteOverlay({ isOpen, onClose, onIconSelected }: CarolWriteOverlayProps) {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [letter, setLetter] = useState('');
    const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    if (!isOpen) return null;

    // 유튜브 URL 변경 시 처리
    const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setYoutubeUrl(url);

        // 유튜브 URL 패턴 체크
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

        if (youtubeRegex.test(url)) {
            // TODO: 백엔드 API 호출하여 실제 정보 가져오기
            setIsLoading(true);

            // 임시 스켈레톤 표시 (1초 후 가짜 데이터)
            setTimeout(() => {
                setVideoInfo({
                    title: '노래 제목이 여기에 표시됩니다',
                    thumbnail: '' // 실제 썸네일 URL (백엔드에서 가져올 예정)
                });
                setIsLoading(false);
            }, 1000);
        } else {
            setVideoInfo(null);
        }
    };

    const handleSubmit = () => {
        // 보내기 버튼 클릭 시 아이콘 선택 모달 열기
        setIsIconModalOpen(true);
    };

    const handleIconSelect = (iconId: string) => {
        // 아이콘 선택 완료 → 배치 모드로 전환
        if (onIconSelected) {
            onIconSelected(iconId, letter, youtubeUrl);
        }
        setIsIconModalOpen(false);
        // 입력 필드 초기화
        setYoutubeUrl('');
        setLetter('');
        setVideoInfo(null);
    };

    return (
        <>
            <div className="carol-overlay" onClick={onClose}>
                <div className="carol-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Modal Background Image */}
                    <img
                        src={modalBackground}
                        alt=""
                        className="carol-modal-bg"
                    />

                    {/* X Close Button */}
                    <button className="carol-close-button" onClick={onClose}>
                        x
                    </button>

                    <div className="carol-modal-content">

                        {/* 음악 추천 라벨 */}
                        <label className="carol-label">음악 추천</label>

                        {/* 유튜브 미리보기 영역 */}
                        <div className="youtube-preview-section">
                            {/* 좌측: 썸네일 이미지 */}
                            <div className="youtube-thumbnail">
                                {isLoading ? (
                                    <div className="thumbnail-skeleton" />
                                ) : videoInfo ? (
                                    videoInfo.thumbnail ? (
                                        <img src={videoInfo.thumbnail} alt="썸네일" className="thumbnail-image" />
                                    ) : (
                                        <div className="thumbnail-placeholder">
                                            <span>🎵</span>
                                        </div>
                                    )
                                ) : (
                                    <div className="thumbnail-empty">
                                        <span>노래</span>
                                        <span>이미지</span>
                                    </div>
                                )}
                            </div>

                            {/* 우측: 제목 + 링크 입력 */}
                            <div className="youtube-info">
                                {/* 제목 */}
                                <div className="youtube-title">
                                    {isLoading ? (
                                        <div className="title-skeleton" />
                                    ) : videoInfo ? (
                                        <span>{videoInfo.title}</span>
                                    ) : (
                                        <span className="title-placeholder">제목</span>
                                    )}
                                </div>

                                {/* 링크 입력 */}
                                <input
                                    type="text"
                                    className="carol-input youtube-input"
                                    placeholder="유튜브 링크 업로드"
                                    value={youtubeUrl}
                                    onChange={handleYoutubeUrlChange}
                                />
                            </div>
                        </div>

                        {/* 편지 내용 입력 */}
                        <div className="carol-input-group">
                            <label className="carol-label">편지 내용</label>
                            <textarea
                                className="carol-textarea"
                                placeholder="따뜻한 마음을 담아 편지를 작성해보세요"
                                rows={4}
                                value={letter}
                                onChange={(e) => setLetter(e.target.value)}
                            />
                        </div>

                        {/* 보내기 버튼 */}
                        <button className="carol-submit-button" onClick={handleSubmit}>
                            보내기 🎁
                        </button>
                    </div>
                </div>
            </div>

            {/* 아이콘 선택 모달 */}
            <IconSelectModal
                isOpen={isIconModalOpen}
                onClose={() => setIsIconModalOpen(false)}
                onSelectIcon={handleIconSelect}
            />
        </>
    );
}
