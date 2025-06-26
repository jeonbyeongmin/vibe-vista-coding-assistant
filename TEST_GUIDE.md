# 배포 전 테스트 가이드

## 🚀 빠른 테스트 방법

### 1. 종합 기능 테스트

```bash
npm run test:features
```

- 빌드, 의존성, API 연결 등 모든 기능 검증

### 2. 로컬 봇 실행 테스트

```bash
npm run test:local
```

- 실제 Discord에서 봇 기능 테스트

### 3. 전체 테스트 (기능 + 봇 실행)

```bash
npm run test:all
```

### 4. 봇 관리 명령어

```bash
npm run stop      # 봇 중단
npm run restart   # 봇 재시작
```

## 🧪 단계별 테스트 방법

### 1. Discord Developer Portal에서 새 봇 생성 (권장)

1. https://discord.com/developers/applications 접속
2. "New Application" 클릭
3. 이름: "VibeVistaBot-Test"
4. Bot 탭에서 봇 토큰 생성

### 2. 테스트 서버 초대

- 메인 서버가 아닌 개인 테스트 서버에 초대
- 또는 기존 서버의 테스트 채널에서만 사용

### 3. 환경 변수 설정

```bash
# .env.test 파일 생성 (또는 기존 .env 사용)
DISCORD_TOKEN=테스트봇토큰
GEMINI_API_KEY=기존과동일
NODE_ENV=test
```

### 4. 테스트 실행

```bash
# 종합 기능 테스트 먼저 실행
npm run test:features

# 모든 테스트 통과하면 봇 실행
npm run test:local
```

npm run dev:test

```

## 5. Discord에서 테스트할 명령어들

### ✅ 기존 기능 테스트
- `/vibeidea` - 코딩 아이디어 생성 (다양한 옵션으로 테스트)

### 🆕 새로운 뉴스 기능 테스트
- `/뉴스설정` - 뉴스 채널 설정 (관리자 권한 필요)
- `/뉴스` - 수동 뉴스 전송 테스트 (AI 한국어 요약 확인)
- `/트렌드` - GitHub 트렌딩 레포지토리 테스트

## 6. 테스트 체크리스트
- [ ] 모든 명령어가 Discord에서 보임
- [ ] `/vibeidea` 명령어 정상 작동
- [ ] `/뉴스설정` 권한 체크 작동
- [ ] `/뉴스` AI 한국어 요약 정상 표시
- [ ] `/트렌드` GitHub 데이터 정상 표시
- [ ] 에러 메시지 적절히 표시
- [ ] 응답 시간 3초 이내

## 🎯 배포 준비 완료 조건
1. `npm run test:features` 100% 통과
2. Discord에서 모든 명령어 정상 작동
3. AI 요약 기능 정상 작동
4. 에러 핸들링 정상 작동

모든 테스트가 통과하면 배포 진행! 🚀
```
