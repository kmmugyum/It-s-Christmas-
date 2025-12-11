import { useState, useRef } from 'react';
import './LetterReadOverlay.css';
import modalBackground from '../assets/modal_background.png';
import playIcon from '../assets/icons/Play.png';
import pauseIcon from '../assets/icons/Pause.png';
import type { PlacedIcon } from '../types';

interface LetterReadOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    icon: PlacedIcon | null;
}

// 유튜브 비디오 정보 타입
interface YouTubeVideoInfo {
    title: string;
    thumbnail: string;
}

export function LetterReadOverlay({ isOpen, onClose, icon }: LetterReadOverlayProps) {
    const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const loadedUrlRef = useRef<string | null>(null);

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

    // 모달이 열릴 때 유튜브 정보 로드
    const loadYoutubeInfo = async (url: string) => {
        if (loadedUrlRef.current === url) return;

        const videoId = extractVideoId(url);
        if (!videoId) {
            setVideoInfo(null);
            setCurrentVideoId(null);
            return;
        }

        setIsLoading(true);
        loadedUrlRef.current = url;

        try {
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
                setVideoInfo({
                    title: '제목을 불러올 수 없습니다',
                    thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                });
                setCurrentVideoId(videoId);
            }
        } catch {
            setVideoInfo({
                title: '제목을 불러올 수 없습니다',
                thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
            });
            setCurrentVideoId(videoId);
        } finally {
            setIsLoading(false);
        }
    };

    // 모달 열릴 때 유튜브 정보 로드
    if (isOpen && icon?.youtubeUrl && loadedUrlRef.current !== icon.youtubeUrl) {
        loadYoutubeInfo(icon.youtubeUrl);
    }

    // 모달 닫힐 때 상태 초기화
    const handleClose = () => {
        setVideoInfo(null);
        setCurrentVideoId(null);
        setIsPlaying(false);
        loadedUrlRef.current = null;
        onClose();
    };

    // 재생/일시정지 토글
    const handlePlayPause = () => {
        const newIsPlaying = !isPlaying;
        setIsPlaying(newIsPlaying);

        if (iframeRef.current && iframeRef.current.contentWindow) {
            const command = newIsPlaying ? 'playVideo' : 'pauseVideo';
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: command }),
                '*'
            );
        }
    };

    if (!isOpen || !icon) return null;

    return (
        <>
            <div className="letter-overlay" onClick={handleClose}>
                <div className="letter-modal" onClick={(e) => e.stopPropagation()}>
                    {/* Modal Background Image */}
                    <img
                        src={modalBackground}
                        alt=""
                        className="letter-modal-bg"
                    />

                    {/* X Close Button */}
                    <button className="letter-close-button" onClick={handleClose}>
                        x
                    </button>

                    <div className="letter-modal-content">

                        {/* 음악 추천 라벨 (유튜브 URL이 있을 때만 표시) */}
                        {icon.youtubeUrl && (
                            <>
                                <label className="letter-label">음악 추천</label>

                                {/* 유튜브 미리보기 영역 */}
                                <div className="youtube-preview-section">
                                    {/* 좌측: 썸네일 이미지 */}
                                    <div className="youtube-thumbnail">
                                        {isLoading ? (
                                            <div className="thumbnail-skeleton" />
                                        ) : videoInfo ? (
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
                                            <div className="thumbnail-empty">
                                                <span>🎵</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 우측: 제목 + 링크 버튼 */}
                                    <div className="youtube-info">
                                        <div className="youtube-title">
                                            {isLoading ? (
                                                <div className="title-skeleton" />
                                            ) : videoInfo ? (
                                                <span style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}>
                                                    {videoInfo.title}
                                                </span>
                                            ) : (
                                                <span className="title-placeholder">제목 없음</span>
                                            )}
                                        </div>
                                        <a
                                            href={icon.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="youtube-link-button"
                                        >
                                            YouTube 링크로 이동
                                        </a>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 편지 내용 표시 (읽기 전용) */}
                        <div className="letter-input-group">
                            <label className="letter-label">편지 내용</label>
                            <div className="letter-content">
                                {icon.letter || '편지 내용이 없습니다.'}
                            </div>
                        </div>

                        {/* 닫기 버튼 */}
                        <button className="letter-close-btn" onClick={handleClose}>
                            닫기
                        </button>
                    </div>
                </div>
            </div>

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
