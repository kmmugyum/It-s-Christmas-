import { useState } from 'react';
import './IconSelectModal.css';
import modalBackground from '../assets/modal_background.png';

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

interface IconSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIcon: (iconId: string) => void;
}

// 크리스마스 아이콘 목록
const christmasIcons = [
    { id: 'hot-drink', image: iconHotDrink, name: '핫초코' },
    { id: 'snowflake', image: iconSnowflake, name: '눈송이' },
    { id: 'christmas-tree', image: iconChristmasTree, name: '크리스마스 트리' },
    { id: 'garland', image: iconGarland, name: '가랜드' },
    { id: 'cookies', image: iconCookies, name: '쿠키' },
    { id: 'rudolph', image: iconRudolph, name: '루돌프' },
    { id: 'mittens', image: iconMittens, name: '장갑' },
    { id: 'candy-cane', image: iconCandyCane, name: '사탕 지팡이' },
    { id: 'star', image: iconStar, name: '별' },
    { id: 'ball', image: iconBall, name: '트리 볼' },
    { id: 'gift-bag', image: iconGiftBag, name: '선물 가방' },
    { id: 'snowman', image: iconSnowman, name: '눈사람' },
    { id: 'cookie', image: iconCookie, name: '진저브레드' },
    { id: 'sock', image: iconXmasSock, name: '양말' },
    { id: 'house', image: iconSnowHouse, name: '눈 오는 집' },
    { id: 'hat', image: iconHat, name: '산타 모자' },
    { id: 'omela', image: iconOmela, name: '겨우살이' },
    { id: 'gift-shopping', image: iconGiftShopping, name: '선물 쇼핑' },
    { id: 'fireworks', image: iconFireworks, name: '불꽃놀이' },
    { id: 'gold-star', image: iconGoldStar, name: '금별' },
    { id: 'weather-snow', image: iconWeatherSnow, name: '눈 오는 날' },
    { id: 'calendar', image: iconCalendar, name: '달력' },
    { id: 'candles', image: iconCandles, name: '초' },
    { id: 'gift', image: iconGift, name: '선물' },
];

export function IconSelectModal({ isOpen, onClose, onSelectIcon }: IconSelectModalProps) {
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleIconClick = (iconId: string) => {
        setSelectedIcon(iconId);
    };

    const handleConfirm = () => {
        if (selectedIcon) {
            onSelectIcon(selectedIcon);
            onClose();
        }
    };

    return (
        <div className="icon-modal-overlay" onClick={onClose}>
            <div className="icon-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Background */}
                <img
                    src={modalBackground}
                    alt=""
                    className="icon-modal-bg"
                />

                {/* X Close Button */}
                <button className="icon-close-button" onClick={onClose}>
                    x
                </button>

                <div className="icon-modal-content">
                    {/* Header */}
                    <h2 className="icon-modal-header">
                        이 아이콘으로{'\n'}상대방의 트리를{'\n'}꾸미게 됩니다.
                    </h2>

                    {/* Icons Grid - Scrollable */}
                    <div className="icon-grid-container">
                        <div className="icon-grid">
                            {christmasIcons.map((icon) => (
                                <button
                                    key={icon.id}
                                    className={`icon-item ${selectedIcon === icon.id ? 'selected' : ''}`}
                                    onClick={() => handleIconClick(icon.id)}
                                    title={icon.name}
                                >
                                    <img src={icon.image} alt={icon.name} className="icon-image" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                        className={`icon-confirm-button ${!selectedIcon ? 'disabled' : ''}`}
                        onClick={handleConfirm}
                        disabled={!selectedIcon}
                    >
                        선택 완료
                    </button>
                </div>
            </div>
        </div>
    );
}
