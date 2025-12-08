import { useState } from 'react';
import { Modal } from '../components/Modal';
import { Home } from '../components/Home';
import { TreeSelection } from '../components/TreeSelection';
import { HomeWithTree } from '../components/HomeWithTree';

type AdminPage = 'modal' | 'home' | 'treeSelection' | 'homeWithTree';

export function AdminFlow() {
    const [currentPage, setCurrentPage] = useState<AdminPage>('modal');

    const handleConfirm = () => {
        setCurrentPage('home');
    };

    const handleCreateTree = () => {
        setCurrentPage('treeSelection');
    };

    const handleTreeSelectionComplete = () => {
        setCurrentPage('homeWithTree');
    };

    return (
        <>
            {currentPage === 'modal' && (
                <Modal
                    isOpen={true}
                    onConfirm={handleConfirm}
                    message={"친구에게\n크리스마스 캐롤을\n보내보세요!"}
                />
            )}

            {currentPage === 'home' && (
                <Home onCreateTree={handleCreateTree} />
            )}

            {currentPage === 'treeSelection' && (
                <TreeSelection onComplete={handleTreeSelectionComplete} />
            )}

            {currentPage === 'homeWithTree' && (
                <HomeWithTree />
            )}
        </>
    );
}
