# 🎄 It's Christmas!

> 음악과 편지로 크리스마스를 따뜻하게

친구에게 크리스마스 캐롤과 따뜻한 편지를 보내고, 함께 트리를 꾸며보세요!

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## ✨ 주요 기능

### 🏠 관리자 (트리 주인)
- **트리 생성**: 배경과 트리 스타일을 선택하여 나만의 트리 생성
- **링크 공유**: 카카오톡, 인스타그램, 링크 복사로 친구에게 공유
- **편지 확인**: 친구들이 남긴 음악과 편지 확인 (추후 구현)

### 👥 방문자
- **음악 추천**: 유튜브 링크로 크리스마스 캐롤 추천
- **편지 작성**: 따뜻한 마음을 담은 편지 작성
- **아이콘 배치**: 24가지 크리스마스 아이콘으로 트리 장식
- **충돌 방지**: 아이콘이 50% 이상 겹치지 않도록 자동 감지

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS (반응형)
- **Routing**: React Router DOM
- **Font**: Nanum Pen Script (Google Fonts)

## 📁 프로젝트 구조

```
src/
├── assets/           # 이미지, 아이콘 에셋
│   └── icons/        # 24개 크리스마스 아이콘 (PNG)
├── components/       # UI 컴포넌트
│   ├── Modal.tsx
│   ├── Home.tsx
│   ├── TreeSelection.tsx
│   ├── HomeWithTree.tsx
│   ├── ShareOverlay.tsx
│   ├── VisitorPage.tsx
│   ├── CarolWriteOverlay.tsx
│   ├── IconSelectModal.tsx
│   └── CreateTreePromptModal.tsx
├── pages/            # 페이지 라우팅
│   ├── AdminFlow.tsx
│   └── VisitorFlow.tsx
├── types.ts          # TypeScript 타입 정의
└── App.tsx           # 메인 앱 및 라우팅
```

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 실행

개발 서버: `http://localhost:5173`

- **관리자 페이지**: `/` 또는 `/admin`
- **방문자 페이지**: `/tree/:treeId`

## 🎨 화면 흐름

```
[관리자]
모달 → 홈 → 트리/배경 선택 → 트리 화면 → 공유

[방문자]
트리 페이지 → 음악 추천 & 편지 작성 → 아이콘 선택 → 트리에 배치
→ "나도 트리 만들기" 안내 모달
```

## 📱 반응형 디자인

- 모바일 우선 설계
- 화면 흔들림 방지 (터치 최적화)
- 다양한 화면 크기 대응

## 🔮 추후 구현 예정

- [ ] 백엔드 API 연동 (Firebase)
- [ ] 유튜브 미리보기 실제 데이터
- [ ] 관리자 편지/음악 확인 기능
- [ ] 다양한 트리/배경 에셋 추가

## 📄 라이선스

MIT License

---

Made with ❤️ for Christmas 🎄
