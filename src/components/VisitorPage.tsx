import { useState, useRef } from 'react';
import './VisitorPage.css';
import background from '../assets/background.png';
import christmasTree from '../assets/christmas_tree.png';
import buttonBackground from '../assets/modal_background.png';
import { useNavigate } from 'react-router-dom';
import { CarolWriteOverlay } from './CarolWriteOverlay';
import { CreateTreePromptModal } from './CreateTreePromptModal';
import type { PlacedIcon } from '../types';
import { ICON_SIZE } from '../types';

// 아이콘 이미지 import
import iconBall from '../assets/icons/Ball on the tree.png';
import iconCalendar from '../assets/icons/Calendar.png';
import iconCandyCane from '../assets/icons/Candy cane.png';
import iconCandles from '../assets/icons/Christmas candles.png';
import iconChristmasTree from '../assets/icons/Christmas tree.png';
import iconCookie from '../assets/icons/Cookie.png';
import iconCookies from '../assets/icons/Cookies.png';
import iconFireworks from '../assets/icons/Fireworks.png';
import iconGarland from '../assets/icons/Garland.png';
import iconGiftBag from '../assets/icons/Gift bag.png';
import iconGiftShopping from '../assets/icons/Gift shopping.png';
import iconGift from '../assets/icons/Gift.png';
import iconGoldStar from '../assets/icons/Gold star.png';
import iconHat from '../assets/icons/Hat.png';
import iconHotDrink from '../assets/icons/Hot drink.png';
import iconMittens from '../assets/icons/Mittens.png';
import iconOmela from '../assets/icons/Omela.png';
import iconRudolph from '../assets/icons/Rudolph.png';
import iconSnowHouse from '../assets/icons/Snow house.png';
import iconSnowflake from '../assets/icons/Snowflake.png';
import iconSnowman from '../assets/icons/Snowman.png';
import iconStar from '../assets/icons/Star.png';
import iconWeatherSnow from '../assets/icons/Weather snow.png';
import iconXmasSock from '../assets/icons/X-mas sock.png';

// 아이콘 ID → 이미지 매핑
const iconImages: Record<string, string> = {
    'hot-drink': iconHotDrink,
    'snowflake': iconSnowflake,
    'christmas-tree': iconChristmasTree,
    'garland': iconGarland,
    'cookies': iconCookies,
    'rudolph': iconRudolph,
    'mittens': iconMittens,
    'candy-cane': iconCandyCane,
    'star': iconStar,
    'ball': iconBall,
    'gift-bag': iconGiftBag,
    'snowman': iconSnowman,
    'cookie': iconCookie,
    'sock': iconXmasSock,
    'house': iconSnowHouse,
    'hat': iconHat,
    'omela': iconOmela,
    'gift-shopping': iconGiftShopping,
    'fireworks': iconFireworks,
    'gold-star': iconGoldStar,
    'weather-snow': iconWeatherSnow,
    'calendar': iconCalendar,
    'candles': iconCandles,
    'gift': iconGift,
};

// 충돌 감지: 50% 이상 겹치면 true
function isOverlapping(newIcon: { x: number; y: number }, existingIcons: PlacedIcon[]): boolean {
    const halfSize = ICON_SIZE / 2;

    for (const icon of existingIcons) {
        const dx = Math.abs(newIcon.x - icon.x);
        const dy = Math.abs(newIcon.y - icon.y);

        // 50% 이상 겹침 = 두 아이콘 중심 거리가 아이콘 크기의 50% 미만
        if (dx < halfSize && dy < halfSize) {
            return true;
        }
    }
    return false;
}

export function VisitorPage() {
    const navigate = useNavigate();
    const [isCarolOpen, setIsCarolOpen] = useState(false);
    const [isPlacementMode, setIsPlacementMode] = useState(false);
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const [pendingIcon, setPendingIcon] = useState<{
        iconId: string;
        letter: string;
        youtubeUrl: string;
    } | null>(null);
    const [placedIcons, setPlacedIcons] = useState<PlacedIcon[]>([]);
    const treeRef = useRef<HTMLDivElement>(null);

    const handleWriteCarol = () => {
        setIsCarolOpen(true);
    };

    const handleCloseCarol = () => {
        setIsCarolOpen(false);
    };

    // 아이콘 선택 완료 시 - 배치 모드 진입
    const handleIconSelected = (iconId: string, letter: string, youtubeUrl: string) => {
        setPendingIcon({ iconId, letter, youtubeUrl });
        setIsPlacementMode(true);
        setIsCarolOpen(false);
    };

    // 트리 클릭 시 - 아이콘 배치
    const handleTreeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPlacementMode || !pendingIcon || !treeRef.current) return;

        const rect = treeRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // 충돌 감지
        if (isOverlapping({ x, y }, placedIcons)) {
            alert('이 위치에는 이미 다른 아이콘이 있어요! 다른 곳을 선택해주세요. 🎄');
            return;
        }

        // 새 아이콘 추가
        const newIcon: PlacedIcon = {
            id: `icon-${Date.now()}`,
            iconId: pendingIcon.iconId,
            x,
            y,
            letter: pendingIcon.letter,
            youtubeUrl: pendingIcon.youtubeUrl,
            createdAt: new Date().toISOString(),
        };

        setPlacedIcons([...placedIcons, newIcon]);
        setIsPlacementMode(false);
        setPendingIcon(null);

        // 트리 생성 안내 모달 표시
        setIsPromptModalOpen(true);
    };

    // 배치 모드 취소
    const handleCancelPlacement = () => {
        setIsPlacementMode(false);
        setPendingIcon(null);
    };

    // 본인 트리 생성하러 가기
    const handleCreateOwnTree = () => {
        setIsPromptModalOpen(false);
        navigate('/'); // 메인 페이지로 이동하여 처음부터 트리 생성
    };

    return (
        <div className="visitor-container">
            {/* Background */}
            <img
                src={background}
                alt=""
                className="visitor-background"
            />

            {/* 배치 모드 안내 */}
            {isPlacementMode && (
                <div className="placement-mode-banner">
                    <p>🎄 트리를 클릭해서 아이콘을 배치하세요!</p>
                    <button onClick={handleCancelPlacement} className="cancel-placement-btn">
                        취소
                    </button>
                </div>
            )}

            {/* 트리 + 버튼을 감싸는 컨테이너 (상대적 위치) */}
            <div className="tree-and-button">
                {/* Christmas Tree with Icons */}
                <div
                    className={`visitor-tree ${isPlacementMode ? 'placement-mode' : ''}`}
                    ref={treeRef}
                    onClick={handleTreeClick}
                >
                    <img
                        src={christmasTree}
                        alt="Christmas Tree"
                        className="visitor-tree-image"
                    />

                    {/* 배치된 아이콘들 */}
                    {placedIcons.map((icon) => (
                        <div
                            key={icon.id}
                            className="placed-icon"
                            style={{
                                left: `${icon.x}%`,
                                top: `${icon.y}%`,
                                width: `${ICON_SIZE}%`,
                                height: `${ICON_SIZE}%`,
                            }}
                        >
                            <img
                                src={iconImages[icon.iconId]}
                                alt={icon.iconId}
                                className="placed-icon-image"
                            />
                        </div>
                    ))}

                    {/* 배치 모드: 미리보기 커서 */}
                    {isPlacementMode && pendingIcon && (
                        <div className="placement-cursor">
                            <img
                                src={iconImages[pendingIcon.iconId]}
                                alt="배치할 아이콘"
                                className="cursor-icon-image"
                            />
                        </div>
                    )}
                </div>

                {/* Write Carol Button - 트리 아래 간격 */}
                {!isPlacementMode && (
                    <button className="visitor-button write-button" onClick={handleWriteCarol}>
                        <img
                            src={buttonBackground}
                            alt=""
                            className="visitor-button-bg"
                        />
                        <span className="visitor-button-text">음악 추천 & 편지 작성하기</span>
                    </button>
                )}
            </div>

            {/* Carol Write Overlay */}
            <CarolWriteOverlay
                isOpen={isCarolOpen}
                onClose={handleCloseCarol}
                onIconSelected={handleIconSelected}
            />

            {/* 트리 생성 안내 모달 */}
            <CreateTreePromptModal
                isOpen={isPromptModalOpen}
                onClose={() => setIsPromptModalOpen(false)}
                onCreateTree={handleCreateOwnTree}
            />
        </div>
    );
}
