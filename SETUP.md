# VibeVistaBot 설정 가이드

## 🔧 Discord Bot 설정

### 1. Discord Developer Portal에서 애플리케이션 생성

1. [Discord Developer Portal](https://discord.com/developers/applications)에 접속
2. "New Application" 버튼 클릭
3. 애플리케이션 이름을 "VibeVistaBot"으로 설정

### 2. Bot 설정

1. 좌측 메뉴에서 "Bot" 선택
2. "Add Bot" 버튼 클릭
3. Bot Token을 복사하여 `.env` 파일의 `DISCORD_TOKEN`에 입력

### 3. Bot 권한 설정

Bot 섹션에서 다음 권한을 활성화:

- `Send Messages`
- `Use Slash Commands`
- `Read Message History`

### 4. OAuth2 설정

1. 좌측 메뉴에서 "OAuth2" > "URL Generator" 선택
2. Scopes에서 `bot`과 `applications.commands` 선택
3. Bot Permissions에서:
   - `Send Messages`
   - `Use Slash Commands`
4. 생성된 URL로 봇을 서버에 초대

## 🤖 Gemini API 설정

### 1. Google AI Studio에서 API 키 생성

1. [Google AI Studio](https://makersuite.google.com/)에 접속
2. "Get API Key" 클릭
3. 새 프로젝트에서 API 키 생성
4. API 키를 복사하여 `.env` 파일의 `GEMINI_API_KEY`에 입력

### 2. API 사용량 확인

- Gemini API는 무료 사용량이 충분합니다
- 월 1,500 requests까지 무료
- 자세한 내용은 [Google AI Pricing](https://ai.google.dev/pricing)에서 확인

## 🚀 실행 확인

```bash
# 개발 모드로 실행
npm run dev
```

봇이 성공적으로 실행되면 다음과 같은 메시지가 표시됩니다:

```
✅ VibeVistaBot#1234으로 로그인했습니다!
🎯 VibeVistaBot이 준비되었습니다!
슬래시 명령어를 등록하는 중...
✅ 슬래시 명령어가 성공적으로 등록되었습니다!
```

## 📝 테스트

Discord 서버에서 다음 명령어로 테스트:

```
/vibeidea 난이도:중간
/vibeidea 분야:웹 난이도:쉬움 제한시간:1h
/vibeidea 분야:CLI 난이도:어려움
```
