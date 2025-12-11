import { useState } from 'react';
import './TreeSelection.css';
import background from '../assets/backgrounds/background.png';
import background2 from '../assets/backgrounds/background_2.jpeg';
import background3 from '../assets/backgrounds/background_3.jpeg';
import background4 from '../assets/backgrounds/background_4.jpeg';
import christmasTree from '../assets/trees/christmas_tree.png';
import christmasTree2 from '../assets/trees/tree_2.png';
import christmasTree3 from '../assets/trees/뾰족 트리.png';
import christmasTree4 from '../assets/trees/어딘가 빈 트리.png';
import buttonBackground from '../assets/modal_background.png';

// 배경 옵션 데이터 - 4개
const BACKGROUND_OPTIONS = [
    { id: 1, name: '기본', image: background },
    { id: 2, name: '흰눈 사이로', image: background2 },
    { id: 3, name: '눈 내리는 밤', image: background3 },
    { id: 4, name: '늦은 밤 홀로', image: background4 },
];

// 트리 옵션 데이터 - 4개의 트리
const TREE_OPTIONS = [
    { id: 1, name: '기본 트리', image: christmasTree2 },
    { id: 2, name: '휘어버린 트리', image: christmasTree },
    { id: 3, name: '뾰족 트리', image: christmasTree3 },
    { id: 4, name: '어딘가 빈 트리', image: christmasTree4 },
];

interface TreeSelectionProps {
    onComplete: (selectedTreeId: number, selectedBackgroundId: number) => void;
    isLoading?: boolean;
}

export function TreeSelection({ onComplete, isLoading = false }: TreeSelectionProps) {
    const [selectedBackground, setSelectedBackground] = useState<number>(1); // 기본 배경 선택
    const [selectedTree, setSelectedTree] = useState<number | null>(null);

    const handleSelectBackground = (bgId: number) => {
        setSelectedBackground(bgId);
    };

    const handleSelectTree = (treeId: number) => {
        setSelectedTree(treeId);
    };

    const handleComplete = () => {
        if (selectedTree !== null) {
            onComplete(selectedTree, selectedBackground);
        }
    };

    return (
        <div className="tree-selection-container">
            {/* Background - 선택된 배경에 따라 실시간 변경 */}
            <img
                src={BACKGROUND_OPTIONS.find(bg => bg.id === selectedBackground)?.image || background}
                alt=""
                className="selection-background"
            />

            {/* Scrollable Selection Area */}
            <div className="selection-scroll-area">
                {/* Background Options Grid - 1x2 */}
                <div className="background-options">
                    <span className="section-label">배경 선택</span>
                    <div className="background-grid">
                        {BACKGROUND_OPTIONS.map((bg) => (
                            <div
                                key={bg.id}
                                className={`background-option ${selectedBackground === bg.id ? 'selected' : ''}`}
                                onClick={() => handleSelectBackground(bg.id)}
                            >
                                <img src={bg.image} alt={bg.name} className="background-option-image" />
                                <span className="background-option-name">{bg.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tree Options Grid - 2x2 */}
                <div className="tree-options">
                    <span className="section-label">트리 선택</span>
                    <div className="tree-grid">
                        {TREE_OPTIONS.map((tree) => (
                            <div
                                key={tree.id}
                                className={`tree-option ${selectedTree === tree.id ? 'selected' : ''}`}
                                onClick={() => handleSelectTree(tree.id)}
                            >
                                <img src={tree.image} alt={tree.name} className="tree-option-image" />
                                <span className="tree-option-name">{tree.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Complete Button */}
            <button
                className={`complete-button ${selectedTree && !isLoading ? 'active' : 'disabled'}`}
                onClick={handleComplete}
                disabled={!selectedTree || isLoading}
            >
                <img
                    src={buttonBackground}
                    alt=""
                    className="button-bg"
                />
                <span className="button-label">
                    {isLoading ? '생성 중...' : '선택 완료'}
                </span>
            </button>
        </div>
    );
}
