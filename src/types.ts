// 트리에 배치된 아이콘 타입
export interface PlacedIcon {
    id: string;
    iconId: string;       // 아이콘 종류 (예: 'snowflake', 'gift')
    x: number;            // 상대 위치 X (0-100%)
    y: number;            // 상대 위치 Y (0-100%)
    letter: string;       // 편지 내용
    youtubeUrl: string;   // 유튜브 링크
    createdAt: string;    // 생성 시간
}

// 아이콘 크기 (% 단위)
export const ICON_SIZE = 12; // 12% of tree width
