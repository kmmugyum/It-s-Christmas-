import { useState, useEffect, useRef } from 'react';
import './HomeWithTree.css';
import background from '../assets/backgrounds/background.png';
import background2 from '../assets/backgrounds/background_2.jpeg';
import background3 from '../assets/backgrounds/background_3.jpeg';
import background4 from '../assets/backgrounds/background_4.jpeg';
import christmasTree from '../assets/trees/christmas_tree.png';
import christmasTree2 from '../assets/trees/tree_2.png';
import christmasTree3 from '../assets/trees/뾰족 트리.png';
import christmasTree4 from '../assets/trees/어딘가 빈 트리.png';
import buttonBackground from '../assets/modal_background.png';
import { ShareOverlay } from './ShareOverlay';
import { LetterReadOverlay } from './LetterReadOverlay';
import { getTree } from '../services/treeService';
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

// 배경 옵션 맵
const BACKGROUND_MAP: Record<number, string> = {
    1: background,
    2: background2,
    3: background3,
    4: background4,
};

// 트리 옵션 맵
const TREE_MAP: Record<number, string> = {
    1: christmasTree2,
    2: christmasTree,
    3: christmasTree3,
    4: christmasTree4,
};

interface HomeWithTreeProps {
    selectedTreeId: number;
    selectedBackgroundId: number;
    treeId?: string;        // Firebase 트리 ID
    secretKey?: string;     // 관리자 인증 키
}

export function HomeWithTree({
    selectedTreeId,
    selectedBackgroundId,
    treeId,
    secretKey
}: HomeWithTreeProps) {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [placedIcons, setPlacedIcons] = useState<PlacedIcon[]>([]);
    const [selectedIcon, setSelectedIcon] = useState<PlacedIcon | null>(null);
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const backgroundRef = useRef<HTMLImageElement>(null);

    // 배경 디버그 로그
    useEffect(() => {
        console.log('=== HomeWithTree Debug ===');
        console.log('selectedBackgroundId:', selectedBackgroundId);
        console.log('window.innerWidth:', window.innerWidth);
        console.log('window.innerHeight:', window.innerHeight);

        // 배경 이미지 로드 후 정보 출력
        const checkBackground = () => {
            if (backgroundRef.current) {
                const bg = backgroundRef.current;
                const computed = window.getComputedStyle(bg);
                console.log('--- Background Element ---');
                console.log('bg.offsetWidth:', bg.offsetWidth);
                console.log('bg.offsetHeight:', bg.offsetHeight);
                console.log('bg.naturalWidth:', bg.naturalWidth);
                console.log('bg.naturalHeight:', bg.naturalHeight);
                console.log('computed.width:', computed.width);
                console.log('computed.height:', computed.height);
                console.log('computed.objectFit:', computed.objectFit);
                console.log('computed.position:', computed.position);
                console.log('computed.top:', computed.top);
                console.log('computed.left:', computed.left);
                console.log('computed.transform:', computed.transform);
                console.log('computed.minWidth:', computed.minWidth);
                console.log('computed.minHeight:', computed.minHeight);
                console.log('--- Container ---');
                const container = bg.parentElement;
                if (container) {
                    const containerComputed = window.getComputedStyle(container);
                    console.log('container.offsetWidth:', container.offsetWidth);
                    console.log('container.offsetHeight:', container.offsetHeight);
                    console.log('container.className:', container.className);
                    console.log('containerComputed.overflow:', containerComputed.overflow);
                }
            }
        };

        // 약간의 딜레이 후 체크 (이미지 로드 대기)
        setTimeout(checkBackground, 500);
    }, [selectedBackgroundId]);

    // Firebase에서 아이콘 데이터 불러오기
    useEffect(() => {
        const loadIcons = async () => {
            if (!treeId) return;

            try {
                const treeData = await getTree(treeId);
                if (treeData?.icons) {
                    setPlacedIcons(treeData.icons);
                }
            } catch (error) {
                console.error('아이콘 불러오기 실패:', error);
            }
        };

        loadIcons();
    }, [treeId]);

    const handleShareTree = () => {
        setIsShareOpen(true);
    };

    const handleCloseShare = () => {
        setIsShareOpen(false);
    };

    // 아이콘 클릭 시 편지 오버레이 열기
    const handleIconClick = (icon: PlacedIcon) => {
        setSelectedIcon(icon);
        setIsLetterOpen(true);
    };

    const handleCloseLetter = () => {
        setIsLetterOpen(false);
        setSelectedIcon(null);
    };

    const currentBackground = BACKGROUND_MAP[selectedBackgroundId] || background;
    const currentTree = TREE_MAP[selectedTreeId] || christmasTree2;

    return (
        <div className="home-tree-container">
            {/* Background */}
            <img
                ref={backgroundRef}
                src={currentBackground}
                alt=""
                className="home-tree-background"
            />

            {/* 상단 안내 문구 */}
            <div className="admin-top-notice">
                🎄 장신구를 클릭하여 소중한 마음을 읽어보세요 !
            </div>

            {/* 트리 + 버튼을 감싸는 컨테이너 (상대적 위치) */}
            <div className="tree-and-button">
                {/* Christmas Tree with Icons */}
                <div className="main-tree">
                    <img
                        src={currentTree}
                        alt="My Christmas Tree"
                        className="main-tree-image"
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
                            onClick={() => handleIconClick(icon)}
                        >
                            <img
                                src={iconImages[icon.iconId]}
                                alt={icon.iconId}
                                className="placed-icon-image"
                            />
                        </div>
                    ))}
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
            <ShareOverlay
                isOpen={isShareOpen}
                onClose={handleCloseShare}
                treeId={treeId}
                secretKey={secretKey}
            />

            {/* Letter Read Overlay */}
            <LetterReadOverlay
                isOpen={isLetterOpen}
                onClose={handleCloseLetter}
                icon={selectedIcon}
            />
        </div>
    );
}
