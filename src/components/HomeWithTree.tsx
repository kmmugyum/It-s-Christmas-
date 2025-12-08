import { useState } from 'react';
import './HomeWithTree.css';
import background from '../assets/background.png';
import christmasTree from '../assets/christmas_tree.png';
import buttonBackground from '../assets/modal_background.png';
import { ShareOverlay } from './ShareOverlay';

export function HomeWithTree() {
    const [isShareOpen, setIsShareOpen] = useState(false);

    const handleShareTree = () => {
        setIsShareOpen(true);
    };

    const handleCloseShare = () => {
        setIsShareOpen(false);
    };

    return (
        <div className="home-tree-container">
            {/* Background */}
            <img
                src={background}
                alt=""
                className="home-tree-background"
            />

            {/* 트리 + 버튼을 감싸는 컨테이너 (상대적 위치) */}
            <div className="tree-and-button">
                {/* Christmas Tree */}
                <div className="main-tree">
                    <img
                        src={christmasTree}
                        alt="My Christmas Tree"
                        className="main-tree-image"
                    />
                </div>

                {/* Share Button - 트리 아래 간격 */}
                <button className="share-button" onClick={handleShareTree}>
                    <img
                        src={buttonBackground}
                        alt=""
                        className="share-button-bg"
                    />
                    <span className="share-button-text">트리 공유하기</span>
                </button>
            </div>

            {/* Share Overlay */}
            <ShareOverlay isOpen={isShareOpen} onClose={handleCloseShare} />
        </div>
    );
}
