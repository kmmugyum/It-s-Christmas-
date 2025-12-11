import { useState, useRef } from 'react';
import './CarolWriteOverlay.css';
import modalBackground from '../assets/modal_background.png';
import { IconSelectModal } from './IconSelectModal';
import playIcon from '../assets/icons/Play.png';
import pauseIcon from '../assets/icons/Pause.png';

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
    const [isPlaying, setIsPlaying] = useState(false); // false = Pause 아이콘 표시 (일시정지 상태), true = Play 아이콘 표시 (재생 중)
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    if (!isOpen) return null;

    // 유튜브 URL에서 Video ID 추출
    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
            /youtube\.com\/embed\/([\w-]+)/,
            /youtube\.com\/v\/([\w-]+)/,
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    // 유튜브 URL 변경 시 처리
    const handleYoutubeUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setYoutubeUrl(url);

        const videoId = extractVideoId(url);

        if (videoId) {
            setIsLoading(true);

            try {
                // YouTube oEmbed API로 제목 가져오기 (API 키 불필요)
                const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
                const response = await fetch(oEmbedUrl);

                if (response.ok) {
                    const data = await response.json();
                    setVideoInfo({
                        title: data.title,
                        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                    });
                    setCurrentVideoId(videoId);
                } else {
                    // API 실패 시 썸네일만이라도 표시
                    setVideoInfo({
                        title: '제목을 불러올 수 없습니다',
                        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                    });
                }
            } catch {
                // 네트워크 에러 시 썸네일만 표시
                setVideoInfo({
                    title: '제목을 불러올 수 없습니다',
                    thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                });
            } finally {
                setIsLoading(false);
            }
        } else {
            setVideoInfo(null);
            setCurrentVideoId(null);
            setIsPlaying(false);
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
        setCurrentVideoId(null);
        setIsPlaying(false);
    };

    // 재생/일시정지 토글
    const handlePlayPause = () => {
        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);

        // YouTube iframe 제어
        if (iframeRef.current && iframeRef.current.contentWindow) {
            const command = newIsPlaying ? 'playVideo' : 'pauseVideo';
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: command }),
                '*'
            );
        }
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
                                        <div className="thumbnail-wrapper" onClick={handlePlayPause}>
                                            <img src={videoInfo.thumbnail} alt="썸네일" className="thumbnail-image" />
                                            <div className="thumbnail-play-overlay">
                                                <img
                                                    src={isPlaying ? playIcon : pauseIcon}
                                                    alt={isPlaying ? 'Playing' : 'Paused'}
                                                    className="play-pause-icon"
                                                />
                                            </div>
                                        </div>
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
                                        <span style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                            {videoInfo.title}
                                        </span>
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

            {/* 숨겨진 YouTube iframe (오디오 재생용) */}
            {currentVideoId && (
                <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&loop=1&playlist=${currentVideoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        border: 'none',
                        opacity: 0,
                        pointerEvents: 'none'
                    }}
                    title="YouTube Audio Player"
                />
            )}
        </>
    );
}
