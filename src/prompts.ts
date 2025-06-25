export interface IdeaRequest {
  field?: string;
  difficulty: string;
  timeLimit?: string;
}

export interface IdeaResponse {
  title: string;
  description: string;
  challenge: string;
  vibe: string;
}

// 분야별 특화 프롬프트
const fieldPrompts = {
  웹: '웹 애플리케이션, 웹사이트, 또는 웹 기반 도구',
  CLI: '명령줄 인터페이스 도구, 터미널 애플리케이션',
  AI: '인공지능, 머신러닝, 또는 AI API를 활용한 프로젝트',
  유틸: '일상적으로 유용한 유틸리티 도구나 헬퍼 애플리케이션',
  게임: '간단한 게임, 퍼즐, 또는 인터랙티브 엔터테인먼트',
  기타: '창의적이고 독특한 아이디어',
};

// 난이도별 설명
const difficultyDescriptions = {
  쉬움: '초보자도 쉽게 따라할 수 있는 기본적인',
  중간: '어느 정도 경험이 있는 개발자를 위한 중급',
  어려움: '숙련된 개발자를 위한 도전적인 고급',
};

// 시간별 복잡도
const timeComplexity = {
  '30m': '30분 내로 완성할 수 있는 간단한',
  '1h': '1시간 정도의 적당한 분량의',
  '3h': '3시간 정도로 충분히 구현할 수 있는',
  상관없음: '시간에 구애받지 않는',
};

// 바이브 코멘트 템플릿
const vibeTemplates = [
  '코딩하는 재미를 느껴보세요! 🎉',
  '작은 프로젝트, 큰 성장의 시작이에요! 💪',
  '오늘도 한 줄의 코드가 세상을 바꿉니다! 🌍',
  '디버깅은 탐정놀이라고 생각해요! 🔍',
  '완벽하지 않아도 괜찮아요, 일단 시작! 🚀',
  '코드 한 줄 한 줄이 여러분의 작품이에요! 🎨',
  '실수도 배움의 과정이니까요! 📚',
  '창의력 폭발하는 시간! ✨',
  '개발자의 성장은 멈추지 않아요! 🌱',
  '버그는 피처의 다른 이름일 뿐! 😄',
];

export function generatePrompt(request: IdeaRequest): string {
  const { field = '랜덤', difficulty, timeLimit = '상관없음' } = request;

  let actualDifficulty = difficulty;
  if (difficulty === '랜덤') {
    const difficulties = ['쉬움', '중간', '어려움'];
    actualDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  let actualField = field;
  if (field === '랜덤' || !field) {
    const fields = Object.keys(fieldPrompts);
    actualField = fields[Math.floor(Math.random() * fields.length)];
  }

  const fieldPrompt = fieldPrompts[actualField as keyof typeof fieldPrompts] || '창의적인 프로젝트';
  const difficultyDesc =
    difficultyDescriptions[actualDifficulty as keyof typeof difficultyDescriptions];
  const timeDesc = timeComplexity[timeLimit as keyof typeof timeComplexity];

  return `당신은 개발자들에게 창의적이고 실용적인 코딩 아이디어를 제공하는 전문가입니다.

다음 조건에 맞는 ${fieldPrompt} 아이디어를 하나 제안해주세요:

조건:
- 분야: ${actualField}
- 난이도: ${actualDifficulty} (${difficultyDesc})
- 시간: ${timeLimit} (${timeDesc})

응답 형식을 정확히 지켜주세요:

💡 ${actualField} 아이디어: [간결하고 흥미로운 제목]
📝 설명: [구체적인 기능과 구현 방법을 2-3줄로 설명. 왜 유용하고 재미있는지 포함]
🔥 추가 챌린지: [기본 기능 외에 추가할 수 있는 심화 기능이나 개선사항]
🌈 vibe: "[동기부여가 되거나 재미있는 한마디]"

가이드라인:
1. 제목은 한 눈에 이해할 수 있고 흥미를 끄는 것으로
2. 설명은 구체적이고 실현 가능한 내용으로
3. 추가 챌린지는 창의적이고 학습 가치가 있는 것으로
4. vibe 코멘트는 유머나 격려가 담긴 따뜻한 메시지로
5. 실제로 ${timeLimit}에 구현 가능한 범위로 제안
6. 한국어로 자연스럽게 작성
7. 초보자도 이해할 수 있도록 친근하게`;
}

export function getRandomVibe(): string {
  return vibeTemplates[Math.floor(Math.random() * vibeTemplates.length)];
}
