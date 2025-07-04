import { ChatInputCommandInteraction, ChannelType, ButtonInteraction } from 'discord.js';
import { AIService } from './AIService';
import { NewsScheduler } from './newsScheduler';
import { QuizService } from './QuizService';
import { handleInteractionError } from './types';
import console from 'console';

export class CommandHandler {
  private quizService: QuizService;

  constructor(
    private aiService: AIService,
    private newsScheduler: NewsScheduler
  ) {
    this.quizService = new QuizService(aiService);
  }

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

  async handleNewsTestCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      // 즉시 응답 처리
      await interaction.deferReply();

      const type = interaction.options.getString('타입') || 'daily';

      if (type === 'daily') {
        console.log('🧪 일일 뉴스 테스트 시작...');
        await interaction.editReply({
          content: '📰 일일 뉴스를 가져오는 중입니다... 잠시만 기다려주세요!',
        });

        await this.newsScheduler.sendDailyNews();

        await interaction.editReply({
          content: '✅ 일일 뉴스 테스트가 완료되었습니다! 설정된 뉴스 채널을 확인해보세요.',
        });
      } else if (type === 'weekly') {
        console.log('🧪 주간 트렌드 테스트 시작...');
        await interaction.editReply({
          content: '📈 주간 트렌드를 가져오는 중입니다... 잠시만 기다려주세요!',
        });

        await this.newsScheduler.sendWeeklyTrends();

        await interaction.editReply({
          content: '✅ 주간 트렌드 테스트가 완료되었습니다! 설정된 뉴스 채널을 확인해보세요.',
        });
      }
    } catch (error) {
      await handleInteractionError(interaction, '❌ 뉴스 테스트 중 오류가 발생했습니다.', error);
    }
  }

  async handleQuizCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    await this.quizService.createQuiz(interaction);
  }

  async handleQuizButtonInteraction(interaction: ButtonInteraction): Promise<void> {
    if (interaction.customId.startsWith('quiz_answer_')) {
      await this.quizService.handleQuizAnswer(interaction);
    } else if (interaction.customId.startsWith('quiz_stats_')) {
      await this.quizService.handleQuizStats(interaction);
    }
  }
}
