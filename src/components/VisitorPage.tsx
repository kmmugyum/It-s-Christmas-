import { useState, useRef, useEffect } from 'react';
import './VisitorPage.css';
import background from '../assets/backgrounds/background.png';
import background2 from '../assets/backgrounds/background_2.jpeg';
import background3 from '../assets/backgrounds/background_3.jpeg';
import background4 from '../assets/backgrounds/background_4.jpeg';
import christmasTree from '../assets/trees/christmas_tree.png';
import christmasTree2 from '../assets/trees/tree_2.png';
import christmasTree3 from '../assets/trees/뾰족 트리.png';
import christmasTree4 from '../assets/trees/어딘가 빈 트리.png';
import buttonBackground from '../assets/modal_background.png';
import { useNavigate } from 'react-router-dom';
import { CarolWriteOverlay } from './CarolWriteOverlay';
import { CreateTreePromptModal } from './CreateTreePromptModal';
import type { PlacedIcon } from '../types';
import { ICON_SIZE } from '../types';
import { getTree, addIconToTree } from '../services/treeService';

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

interface VisitorPageProps {
    treeId?: string;
}

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

export function VisitorPage({ treeId }: VisitorPageProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [treeNotFound, setTreeNotFound] = useState(false);
    const [selectedTreeId, setSelectedTreeId] = useState<number>(1);
    const [selectedBackgroundId, setSelectedBackgroundId] = useState<number>(1);
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

    // Firebase에서 트리 데이터 불러오기
    useEffect(() => {
        const loadTreeData = async () => {
            if (!treeId) {
                setTreeNotFound(true);
                setIsLoading(false);
                return;
            }

            try {
                const treeData = await getTree(treeId);

                if (!treeData) {
                    setTreeNotFound(true);
                    setIsLoading(false);
                    return;
                }

                // 트리 설정 적용
                setSelectedTreeId(treeData.selectedTreeId);
                setSelectedBackgroundId(treeData.selectedBackgroundId);

                // 저장된 아이콘들 불러오기
                setPlacedIcons(treeData.icons || []);

                setIsLoading(false);
            } catch (error) {
                console.error('트리 불러오기 실패:', error);
                setTreeNotFound(true);
                setIsLoading(false);
            }
        };

        loadTreeData();
    }, [treeId]);

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
    const handleTreeClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPlacementMode || !pendingIcon || !treeRef.current || !treeId) return;

        const rect = treeRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // 충돌 감지
        if (isOverlapping({ x, y }, placedIcons)) {
            alert('이 위치에는 이미 다른 아이콘이 있어요! 다른 곳을 선택해주세요. 🎄');
            return;
        }

        // 새 아이콘 생성
        const newIcon: PlacedIcon = {
            id: `icon-${Date.now()}`,
            iconId: pendingIcon.iconId,
            x,
            y,
            letter: pendingIcon.letter,
            youtubeUrl: pendingIcon.youtubeUrl,
            createdAt: new Date().toISOString(),
        };

        try {
            // Firebase에 저장
            await addIconToTree(treeId, newIcon);

            // 로컬 상태 업데이트
            setPlacedIcons([...placedIcons, newIcon]);
            setIsPlacementMode(false);
            setPendingIcon(null);

            // 트리 생성 안내 모달 표시
            setIsPromptModalOpen(true);
        } catch (error) {
            console.error('아이콘 저장 실패:', error);
            alert('아이콘을 저장하는데 실패했습니다. 다시 시도해주세요.');
        }
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

    // 현재 트리 및 배경 이미지
    const currentBackground = BACKGROUND_MAP[selectedBackgroundId] || background;
    const currentTree = TREE_MAP[selectedTreeId] || christmasTree2;

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="visitor-container">
                <img src={background} alt="" className="visitor-background" />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: "'Nanum Pen Script', cursive",
                    fontSize: '24px',
                    color: '#fff',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                    🎄 트리 불러오는 중...
                </div>
            </div>
        );
    }

    // 트리를 찾을 수 없음
    if (treeNotFound) {
        return (
            <div className="visitor-container">
                <img src={background} alt="" className="visitor-background" />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: "'Nanum Pen Script', cursive",
                    fontSize: '24px',
                    color: '#fff',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    textAlign: 'center'
                }}>
                    <p>😢 트리를 찾을 수 없어요</p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            fontFamily: "'Nanum Pen Script', cursive",
                            fontSize: '20px',
                            background: '#c41e3a',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer'
                        }}
                    >
                        내 트리 만들러 가기 🎄
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="visitor-container">
            {/* Background */}
            <img
                src={currentBackground}
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
                        src={currentTree}
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
