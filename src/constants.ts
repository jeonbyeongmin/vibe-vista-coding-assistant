// 상수 및 설정값 정의
export const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

export const TIMEOUT_MS = 15000;

export const DIFFICULTY_CHOICES = [
  { name: '쉬움', value: '쉬움' },
  { name: '중간', value: '중간' },
  { name: '어려움', value: '어려움' },
  { name: '랜덤', value: '랜덤' },
] as const;

export const FIELD_CHOICES = [
  { name: '웹 개발', value: '웹' },
  { name: '모바일 앱', value: '모바일' },
  { name: 'CLI/터미널', value: 'CLI' },
  { name: 'AI/머신러닝', value: 'AI' },
  { name: '데스크톱 앱', value: '데스크톱' },
  { name: '게임 개발', value: '게임' },
  { name: '유틸리티', value: '유틸' },
  { name: '데이터 분석', value: '데이터' },
  { name: 'API/백엔드', value: 'API' },
  { name: '자동화/스크립트', value: '자동화' },
  { name: '블록체인/Web3', value: '블록체인' },
  { name: 'IoT/하드웨어', value: 'IoT' },
  { name: '보안/해킹', value: '보안' },
  { name: '네트워킹', value: '네트워크' },
  { name: '데이터베이스', value: '데이터베이스' },
  { name: '개발도구', value: '개발도구' },
  { name: '알고리즘/수학', value: '알고리즘' },
  { name: '크롤링/스크래핑', value: '크롤링' },
  { name: '음성/오디오', value: '오디오' },
  { name: '이미지/그래픽', value: '이미지' },
  { name: '실시간/채팅', value: '실시간' },
  { name: '교육/학습', value: '교육' },
  { name: '기타', value: '기타' },
] as const;

export const TIME_LIMIT_CHOICES = [
  { name: '30분', value: '30m' },
  { name: '1시간', value: '1h' },
  { name: '3시간', value: '3h' },
  { name: '상관없음', value: '상관없음' },
] as const;

export const JOKE_CATEGORIES = [
  { name: '일반', value: 'general' },
  { name: 'JavaScript', value: 'javascript' },
  { name: 'Python', value: 'python' },
  { name: '프론트엔드', value: 'frontend' },
  { name: '백엔드', value: 'backend' },
  { name: 'Git', value: 'git' },
  { name: '버그', value: 'bugs' },
  { name: 'AI/ML', value: 'ai' },
  { name: '랜덤', value: 'random' },
] as const;
