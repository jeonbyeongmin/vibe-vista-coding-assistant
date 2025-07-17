import { AIService } from './AIService';
import console from 'console';

export class JokeService {
  private static readonly jokes = {
    general: [
      "프로그래머가 가장 좋아하는 차는? 컴퓨터! (Computer + Tea)",
      "프로그래머는 왜 계단을 올라가지 않나요? 엘리베이터를 쓰지... 말고 항상 루프를 써요!",
      "프로그래머가 가장 싫어하는 요일은? 버그데이(Bug-day, 월요일)",
      "코드가 왜 슬펐을까요? 주석이 없어서요...",
      "프로그래머의 로맨스: 당신은 내 생각을 컴파일해주는 유일한 사람이에요 💻",
      "버그가 있는 곳에는 항상 디버거가 있다. 그런데 디버거가 있는 곳에는... 더 많은 버그가 있다!",
    ],
    javascript: [
      "JavaScript가 다른 언어들과 다른 점은? 약속(Promise)을 잘 지키지 않아요!",
      "왜 자바스크립트는 치료사에게 갔을까요? undefined 때문에!",
      "JavaScript에서 0.1 + 0.2는 얼마일까요? 0.30000000000000004... 수학선생님이 화내실 거예요!",
      "자바스크립트 개발자가 결혼식에서 한 말: '나는 당신을 accept합니다... 아니, adopt? 음... 그냥 love해요!'",
      "== 과 === 의 차이점은? 하나는 '어쩌면', 다른 하나는 '확실히'예요!",
      "왜 자바스크립트는 null과 undefined가 둘 다 있을까요? 하나로도 충분히 혼란스러운데!",
    ],
    python: [
      "파이썬이 다른 뱀들과 다른 점은? 중괄호가 없어요! 🐍",
      "파이썬 프로그래머는 왜 항상 들여쓰기를 잘할까요? 안 하면 오류가 나거든요!",
      "파이썬의 모토: '인생은 너무 짧아서 중괄호 쓸 시간이 없어요'",
      "파이썬으로 뭘 할 수 있나요? 뭐든지! 웹도 AI도 데이터도... 커피는 못 만들어요 ☕",
      "import this의 비밀: 아름다운 것이 추한 것보다 낫다... 하지만 작동하는 게 더 낫다!",
      "파이썬은 왜 '파이썬'이라고 불릴까요? 몬티 파이썬 때문이래요. 뱀이 아니라 코미디 그룹!",
    ],
    frontend: [
      "CSS가 우울해하는 이유는? 항상 position: relative를 찾고 있어서!",
      "HTML은 왜 혼자서는 못 살까요? CSS 없이는 못생겨서!",
      "프론트엔드 개발자의 악몽: '모든 브라우저에서 똑같이 보이게 해주세요'",
      "반응형 웹디자인이란? 화면 크기가 바뀔 때마다 울음 소리를 내는 것!",
      "CSS Flexbox를 배우는 과정: 1. 신기해함 2. 혼란스러움 3. 포기 4. 다시 시도 5. 깨달음 6. 전도사가 됨",
      "왜 개발자들은 다크모드를 좋아할까요? 밝은 곳보다 어두운 곳에서 버그가 더 잘 숨어서!",
    ],
    backend: [
      "백엔드 개발자가 가장 무서워하는 것은? 프론트엔드 개발자가 '간단한 기능 하나만 추가해주세요'라고 말하는 것!",
      "데이터베이스가 치료사에게 간 이유는? 관계(Relationship) 문제 때문에!",
      "REST API가 스트레스받는 이유는? 항상 상태를 저장하지 말라고 하니까!",
      "서버가 다운되면 백엔드 개발자는 뭐라고 할까요? '제가 다운시킨 게 아니에요, 트래픽이...'",
      "마이크로서비스의 문제점은? 하나의 큰 문제를 여러 개의 작은 문제로 나누는 것!",
      "캐시의 두 가지 어려운 점: 1. 캐시 무효화 2. 이름 짓기 3. Off-by-one 에러... 잠깐, 세 가지네요!",
    ],
    git: [
      "Git 커밋 메시지의 진화: '초기 커밋' → '기능 추가' → '버그 수정' → '진짜 마지막' → '이번이 진짜 마지막'",
      "git push --force를 쓰는 개발자의 마음: '다른 사람들이 이해해줄 거야... 아마도?'",
      "가장 정직한 커밋 메시지: 'git commit -m \"무언가를 수정했는데 뭔지 기억 안 남\"'",
      "Git의 세 상태: 작업 중, 커밋 완료, '아 이거 뭐였지?'",
      "merge conflict가 발생했을 때의 심경: '우리 모두 친구인데 왜 싸우는 거야?'",
      "브랜치 이름의 현실: feature/amazing-new-feature → bugfix/fix-amazing-feature → hotfix/please-work",
    ],
    bugs: [
      "버그가 프로덕션에서만 발생하는 이유는? 개발 환경에서는 수줍어해서!",
      "99개의 버그를 수정하면? 117개의 새로운 버그가 나타납니다!",
      "버그 리포트: '가끔 작동 안 함' → 개발자: '제 컴퓨터에서는 잘 되는데요?'",
      "버그의 생명주기: 발견 → 무시 → 긴급 → 수정 → 새로운 버그 생성",
      "가장 무서운 말: '간단한 수정이었는데...'",
      "하이젠버그(Heisenberg) 버그: 관찰하려고 하면 사라지는 버그. 디버거 켜면 안 생기는 그것!",
    ],
    ai: [
      "AI가 인간을 대체할까요? 아니요, 우리는 AI가 하기 싫어하는 일만 할 거예요... 디버깅 같은!",
      "ChatGPT에게 코드를 물어봤더니... 제가 쓴 코드보다 더 좋네요. 이제 누가 주니어인가요?",
      "머신러닝의 80%는 데이터 전처리입니다. 나머지 20%는 '왜 모델이 고양이를 개라고 하지?'",
      "딥러닝 엔지니어의 일상: 1. 데이터 수집 2. 모델 훈련 3. '왜 안 되지?' 4. 1번으로 돌아가기",
      "AI 윤리학의 첫 번째 법칙: 로봇은 인간에게 해를 끼쳐서는 안 된다... 코드 리뷰 제외하고!",
      "신경망이 학습하는 과정: loss가 줄어들지 않아요 → 하이퍼파라미터 조정 → 여전히 안 돼요 → 새로운 논문 찾기",
    ],
  };

  constructor(private aiService: AIService) {}

  async getJoke(category?: string): Promise<string> {
    // 카테고리가 없거나 random이면 랜덤 카테고리 선택
    if (!category || category === 'random') {
      const categories = Object.keys(JokeService.jokes);
      category = categories[Math.floor(Math.random() * categories.length)];
    }

    // 해당 카테고리의 농담들
    const categoryJokes = JokeService.jokes[category as keyof typeof JokeService.jokes];
    
    if (!categoryJokes || categoryJokes.length === 0) {
      // 카테고리가 없으면 일반 농담 사용
      return this.getRandomJoke(JokeService.jokes.general);
    }

    // 80% 확률로 기존 농담 사용, 20% 확률로 AI 생성
    if (Math.random() < 0.8) {
      return this.getRandomJoke(categoryJokes);
    } else {
      try {
        return await this.generateAIJoke(category);
      } catch (error) {
        console.log('AI 농담 생성 실패, 기존 농담 사용:', error);
        return this.getRandomJoke(categoryJokes);
      }
    }
  }

  private getRandomJoke(jokes: string[]): string {
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  private async generateAIJoke(category: string): Promise<string> {
    const categoryNames = {
      general: '일반 프로그래밍',
      javascript: 'JavaScript',
      python: 'Python',
      frontend: '프론트엔드 개발',
      backend: '백엔드 개발',
      git: 'Git과 버전 관리',
      bugs: '버그와 디버깅',
      ai: 'AI와 머신러닝',
    };

    const categoryName = categoryNames[category as keyof typeof categoryNames] || '프로그래밍';

    const prompt = `${categoryName} 관련 재미있고 깨끗한 농담을 하나 만들어주세요. 
한국어로, 개발자들이 공감할 수 있는 농담이면 좋겠습니다. 
너무 길지 않게 1-2문장으로 간결하게 해주세요.
예시처럼 이모지도 적절히 사용해주세요.

농담만 답변해주세요.`;

    const response = await this.aiService.generateContent(prompt);
    return response.trim();
  }
}