import { useState } from 'react';
import './TreeSelection.css';
import background from '../assets/background.png';
import christmasTree from '../assets/christmas_tree.png';
import buttonBackground from '../assets/modal_background.png';

// 배경 옵션 데이터 - 2개
const BACKGROUND_OPTIONS = [
    { id: 1, name: '기본', image: background },
    { id: 2, name: '눈 내리는 밤', image: background }, // 더미
];

// 트리 옵션 데이터 - 4개의 트리
const TREE_OPTIONS = [
    { id: 1, name: '기본 트리', image: christmasTree },
    { id: 2, name: '골드 트리', image: christmasTree },
    { id: 3, name: '실버 트리', image: christmasTree },
    { id: 4, name: '핑크 트리', image: christmasTree },
];

interface TreeSelectionProps {
    onComplete: (selectedTreeId: number) => void;
}

export function TreeSelection({ onComplete }: TreeSelectionProps) {
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
            onComplete(selectedTree);
        }
    };

    return (
        <div className="tree-selection-container">
            {/* Background */}
            <img
                src={background}
                alt=""
                className="selection-background"
            />

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

            {/* Complete Button */}
            <button
                className={`complete-button ${selectedTree ? 'active' : 'disabled'}`}
                onClick={handleComplete}
                disabled={!selectedTree}
            >
                <img
                    src={buttonBackground}
                    alt=""
                    className="button-bg"
                />
                <span className="button-label">선택 완료</span>
            </button>
        </div>
    );
}
