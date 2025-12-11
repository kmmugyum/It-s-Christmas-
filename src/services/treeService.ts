import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import type { PlacedIcon } from "../types";

// 랜덤 ID 생성 (트리 ID & 시크릿 키)
const generateId = (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// 트리 데이터 타입
export interface TreeData {
    id: string;
    secretKey: string;            // 관리자 인증용
    selectedTreeId: number;
    selectedBackgroundId: number;
    icons: PlacedIcon[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// 새 트리 생성
export const createTree = async (
    selectedTreeId: number,
    selectedBackgroundId: number
): Promise<{ treeId: string; secretKey: string }> => {
    const treeId = generateId(8);
    const secretKey = generateId(16);

    const treeRef = doc(db, "trees", treeId);

    await setDoc(treeRef, {
        id: treeId,
        secretKey,
        selectedTreeId,
        selectedBackgroundId,
        icons: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    return { treeId, secretKey };
};

// 트리 정보 가져오기 (방문자용 - secretKey 제외)
export const getTree = async (treeId: string): Promise<Omit<TreeData, 'secretKey'> | null> => {
    const treeRef = doc(db, "trees", treeId);
    const treeSnap = await getDoc(treeRef);

    if (!treeSnap.exists()) {
        return null;
    }

    const data = treeSnap.data();
    // secretKey는 반환하지 않음
    return {
        id: data.id,
        selectedTreeId: data.selectedTreeId,
        selectedBackgroundId: data.selectedBackgroundId,
        icons: data.icons || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
};

// 트리 소유권 확인 (secretKey 검증)
export const verifyTreeOwnership = async (treeId: string, secretKey: string): Promise<boolean> => {
    const treeRef = doc(db, "trees", treeId);
    const treeSnap = await getDoc(treeRef);

    if (!treeSnap.exists()) {
        return false;
    }

    const data = treeSnap.data();
    return data.secretKey === secretKey;
};

// 아이콘 추가 (방문자가 트리에 장식 추가)
export const addIconToTree = async (
    treeId: string,
    icon: PlacedIcon
): Promise<void> => {
    const treeRef = doc(db, "trees", treeId);

    await updateDoc(treeRef, {
        icons: arrayUnion(icon),
        updatedAt: serverTimestamp()
    });
};

// 트리 설정 업데이트 (관리자 전용)
export const updateTreeSettings = async (
    treeId: string,
    secretKey: string,
    updates: { selectedTreeId?: number; selectedBackgroundId?: number }
): Promise<boolean> => {
    const isOwner = await verifyTreeOwnership(treeId, secretKey);

    if (!isOwner) {
        return false;
    }

    const treeRef = doc(db, "trees", treeId);
    await updateDoc(treeRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });

    return true;
};
