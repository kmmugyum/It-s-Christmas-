import { useParams } from 'react-router-dom';
import { VisitorPage } from '../components/VisitorPage';

export function VisitorFlow() {
    const { treeId } = useParams<{ treeId: string }>();

    return (
        <VisitorPage treeId={treeId} />
    );
}
