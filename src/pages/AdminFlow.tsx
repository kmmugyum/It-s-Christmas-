import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { Home } from '../components/Home';
import { TreeSelection } from '../components/TreeSelection';
import { HomeWithTree } from '../components/HomeWithTree';
import { createTree, getTree, verifyTreeOwnership } from '../services/treeService';

type AdminPage = 'loading' | 'modal' | 'home' | 'treeSelection' | 'homeWithTree';

export function AdminFlow() {
    const { treeId: urlTreeId, secretKey: urlSecretKey } = useParams<{
        treeId?: string;
        secretKey?: string;
    }>();

    const [currentPage, setCurrentPage] = useState<AdminPage>(
        urlTreeId && urlSecretKey ? 'loading' : 'modal'
    );
    const [selectedTreeId, setSelectedTreeId] = useState<number>(1);
    const [selectedBackgroundId, setSelectedBackgroundId] = useState<number>(1);
    const [treeId, setTreeId] = useState<string>(urlTreeId || '');
    const [secretKey, setSecretKey] = useState<string>(urlSecretKey || '');
    const [isCreating, setIsCreating] = useState(false);

    // URL에 treeId와 secretKey가 있으면 기존 트리 불러오기
    useEffect(() => {
        const loadExistingTree = async () => {
            if (!urlTreeId || !urlSecretKey) return;

            try {
                // 소유권 확인
                const isOwner = await verifyTreeOwnership(urlTreeId, urlSecretKey);

                if (!isOwner) {
                    alert('잘못된 관리자 링크입니다.');
                    setCurrentPage('modal');
                    return;
                }

                // 트리 데이터 불러오기
                const treeData = await getTree(urlTreeId);

                if (!treeData) {
                    alert('트리를 찾을 수 없습니다.');
                    setCurrentPage('modal');
                    return;
                }

                // 상태 업데이트
                setSelectedTreeId(treeData.selectedTreeId);
                setSelectedBackgroundId(treeData.selectedBackgroundId);
                setTreeId(urlTreeId);
                setSecretKey(urlSecretKey);
                setCurrentPage('homeWithTree');
            } catch (error) {
                console.error('트리 불러오기 실패:', error);
                alert('트리를 불러오는데 실패했습니다.');
                setCurrentPage('modal');
            }
        };

        if (urlTreeId && urlSecretKey) {
            loadExistingTree();
        }
    }, [urlTreeId, urlSecretKey]);

    const handleConfirm = () => {
        setCurrentPage('home');
    };

    const handleCreateTree = () => {
        setCurrentPage('treeSelection');
    };

    const handleTreeSelectionComplete = async (treeIdNum: number, backgroundId: number) => {
        setSelectedTreeId(treeIdNum);
        setSelectedBackgroundId(backgroundId);
        setIsCreating(true);

        try {
            // Firebase에 트리 생성
            const result = await createTree(treeIdNum, backgroundId);
            setTreeId(result.treeId);
            setSecretKey(result.secretKey);

            // URL 업데이트 (히스토리에 추가)
            window.history.pushState({}, '', `/admin/${result.treeId}/${result.secretKey}`);

            // 모바일 브라우저 뷰포트 안정화를 위한 딜레이
            await new Promise(resolve => setTimeout(resolve, 100));

            // 뷰포트 재계산 강제
            window.scrollTo(0, 0);

            setCurrentPage('homeWithTree');
        } catch (error) {
            console.error('트리 생성 실패:', error);
            alert('트리 생성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsCreating(false);
        }
    };

    // 로딩 상태
    if (currentPage === 'loading') {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: "'Nanum Pen Script', cursive",
                fontSize: '24px'
            }}>
                🎄 트리 불러오는 중...
            </div>
        );
    }

    return (
        <>
            {currentPage === 'modal' && (
                <Modal
                    isOpen={true}
                    onConfirm={handleConfirm}
                    message={"친구에게\n크리스마스 캐롤과 메시지로\n마음을 전해보세요!"}
                />
            )}

            {currentPage === 'home' && (
                <Home onCreateTree={handleCreateTree} />
            )}

            {currentPage === 'treeSelection' && (
                <TreeSelection
                    onComplete={handleTreeSelectionComplete}
                    isLoading={isCreating}
                />
            )}

            {currentPage === 'homeWithTree' && (
                <HomeWithTree
                    selectedTreeId={selectedTreeId}
                    selectedBackgroundId={selectedBackgroundId}
                    treeId={treeId}
                    secretKey={secretKey}
                />
            )}
        </>
    );
}
