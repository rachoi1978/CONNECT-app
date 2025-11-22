# CONNECT - 댄스 커뮤니티 앱

댄스 정보를 공유하고 소통하는 플랫폼

## 🚀 주요 기능

- 📝 댄스 정보 게시물 업로드 (사진, 제목, 내용)
- ❤️ 게시물 좋아요 기능
- 💬 업로더와 메시지 기능
- 👤 소셜 로그인 (Google, Kakao)
- 📱 반응형 디자인

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 📦 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <your-repository-url>
cd connect-app
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 값들을 입력하세요:

```bash
cp .env.local.example .env.local
```

필요한 환경 변수:
- MongoDB 연결 정보
- NextAuth 설정
- Google OAuth 정보
- Kakao OAuth 정보

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속하세요.

## 🏗 프로젝트 구조

```
connect-app/
├── app/                    # Next.js 13+ App 디렉토리
│   ├── api/               # API 라우트
│   ├── auth/              # 인증 페이지
│   ├── main/              # 메인 페이지
│   ├── messages/          # 메시지 페이지
│   ├── mypage/            # 마이페이지
│   ├── post/              # 게시물 상세
│   ├── upload/            # 게시물 업로드
│   └── page.tsx           # 스플래시 페이지
├── components/            # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 함수
├── models/                # MongoDB 모델
└── public/                # 정적 파일
```

## 📱 페이지 구성

1. **스플래시 페이지** (`/`) - CONNECT 로고 화면
2. **메인 페이지** (`/main`) - 게시물 목록
3. **게시물 상세** (`/post/[id]`) - 게시물 내용 및 연락하기
4. **업로드 페이지** (`/upload`) - 새 게시물 작성
5. **마이페이지** (`/mypage`) - 좋아요/본 게시물
6. **로그인 페이지** (`/auth/login`) - 소셜 로그인
7. **메시지** (`/messages`) - 채팅 목록 및 대화

## 🚀 배포

### Vercel 배포

1. Vercel에 로그인
2. GitHub 저장소 연결
3. 환경 변수 설정
4. Deploy 클릭

## 📝 추가 개발 사항

- [ ] 실제 이미지 업로드 (Cloudinary/S3)
- [ ] 실시간 채팅 (Socket.io)
- [ ] 푸시 알림
- [ ] 게시물 검색 기능
- [ ] 카테고리/태그 기능
- [ ] 사용자 프로필 편집

## 🤝 기여

Pull requests는 환영합니다. 큰 변경사항의 경우 먼저 issue를 열어 논의해 주세요.

## 📄 라이센스

MIT License
