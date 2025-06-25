# 🎯 VibeVistaBot

재미있고 신선한 코딩 아이디어를 제공하는 디스코드봇

## 📌 기능

클럽 구성원이 "오늘 뭐 코딩하지?"라는 고민 없이 재미있고 신선한 코딩 아이디어를 받을 수 있도록 도와줍니다.

### 💬 명령어

```
/vibeidea [분야] [난이도] [제한시간]
```

#### 매개변수

- **분야** (선택): 웹, CLI, AI, 유틸, 게임, 기타
- **난이도** (필수): 쉬움, 중간, 어려움, 랜덤
- **제한시간** (선택): 30m, 1h, 3h, 상관없음

#### 예시

```
/vibeidea CLI 중간 1h
```

### 🤖 응답 형식

```
💡 CLI 아이디어: '오늘 뭐 먹지' 결정기
📝 설명: 입력된 재료 리스트로 메뉴를 추천해주는 터미널 프로그램. 서버 없이 구성.
🔥 추가 챌린지: 영양소 기반 추천도 추가해보세요!
🌈 vibe: "코딩도, 식사도 결정장애는 이제 그만."
```

## 🚀 설치 및 실행

### 1. 환경 설정

```bash
# 프로젝트 클론 후
npm install

# 환경변수 파일 생성
cp .env.example .env
```

### 2. 환경변수 설정

`.env` 파일에 다음 정보를 입력하세요:

```env
DISCORD_TOKEN=your_discord_bot_token_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

#### Discord Bot Token 발급

1. [Discord Developer Portal](https://discord.com/developers/applications)에 접속
2. New Application 클릭
3. Bot 섹션에서 토큰 생성
4. Bot Permissions: Send Messages, Use Slash Commands

#### Gemini API Key 발급

1. [Google AI Studio](https://makersuite.google.com/)에 접속
2. API Key 생성
3. 무료 사용량으로 충분합니다

### 3. 실행

```bash
# 개발 모드 (TypeScript 실시간 컴파일)
npm run dev

# 프로덕션 모드
npm run build
npm start
```

## 🧩 기술 스택

- **Discord.js**: 디스코드 봇 SDK
- **Google Gemini AI**: 무료 AI API
- **TypeScript**: 타입 안전성
- **Node.js**: 런타임

## 📁 프로젝트 구조

```
vibevista-bot/
├── src/
│   └── index.ts          # 메인 봇 코드
├── dist/                 # 컴파일된 파일들
├── package.json          # 프로젝트 설정
├── tsconfig.json         # TypeScript 설정
├── .env.example          # 환경변수 템플릿
└── README.md
```

## 🔧 개발

```bash
# 타입 체크
npm run lint

# 코드 포맷팅
npm run format

# 빌드
npm run build
```

## 📝 라이센스

MIT License
# vibe-vista-coding-assistant
