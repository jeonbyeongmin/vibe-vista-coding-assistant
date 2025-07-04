import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ButtonInteraction,
} from 'discord.js';
import { AIService } from './AIService';
import console from 'console';

// Node.js의 setTimeout 사용
const { setTimeout } = globalThis;

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: string;
}

interface ActiveQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: string;
  participants: Map<
    string,
    {
      answer: number;
      timestamp: number;
      correct: boolean;
    }
  >;
  createdBy: string;
  startTime: number;
}

export class QuizService {
  private activeQuizzes = new Map<string, ActiveQuiz>();

  constructor(private aiService: AIService) {}

  async generateQuiz(category: string, difficulty: string): Promise<QuizData> {
    const actualCategory = category === 'random' ? this.getRandomCategory() : category;
    const actualDifficulty = difficulty === 'random' ? this.getRandomDifficulty() : difficulty;

    const prompt = `
    ${actualCategory}에 관한 ${actualDifficulty} 난이도의 개발 퀴즈를 1개 만들어줘.
    
    다음 JSON 형식으로 답변해줘:
    {
        "question": "퀴즈 질문",
        "options": ["선택지1", "선택지2", "선택지3", "선택지4"],
        "correctAnswer": 정답_인덱스(0-3),
        "explanation": "정답 해설",
        "category": "실제_분야명",
        "difficulty": "실제_난이도"
    }
    
    규칙:
    - 질문은 명확하고 흥미로워야 함
    - 선택지는 4개, 모두 그럴듯해야 함
    - 해설은 왜 그것이 정답인지 자세히 설명
    - 실제 개발에 도움되는 내용으로 구성
    - 한국어로 작성
    - 코드가 포함될 경우 반드시 인라인 코드(백틱 1개)만 사용
    - 코드블럭(백틱 3개) 사용 금지
    - 예시: console.log() → \`console.log()\`
    `;

    try {
      const response = await this.aiService.generateQuizContent(prompt);
      console.log(`🔍 AI 응답 원본:`, response.substring(0, 200) + '...');

      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      console.log(`🔍 정리된 응답:`, cleanedResponse.substring(0, 200) + '...');

      const quizData = JSON.parse(cleanedResponse);
      console.log(`🔍 파싱된 퀴즈 데이터:`, quizData);

      // 데이터 검증
      if (
        !quizData.question ||
        !Array.isArray(quizData.options) ||
        quizData.options.length !== 4 ||
        typeof quizData.correctAnswer !== 'number' ||
        quizData.correctAnswer < 0 ||
        quizData.correctAnswer > 3
      ) {
        throw new Error('Invalid quiz data format');
      }

      // 질문과 선택지에서 문제가 될 수 있는 코드블럭 패턴 정리
      quizData.question = this.sanitizeCodeBlocks(quizData.question);
      quizData.options = quizData.options.map((option: string) => this.sanitizeCodeBlocks(option));
      quizData.explanation = this.sanitizeCodeBlocks(quizData.explanation);

      return quizData;
    } catch (error) {
      console.error('퀴즈 생성 실패:', error);
      console.log('🔄 Fallback 퀴즈 사용');
      return this.getFallbackQuiz(actualCategory, actualDifficulty);
    }
  }

  async createQuiz(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      await interaction.deferReply();

      const category = interaction.options.getString('분야') || 'random';
      const difficulty = interaction.options.getString('난이도') || 'random';

      console.log(`🧩 퀴즈 생성 요청: 분야=${category}, 난이도=${difficulty}`);

      const quiz = await this.generateQuiz(category, difficulty);
      const quizId = `${Date.now()}`; // 더 간단한 ID 형식

      console.log(`🔍 생성된 퀴즈 ID: "${quizId}"`);

      // 퀴즈 저장
      this.activeQuizzes.set(quizId, {
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation,
        category: quiz.category,
        difficulty: quiz.difficulty,
        participants: new Map(),
        createdBy: interaction.user.id,
        startTime: Date.now(),
      });

      console.log(`💾 퀴즈 저장됨: ${quizId}`);
      console.log(`💾 현재 활성 퀴즈 수: ${this.activeQuizzes.size}`);

      // 퀴즈 임베드 생성
      const embed = new EmbedBuilder()
        .setTitle('🧩 개발 퀴즈')
        .setDescription(`**${quiz.question}**`)
        .addFields(
          { name: '📂 분야', value: quiz.category, inline: true },
          { name: '⭐ 난이도', value: quiz.difficulty, inline: true },
          { name: '👥 참여자', value: '0명', inline: true }
        )
        .setFooter({ text: '답을 선택하면 개인 메시지로 결과를 확인할 수 있습니다!' })
        .setColor(0x7289da);

      // 객관식 버튼 생성
      const answerButtons = quiz.options.map((option, index) => {
        const customId = `quiz_answer_${quizId}_${index}`;
        console.log(`🔍 생성된 버튼 ID: "${customId}"`);
        return new ButtonBuilder()
          .setCustomId(customId)
          .setLabel(`${String.fromCharCode(65 + index)}. ${option}`)
          .setStyle(ButtonStyle.Secondary);
      });

      // 통계 보기 버튼 추가
      const statsButton = new ButtonBuilder()
        .setCustomId(`quiz_stats_${quizId}`)
        .setLabel('📊 통계 보기')
        .setStyle(ButtonStyle.Primary);

      console.log(`🔍 통계 버튼 ID: "quiz_stats_${quizId}"`);

      const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(answerButtons);
      const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(statsButton);

      await interaction.editReply({
        embeds: [embed],
        components: [row1, row2],
      });

      // 1시간 후 자동 정리
      setTimeout(() => {
        this.activeQuizzes.delete(quizId);
        console.log(`🧹 퀴즈 ${quizId} 자동 정리됨`);
      }, 3600000);

      console.log(`✅ 퀴즈 생성 완료: ${quizId}`);
    } catch (error) {
      console.error('퀴즈 생성 중 오류:', error);
      if (interaction.deferred) {
        await interaction.editReply('❌ 퀴즈 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else {
        await interaction.reply({
          content: '❌ 퀴즈 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
          ephemeral: true,
        });
      }
    }
  }

  async handleQuizAnswer(interaction: ButtonInteraction): Promise<void> {
    console.log(`🔍 버튼 클릭됨: ${interaction.customId}`);

    const [, , quizId, answerIndex] = interaction.customId.split('_');
    console.log(`🔍 파싱된 quizId: "${quizId}", answerIndex: "${answerIndex}"`);
    console.log(`🔍 활성 퀴즈 목록:`, Array.from(this.activeQuizzes.keys()));

    const quiz = this.activeQuizzes.get(quizId);

    if (!quiz) {
      console.log(`❌ 퀴즈를 찾을 수 없음: ${quizId}`);
      await interaction.reply({
        content: '❌ 퀴즈를 찾을 수 없습니다. 새로운 퀴즈를 시작해주세요!',
        ephemeral: true,
      });
      return;
    }

    console.log(`✅ 퀴즈 찾음: ${quizId}`);

    const userId = interaction.user.id;
    const selectedAnswer = parseInt(answerIndex);
    const isCorrect = selectedAnswer === quiz.correctAnswer;

    // 이미 참여한 사용자 체크
    if (quiz.participants.has(userId)) {
      const userAnswer = quiz.participants.get(userId)!;
      const previouslyCorrect = userAnswer.correct;

      await interaction.reply({
        content:
          `🔄 이미 참여하셨습니다!\n` +
          `이전 답안: **${String.fromCharCode(65 + userAnswer.answer)}. ${quiz.options[userAnswer.answer]}**\n` +
          `결과: ${previouslyCorrect ? '✅ 정답' : '❌ 오답'}`,
        ephemeral: true,
      });
      return;
    }

    // 참여자 정보 저장
    quiz.participants.set(userId, {
      answer: selectedAnswer,
      timestamp: Date.now(),
      correct: isCorrect,
    });

    // 개인 결과 메시지 생성
    const resultEmbed = new EmbedBuilder()
      .setTitle(isCorrect ? '🎉 정답입니다!' : '❌ 아쉽네요!')
      .setDescription(`**문제:** ${quiz.question}`)
      .addFields(
        {
          name: '선택한 답',
          value: `${String.fromCharCode(65 + selectedAnswer)}. ${quiz.options[selectedAnswer]}`,
          inline: true,
        },
        {
          name: '정답',
          value: `${String.fromCharCode(65 + quiz.correctAnswer)}. ${quiz.options[quiz.correctAnswer]}`,
          inline: true,
        },
        { name: '결과', value: isCorrect ? '✅ 정답' : '❌ 오답', inline: true },
        { name: '💡 해설', value: quiz.explanation, inline: false }
      )
      .setColor(isCorrect ? 0x00ff00 : 0xff6b6b);

    // 개인 메시지로만 결과 전송
    await interaction.reply({
      embeds: [resultEmbed],
      ephemeral: true,
    });

    // 원본 메시지의 참여자 수 업데이트
    await this.updateQuizParticipants(interaction, quizId);
  }

  async handleQuizStats(interaction: ButtonInteraction): Promise<void> {
    console.log(`📊 통계 버튼 클릭됨: ${interaction.customId}`);

    const quizId = interaction.customId.split('_')[2];
    console.log(`📊 파싱된 quizId: "${quizId}"`);
    console.log(`📊 활성 퀴즈 목록:`, Array.from(this.activeQuizzes.keys()));

    const quiz = this.activeQuizzes.get(quizId);

    if (!quiz) {
      console.log(`❌ 통계용 퀴즈를 찾을 수 없음: ${quizId}`);
      await interaction.reply({
        content: '❌ 퀴즈를 찾을 수 없습니다.',
        ephemeral: true,
      });
      return;
    }

    const totalParticipants = quiz.participants.size;
    const correctCount = Array.from(quiz.participants.values()).filter((p) => p.correct).length;
    const incorrectCount = totalParticipants - correctCount;

    // 선택지별 통계
    const optionStats = quiz.options.map((option, index) => {
      const count = Array.from(quiz.participants.values()).filter((p) => p.answer === index).length;
      const percentage = totalParticipants > 0 ? Math.round((count / totalParticipants) * 100) : 0;
      const isCorrect = index === quiz.correctAnswer;

      return {
        option: `${String.fromCharCode(65 + index)}. ${option}`,
        count,
        percentage,
        isCorrect,
      };
    });

    const statsEmbed = new EmbedBuilder()
      .setTitle('📊 퀴즈 통계')
      .setDescription(`**문제:** ${quiz.question}`)
      .addFields(
        { name: '👥 총 참여자', value: `${totalParticipants}명`, inline: true },
        { name: '✅ 정답자', value: `${correctCount}명`, inline: true },
        { name: '❌ 오답자', value: `${incorrectCount}명`, inline: true }
      )
      .setColor(0x9b59b6);

    // 선택지별 통계 추가
    if (totalParticipants > 0) {
      optionStats.forEach((stat) => {
        const emoji = stat.isCorrect ? '✅' : '⚪';
        statsEmbed.addFields({
          name: `${emoji} ${stat.option}`,
          value: `${stat.count}명 (${stat.percentage}%)`,
          inline: false,
        });
      });

      const correctRate = Math.round((correctCount / totalParticipants) * 100);
      statsEmbed.addFields({
        name: '📈 정답률',
        value: `${correctRate}%`,
        inline: false,
      });
    } else {
      statsEmbed.setDescription(`**문제:** ${quiz.question}\n\n아직 참여자가 없습니다.`);
    }

    await interaction.reply({
      embeds: [statsEmbed],
      ephemeral: true,
    });
  }

  private async updateQuizParticipants(
    interaction: ButtonInteraction,
    quizId: string
  ): Promise<void> {
    const quiz = this.activeQuizzes.get(quizId);
    if (!quiz) return;

    const participantCount = quiz.participants.size;
    const correctCount = Array.from(quiz.participants.values()).filter((p) => p.correct).length;

    const updatedEmbed = new EmbedBuilder()
      .setTitle('🧩 개발 퀴즈')
      .setDescription(`**${quiz.question}**`)
      .addFields(
        { name: '📂 분야', value: quiz.category, inline: true },
        { name: '⭐ 난이도', value: quiz.difficulty, inline: true },
        { name: '👥 참여자', value: `${participantCount}명`, inline: true },
        {
          name: '✅ 정답률',
          value:
            participantCount > 0 ? `${Math.round((correctCount / participantCount) * 100)}%` : '0%',
          inline: true,
        }
      )
      .setFooter({ text: '답을 선택하면 개인 메시지로 결과를 확인할 수 있습니다!' })
      .setColor(0x7289da);

    try {
      // 기존 버튼들 유지하면서 임베드만 업데이트
      await interaction.message.edit({
        embeds: [updatedEmbed],
      });
    } catch (error) {
      console.error('메시지 업데이트 실패:', error);
    }
  }

  private getRandomCategory(): string {
    const categories = [
      'javascript',
      'python',
      'react',
      'nodejs',
      'typescript',
      'algorithm',
      'web',
      'git',
      'database',
      'general',
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getRandomDifficulty(): string {
    const difficulties = ['easy', 'medium', 'hard'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  private getFallbackQuiz(category: string, difficulty: string): QuizData {
    const fallbackQuizzes: Record<string, QuizData[]> = {
      javascript: [
        {
          question: "JavaScript에서 '==' 와 '===' 의 차이점은 무엇인가요?",
          options: [
            '차이가 없다',
            '==는 타입 변환 후 비교, ===는 타입까지 엄격 비교',
            '===가 더 빠르다',
            '==는 숫자만, ===는 문자열만 비교',
          ],
          correctAnswer: 1,
          explanation:
            '==는 타입 변환(type coercion) 후 값을 비교하지만, ===는 타입과 값을 모두 엄격하게 비교합니다.',
          category: 'JavaScript',
          difficulty: '쉬움',
        },
      ],
      python: [
        {
          question: 'Python에서 리스트 [1, 2, 3] * 2의 결과는?',
          options: ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', 'Error', '[1, 2, 3, 2]'],
          correctAnswer: 1,
          explanation: 'Python에서 리스트에 숫자를 곱하면 리스트가 해당 횟수만큼 반복됩니다.',
          category: 'Python',
          difficulty: '쉬움',
        },
      ],
      general: [
        {
          question: "Git에서 'fork'와 'clone'의 차이점은?",
          options: [
            '차이가 없다',
            'fork는 원격 복사, clone은 로컬 복사',
            'fork는 로컬 복사, clone은 원격 복사',
            'fork는 브랜치 생성, clone은 저장소 복사',
          ],
          correctAnswer: 1,
          explanation:
            'fork는 GitHub 등에서 다른 사용자의 저장소를 자신의 계정으로 복사하는 것이고, clone은 원격 저장소를 로컬로 복사하는 것입니다.',
          category: 'Git',
          difficulty: '중간',
        },
      ],
    };

    const categoryQuizzes = fallbackQuizzes[category] || fallbackQuizzes.general;
    const quiz = categoryQuizzes[Math.floor(Math.random() * categoryQuizzes.length)];

    return {
      ...quiz,
      difficulty: difficulty,
    };
  }

  private sanitizeCodeBlocks(text: string): string {
    if (!text) return text;

    // 코드블럭(```) 을 인라인 코드(`)로 변환
    let sanitized = text.replace(/```[\s\S]*?```/g, (match) => {
      // 코드블럭 내용만 추출
      const code = match.replace(/```\w*\n?|\n?```/g, '').trim();
      // 인라인 코드로 변환
      return `\`${code}\``;
    });

    // 연속된 백틱들 정리
    sanitized = sanitized.replace(/`{2,}/g, '`');

    // Discord에서 문제가 될 수 있는 특수 문자들 처리
    sanitized = sanitized.replace(/\*{2,}/g, '**'); // 연속된 * 정리
    sanitized = sanitized.replace(/_{2,}/g, '__'); // 연속된 _ 정리

    return sanitized;
  }
}
