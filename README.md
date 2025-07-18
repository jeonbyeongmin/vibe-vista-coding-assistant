# Vibe Vista Coding Assistant

<img width="859" alt="스크린샷 2025-06-25 23 02 12" src="https://github.com/user-attachments/assets/87edba11-cede-4508-9424-947f1788edb7" />

## 📌 기능

### 🚀 코딩 아이디어 생성

클럽 구성원이 "오늘 뭐 코딩하지?"라는 고민 없이 재미있고 신선한 코딩 아이디어를 받을 수 있도록 도와줍니다.

### 📰 자동 개발 뉴스

- **매일 오전 9시**: 최신 개발 뉴스를 AI가 한국어로 요약해서 전달
- **매주 월요일 오전 10시**: GitHub 트렌딩 레포지토리 소개
- **실시간 요약**: Gemini AI를 활용한 한국어 뉴스 요약

### 🧩 개발 퀴즈

개발 관련 지식을 재미있게 테스트할 수 있는 퀴즈 기능을 제공합니다.

- **AI 생성 퀴즈**: Gemini AI가 매번 새로운 퀴즈를 생성
- **개별 결과 확인**: 선택한 사람만 개인 메시지로 정답과 해설 확인
- **스포일러 방지**: 다른 사람의 답안이나 정답이 공개되지 않음
- **실시간 통계**: 전체 참여 현황과 정답률 확인 가능
- **무제한 시간**: 시간 제한 없이 천천히 생각할 수 있음

## 💬 명령어

### 🎯 코딩 아이디어

```
/vibeidea [분야] [난이도] [제한시간]
```

#### 매개변수

- **분야** (선택): 웹 개발, 모바일 앱, CLI/터미널, AI/머신러닝, 데스크톱 앱, 게임 개발, 유틸리티, 데이터 분석, API/백엔드, 자동화/스크립트, 블록체인/Web3, IoT/하드웨어, 보안/해킹, 네트워킹, 데이터베이스, 개발도구, 알고리즘/수학, 크롤링/스크래핑, 음성/오디오, 이미지/그래픽, 실시간/채팅, 교육/학습, 기타
- **난이도** (필수): 쉬움, 중간, 어려움, 랜덤
- **제한시간** (선택): 30분, 1시간, 3시간, 상관없음

### 📰 뉴스 관련 명령어

#### 뉴스 채널 설정 (관리자 전용)

```
/setnews [채널]
```

자동 뉴스 알림을 받을 채널을 설정합니다.

### 🧩 퀴즈

```
/quiz [분야] [난이도]
```
개발 관련 퀴즈를 시작합니다.

<img width="500" alt="스크린샷 2025-07-04 23 17 35" src="https://github.com/user-attachments/assets/49af921c-d7e6-4e69-a1f1-cab6b805807f" />
<img width="500" alt="스크린샷 2025-07-04 23 17 43" src="https://github.com/user-attachments/assets/af392ece-3ae8-4389-8176-d66f46ef354f" />



#### 매개변수

- **분야** (선택): JavaScript, Python, React, Node.js, TypeScript, 알고리즘, 웹 개발, Git, 데이터베이스, 개발 상식, 랜덤
- **난이도** (선택): 쉬움, 중간, 어려움, 랜덤

#### 특징

- **개별 정답 확인**: 각자 개인 메시지로만 정답과 해설 확인
- **스포일러 방지**: 다른 사람의 답안이나 정답이 공개되지 않음
- **무제한 참여**: 시간 제한 없이 언제든지 참여 가능
- **실시간 통계**: 📊 통계 보기 버튼으로 전체 참여 현황 확인
- **AI 생성**: Gemini AI가 매번 새로운 퀴즈를 생성
- **재참여 확인**: 이미 참여한 경우 이전 답안과 결과 표시

### 😄 프로그래밍 농담

```
/joke [분야]
```
재미있는 프로그래밍 농담을 들려줍니다.

#### 매개변수

- **분야** (선택): 일반, JavaScript, Python, 프론트엔드, 백엔드, Git, 버그, AI/ML, 랜덤

#### 특징

- **다양한 분야**: 프로그래밍 언어별, 개발 분야별 농담 제공
- **한국어 농담**: 한국 개발자들이 공감할 수 있는 농담
- **AI 생성**: 기존 농담 + AI가 생성하는 새로운 농담
- **즉시 응답**: 빠르고 가벼운 재미있는 기능

## 🤖 AI 기능

- **다중 모델 지원**: Gemini 2.5 Flash, 2.0 Flash, 1.5 Flash 순서로 fallback
- **한국어 뉴스 요약**: 영문 개발 뉴스를 AI가 이해하기 쉬운 한국어로 요약
- **스마트 아이디어 생성**: 사용자가 지정한 조건에 맞는 창의적인 코딩 아이디어 제공

## 🔧 기술 스택

- **언어**: TypeScript
- **플랫폼**: Discord.js
- **AI**: Google Gemini API
- **스케줄링**: node-cron
- **데이터 소스**: Hacker News API, GitHub API

## 📝 라이센스

MIT License
