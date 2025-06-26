import { ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { AIService } from './AIService';
import { NewsScheduler } from './newsScheduler';
import { handleInteractionError } from './types';
import console from 'console';

export class CommandHandler {
  constructor(
    private aiService: AIService,
    private newsScheduler: NewsScheduler
  ) {}

  async handleVibeIdeaCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      // interaction이 유효한지 확인
      if (!interaction.isRepliable()) {
        console.log('⚠️ Interaction이 응답 불가능한 상태입니다.');
        return;
      }

      // 즉시 응답하여 시간 초과 방지
      await interaction.deferReply();

      const field = interaction.options.getString('분야') || '';
      const difficulty = interaction.options.getString('난이도') || '중간';
      const timeLimit = interaction.options.getString('제한시간') || '';

      console.log(`💡 아이디어 요청: 분야=${field}, 난이도=${difficulty}, 시간=${timeLimit}`);

      // 아이디어 생성
      const idea = await this.aiService.generateIdea({ field, difficulty, timeLimit });

      // 응답 업데이트
      await interaction.editReply({
        content: `🚀 **새로운 코딩 아이디어가 도착했습니다!**\n\n${idea}`,
      });

      console.log('✅ 아이디어 응답 완료');
    } catch (error) {
      await handleInteractionError(
        interaction,
        '❌ 아이디어 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        error
      );
    }
  }

  async handleNewsSetupCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      // 즉시 응답 처리
      await interaction.deferReply({ ephemeral: true });

      const channel = interaction.options.getChannel('채널');

      if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.editReply({
          content: '❌ 텍스트 채널만 선택할 수 있습니다.',
        });
        return;
      }

      // 뉴스 채널 설정
      this.newsScheduler.setNewsChannel(interaction.guildId!, channel.id);

      await interaction.editReply({
        content: `✅ <#${channel.id}>에서 개발 뉴스 알림이 설정되었습니다!\n📅 매일 오전 9시에 최신 개발 소식을 전해드립니다.\n📊 매주 월요일 오전 10시에 GitHub 트렌드를 전해드립니다.`,
      });
    } catch (error) {
      await handleInteractionError(interaction, '❌ 뉴스 채널 설정 중 오류가 발생했습니다.', error);
    }
  }
}
