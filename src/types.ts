import { ChatInputCommandInteraction } from 'discord.js';
import console from 'console';
import { setTimeout } from 'timers';

// 타입 정의
export interface IdeaParams {
  field: string;
  difficulty: string;
  timeLimit: string;
}

export interface AIModel {
  generateContent(prompt: string): Promise<{ response: { text(): string } }>;
}

// 에러 응답 유틸리티 함수
export async function handleInteractionError(
  interaction: ChatInputCommandInteraction,
  errorMessage: string,
  error?: unknown
): Promise<void> {
  if (error) {
    console.error('명령어 처리 오류:', error);
  }

  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: errorMessage,
      });
    } else {
      await interaction.reply({
        content: errorMessage,
        ephemeral: true,
      });
    }
  } catch (replyError) {
    console.error('응답 실패:', replyError);
  }
}

// 타임아웃 프로미스 생성
export function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
}

// HTTP 상태 코드에 따른 에러 메시지 반환
export function getStatusMessage(status: number, modelName: string): string {
  switch (status) {
    case 503:
      return `🔄 ${modelName} 모델이 과부하 상태`;
    case 429:
      return `⏳ ${modelName} 모델 사용량 한도 도달`;
    case 404:
      return `🔧 ${modelName} 모델을 찾을 수 없음`;
    default:
      return `🔍 ${modelName} 모델 HTTP 상태: ${status}`;
  }
}
