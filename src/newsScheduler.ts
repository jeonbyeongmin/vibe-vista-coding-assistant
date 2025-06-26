import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import * as cron from 'node-cron';
import axios from 'axios';
import console from 'console';
import { setTimeout } from 'timers';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  user: {
    name: string;
  };
  public_reactions_count: number;
  published_at: string;
  tag_list: string[];
}

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  created_at: string;
}

export class NewsScheduler {
  private client: Client;
  private models: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  private modelNames: string[];
  private newsChannels: Map<string, string> = new Map();

  constructor(client: Client, models: any[], modelNames: string[]) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    this.client = client;
    this.models = models;
    this.modelNames = modelNames;
  }

  startScheduler() {
    console.log('📰 뉴스 스케줄러 시작...');

    // 매일 오전 9시에 개발 뉴스 전송
    cron.schedule('0 9 * * *', async () => {
      console.log('📅 일일 뉴스 전송 시작...');
      await this.sendDailyNews();
    });

    // 매주 월요일 오전 10시에 주간 트렌드 전송
    cron.schedule('0 10 * * 1', async () => {
      console.log('📊 주간 트렌드 전송 시작...');
      await this.sendWeeklyTrends();
    });

    console.log('✅ 뉴스 스케줄러가 활성화되었습니다!');
  }

  async sendDailyNews() {
    try {
      const articles = await this.fetchDeveloperNews();
      if (articles.length === 0) {
        console.log('📰 가져올 뉴스가 없습니다.');
        return;
      }

      const embed = await this.createNewsEmbed(articles);
      await this.broadcastToChannels(embed);

      console.log('✅ 일일 뉴스 전송 완료');
    } catch (error) {
      console.error('❌ 일일 뉴스 전송 실패:', error);
    }
  }

  async sendWeeklyTrends() {
    try {
      const repos = await this.fetchTrendingRepos();
      if (repos.length === 0) {
        console.log('📈 가져올 트렌드가 없습니다.');
        return;
      }

      const embed = await this.createTrendingEmbed(repos);
      await this.broadcastToChannels(embed);

      console.log('✅ 주간 트렌드 전송 완료');
    } catch (error) {
      console.error('❌ 주간 트렌드 전송 실패:', error);
    }
  }

  private async fetchDeveloperNews(): Promise<NewsArticle[]> {
    try {
      console.log('📡 Dev.to에서 뉴스 가져오는 중...');

      const response = await axios.get('https://dev.to/api/articles', {
        params: {
          top: 7,
          per_page: 5,
        },
        timeout: 10000,
      });

      console.log(`✅ ${response.data.length}개의 뉴스 기사를 가져왔습니다.`);
      return response.data;
    } catch (error) {
      console.error('❌ 뉴스 가져오기 실패:', error);
      return [];
    }
  }

  private async fetchTrendingRepos(): Promise<GitHubRepo[]> {
    try {
      console.log('📡 GitHub에서 트렌딩 레포지토리 가져오는 중...');

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const since = oneWeekAgo.toISOString().split('T')[0];

      const response = await axios.get('https://api.github.com/search/repositories', {
        params: {
          q: `created:>${since}`,
          sort: 'stars',
          order: 'desc',
          per_page: 5,
        },
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'VibeVistaBot',
        },
        timeout: 10000,
      });

      console.log(`✅ ${response.data.items.length}개의 트렌딩 레포지토리를 가져왔습니다.`);
      return response.data.items;
    } catch (error) {
      console.error('❌ 트렌딩 레포지토리 가져오기 실패:', error);
      return [];
    }
  }

  private async createNewsEmbed(articles: NewsArticle[]): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
      .setTitle('📰 오늘의 개발 뉴스')
      .setColor(0x00d8ff)
      .setTimestamp();

    // 최대 3개의 기사만 처리
    const topArticles = articles.slice(0, 3);

    for (let i = 0; i < topArticles.length; i++) {
      const article = topArticles[i];
      try {
        console.log(`🤖 기사 ${i + 1} 요약 생성 중: ${article.title}`);

        const summary = await this.generateKoreanSummary(article);
        const tags = article.tag_list
          .slice(0, 3)
          .map((tag) => `\`${tag}\``)
          .join(' ');

        embed.addFields({
          name: `${i + 1}. ${article.title}`,
          value: `**🤖 요약:**\n${summary}\n\n**📊 정보:** 👤 ${article.user.name} | ❤️ ${article.public_reactions_count} 반응\n**🏷️ 태그:** ${tags || '없음'}\n🔗 [원문 읽기](${article.url})`,
          inline: false,
        });
      } catch (error) {
        console.error(`❌ 기사 ${i + 1} 요약 실패:`, error);

        // 요약 실패 시 원본 설명 사용
        embed.addFields({
          name: `${i + 1}. ${article.title}`,
          value: `**📝 요약:**\n${article.description || '요약 없음'}\n\n**📊 정보:** 👤 ${article.user.name} | ❤️ ${article.public_reactions_count} 반응\n🔗 [원문 읽기](${article.url})`,
          inline: false,
        });
      }
    }

    embed.addFields({
      name: '💡 더 많은 개발 소식',
      value: '더 많은 개발 뉴스는 [Dev.to](https://dev.to)에서 확인하세요!',
      inline: false,
    });

    return embed;
  }

  private async createTrendingEmbed(repos: GitHubRepo[]): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
      .setTitle('📈 이번 주 GitHub 트렌딩')
      .setDescription('이번 주 가장 인기있는 새로운 GitHub 레포지토리들입니다!')
      .setColor(0xff6b6b)
      .setTimestamp();

    repos.slice(0, 5).forEach((repo, index) => {
      const stars = repo.stargazers_count.toLocaleString();
      const forks = repo.forks_count.toLocaleString();
      const language = repo.language || '기타';

      embed.addFields({
        name: `${index + 1}. ${repo.name}`,
        value: `**📝 설명:** ${repo.description || '설명 없음'}\n**📊 통계:** ⭐ ${stars} | 🍴 ${forks} | 💻 ${language}\n🔗 [GitHub에서 보기](${repo.html_url})`,
        inline: false,
      });
    });

    return embed;
  }

  private async generateKoreanSummary(article: NewsArticle): Promise<string> {
    const prompt = `다음 개발 관련 영문 기사를 한국어로 요약해주세요. 요약은 2-3문장으로 간결하게 작성하고, 개발자들이 관심있어할 핵심 내용을 포함해주세요.

제목: ${article.title}
내용: ${article.description}
태그: ${article.tag_list.join(', ')}

요약 형식:
- 핵심 내용을 2-3문장으로 요약
- 개발자 관점에서 중요한 포인트 강조
- 친근하고 이해하기 쉬운 한국어로 작성`;

    // 기존의 fallback 시스템 사용
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];
      const modelName = this.modelNames[i];

      try {
        console.log(`🤖 ${modelName} 모델로 요약 생성 중...`);

        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000)),
        ]);

        const response = await result.response;
        const summary = response.text();

        console.log(`✅ ${modelName} 모델로 요약 생성 완료`);
        return summary.trim();
      } catch (error) {
        console.error(`❌ ${modelName} 모델 요약 오류:`, error);

        if (i < this.models.length - 1) {
          console.log(`🔄 다음 모델 ${this.modelNames[i + 1]}로 재시도...`);
          continue;
        }
      }
    }

    // 모든 모델이 실패한 경우 원본 설명 반환
    return article.description || '요약을 생성할 수 없습니다.';
  }

  private async broadcastToChannels(embed: EmbedBuilder) {
    let sentCount = 0;

    for (const [, channelId] of this.newsChannels) {
      try {
        const channel = this.client.channels.cache.get(channelId) as TextChannel;
        if (channel && channel.isTextBased()) {
          await channel.send({ embeds: [embed] });
          sentCount++;
          console.log(`✅ ${channel.guild.name}의 #${channel.name}에 뉴스 전송 완료`);
        }
      } catch (error) {
        console.error(`❌ 채널 ${channelId}에 뉴스 전송 실패:`, error);
      }
    }

    console.log(`📊 총 ${sentCount}개 채널에 뉴스를 전송했습니다.`);
  }

  setNewsChannel(guildId: string, channelId: string) {
    this.newsChannels.set(guildId, channelId);
    console.log(`📰 뉴스 채널 설정: ${guildId} -> ${channelId}`);
  }

  removeNewsChannel(guildId: string) {
    this.newsChannels.delete(guildId);
    console.log(`🗑️ 뉴스 채널 제거: ${guildId}`);
  }

  getNewsChannels(): Map<string, string> {
    return this.newsChannels;
  }

  // 테스트용 수동 뉴스 전송
  async sendTestNews(): Promise<boolean> {
    try {
      await this.sendDailyNews();
      return true;
    } catch (error) {
      console.error('❌ 테스트 뉴스 전송 실패:', error);
      return false;
    }
  }

  // 테스트용 수동 트렌드 전송
  async sendTestTrends(): Promise<boolean> {
    try {
      await this.sendWeeklyTrends();
      return true;
    } catch (error) {
      console.error('❌ 테스트 트렌드 전송 실패:', error);
      return false;
    }
  }
}
