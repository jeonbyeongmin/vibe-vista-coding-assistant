import { GoogleGenerativeAI } from '@google/generative-ai';
import { generatePrompt } from './prompts';
import { GEMINI_MODELS, TIMEOUT_MS } from './constants';
import { IdeaParams, AIModel, createTimeoutPromise, getStatusMessage } from './types';
import console from 'console';

export class AIService {
  private models: AIModel[];
  private modelNames: string[];

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.modelNames = GEMINI_MODELS;
    this.models = this.modelNames.map((name) => genAI.getGenerativeModel({ model: name }));
  }

  async generateIdea(params: IdeaParams): Promise<string> {
    const { field, difficulty, timeLimit } = params;
    const prompt = generatePrompt({ field, difficulty, timeLimit });

    console.log(
      `🎯 아이디어 생성 요청: 난이도=${difficulty}, 분야=${field || '없음'}, 제한시간=${timeLimit || '없음'}`
    );
    console.log(`📝 사용할 모델 순서: ${this.modelNames.join(' → ')}`);

    // 각 모델을 순서대로 시도
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];
      const modelName = this.modelNames[i];

      try {
        console.log(`🤖 ${modelName} 모델로 아이디어 생성 중...`);

        // 타임아웃과 함께 API 호출
        const result = await Promise.race([
          model.generateContent(prompt),
          createTimeoutPromise(TIMEOUT_MS),
        ]);

        const response = await result.response;
        const idea = response.text();

        console.log(`✅ ${modelName} 모델로 성공적으로 생성완료!`);
        return idea;
      } catch (error) {
        console.error(`❌ ${modelName} 모델 오류:`, error);

        // 타임아웃 처리
        if (error instanceof Error && error.message === 'Timeout') {
          console.log(`⏰ ${modelName} 모델 시간 초과`);
        }

        // API 특정 에러 처리
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          console.log(getStatusMessage(status, modelName));
        }

        // 마지막 모델이 아니면 다음 모델 시도
        if (i < this.models.length - 1) {
          console.log(`🔄 다음 모델 ${this.modelNames[i + 1]}로 재시도...`);
          continue;
        }
      }
    }

    // 모든 모델이 실패한 경우
    console.error('💥 모든 AI 모델에서 오류가 발생했습니다.');
    return this.getErrorMessage();
  }

  async generateNewsSummary(article: {
    title: string;
    description: string;
    tag_list: string[];
  }): Promise<string> {
    const prompt = `다음 개발 관련 영문 기사를 한국어로 요약해주세요. 요약은 2-3문장으로 간결하게 작성하고, 개발자들이 관심있어할 핵심 내용을 포함해주세요.

제목: ${article.title}
내용: ${article.description}
태그: ${article.tag_list.join(', ')}

요약 형식:
- 핵심 내용을 2-3문장으로 요약
- 개발자 관점에서 중요한 포인트 강조
- 친근하고 이해하기 쉬운 한국어로 작성`;

    console.log(`🤖 뉴스 기사 요약 생성 중: ${article.title}`);
    console.log(`📝 사용할 모델 순서: ${this.modelNames.join(' → ')}`);

    // 각 모델을 순서대로 시도
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];
      const modelName = this.modelNames[i];

      try {
        console.log(`🤖 ${modelName} 모델로 요약 생성 중...`);

        // 타임아웃과 함께 API 호출 (뉴스 요약은 10초로 설정)
        const result = await Promise.race([
          model.generateContent(prompt),
          createTimeoutPromise(10000),
        ]);

        const response = await result.response;
        const summary = response.text();

        console.log(`✅ ${modelName} 모델로 요약 생성 완료`);
        return summary.trim();
      } catch (error) {
        console.error(`❌ ${modelName} 모델 요약 오류:`, error);

        // 타임아웃 처리
        if (error instanceof Error && error.message === 'Timeout') {
          console.log(`⏰ ${modelName} 모델 시간 초과`);
        }

        // API 특정 에러 처리
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          console.log(getStatusMessage(status, modelName));
        }

        // 마지막 모델이 아니면 다음 모델 시도
        if (i < this.models.length - 1) {
          console.log(`🔄 다음 모델 ${this.modelNames[i + 1]}로 재시도...`);
          continue;
        }
      }
    }

    // 모든 모델이 실패한 경우 원본 설명 반환
    console.error('💥 뉴스 요약 생성 실패 - 원본 설명 사용');
    return article.description || '요약을 생성할 수 없습니다.';
  }

  private getErrorMessage(): string {
    return `🤖 죄송합니다! 현재 AI 서비스에 일시적인 문제가 발생했습니다.

**다음 중 하나를 시도해보세요:**
• 잠시 후 다시 시도해주세요
• 다른 난이도나 분야로 시도해보세요
• 문제가 지속되면 개발자에게 문의해주세요

**오류 시간:** ${new Date().toLocaleString('ko-KR')}`;
  }
}
