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

| 분류 | 기술 |
|------|------|
| 프론트엔드 | React 18, TypeScript |
| 빌드 도구 | Vite 6 |
| 스타일링 | Vanilla CSS (반응형) |
| 라우팅 | React Router DOM |
| 폰트 | 나눔펜스크립트 (Google Fonts) |

## 📁 프로젝트 구조

```
src/
├── assets/           # 이미지, 아이콘 에셋
│   └── icons/        # 24개 크리스마스 아이콘 (PNG)
├── components/       # UI 컴포넌트
│   ├── Modal.tsx              # 시작 모달
│   ├── Home.tsx               # 홈 화면
│   ├── TreeSelection.tsx      # 트리/배경 선택
│   ├── HomeWithTree.tsx       # 트리 메인 화면
│   ├── ShareOverlay.tsx       # 공유 모달
│   ├── VisitorPage.tsx        # 방문자 페이지
│   ├── CarolWriteOverlay.tsx  # 음악/편지 작성
│   ├── IconSelectModal.tsx    # 아이콘 선택
│   └── CreateTreePromptModal.tsx  # 트리 생성 안내
├── pages/            # 페이지 라우팅
│   ├── AdminFlow.tsx          # 관리자 플로우
│   └── VisitorFlow.tsx        # 방문자 플로우
├── types.ts          # 타입 정의
└── App.tsx           # 메인 앱 및 라우팅
```

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone https://github.com/kmmugyum/It-s-Christmas-.git
cd It-s-Christmas-

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### 실행

개발 서버 주소: `http://localhost:5173`

| 페이지 | URL |
|--------|-----|
| 관리자 페이지 | `/` 또는 `/admin` |
| 방문자 페이지 | `/tree/:treeId` |

## 🎨 화면 흐름

### 관리자 플로우
```
시작 모달 → 홈 화면 → 트리/배경 선택 → 트리 메인 화면 → 공유
```

### 방문자 플로우
```
트리 페이지 → 음악 추천 & 편지 작성 → 아이콘 선택 
→ 트리에 아이콘 배치 → "나도 트리 만들기" 안내
```

## 📱 반응형 디자인

- 모바일 우선 설계
- 터치 최적화 (화면 흔들림 방지)
- 다양한 화면 크기 대응

## 🔮 추후 구현 예정

- [ ] 백엔드 API 연동 (Firebase)
- [ ] 유튜브 미리보기 실제 데이터 연동
- [ ] 관리자 편지/음악 확인 기능
- [ ] 다양한 트리/배경 에셋 추가
- [ ] 데이터베이스 저장

## 👨‍💻 개발자

- **GitHub**: [@kmmugyum](https://github.com/kmmugyum)

## 📄 라이선스

MIT License

---

Made with ❤️ for Christmas 🎄
