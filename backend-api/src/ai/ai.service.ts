import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { AiRequestDto } from './dto/ai-request.dto';
import { AiRequestType } from '@prisma/client';

const SYSTEM_PROMPTS: Record<AiRequestType, string> = {
  ML_TITLE: 'Eres un experto en Mercado Libre Latinoamérica. Genera títulos optimizados para publicaciones ML, máximo 60 caracteres, sin emojis excesivos.',
  SEO_DESCRIPTION: 'Eres un experto en SEO para e-commerce latinoamericano. Genera descripciones optimizadas para buscadores y marketplaces.',
  CUSTOMER_REPLY: 'Eres un asistente de atención al cliente profesional y amigable para vendedores online en Latinoamérica.',
  COMPETITOR_ANALYSIS: 'Eres un analista de mercado e-commerce. Analiza la competencia y da recomendaciones accionables.',
  PAGE_SUMMARY: 'Resume el contenido de la página de forma concisa y útil para un vendedor online.',
  FACEBOOK_POST: 'Genera publicaciones atractivas para Facebook orientadas a ventas en Latinoamérica.',
  PRICE_SUGGESTION: 'Eres un experto en pricing para e-commerce latinoamericano. Sugiere precios competitivos basados en el contexto.',
  GENERAL: 'Eres Madsjeez AI, asistente inteligente para vendedores online de Latinoamérica.',
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private subscriptions: SubscriptionsService,
  ) {}

  async generate(userId: string, dto: AiRequestDto) {
    await this.subscriptions.checkAiLimit(userId);
    const start = Date.now();

    const systemPrompt = SYSTEM_PROMPTS[dto.type] || SYSTEM_PROMPTS.GENERAL;
    let userPrompt = dto.prompt;

    if (dto.pageUrl) {
      userPrompt += `\n\nURL actual: ${dto.pageUrl}`;
    }
    if (dto.pageContent) {
      userPrompt += `\n\nContenido de la página:\n${dto.pageContent.substring(0, 4000)}`;
    }

    const response = await this.callAiApi(systemPrompt, userPrompt);
    const durationMs = Date.now() - start;

    const record = await this.prisma.aiRequest.create({
      data: {
        userId,
        type: dto.type,
        prompt: dto.prompt,
        response,
        pageUrl: dto.pageUrl,
        tokensUsed: Math.ceil((dto.prompt.length + response.length) / 4),
        durationMs,
      },
    });

    await this.subscriptions.incrementAiUsage(userId);

    return { id: record.id, response, durationMs };
  }

  async getHistory(userId: string, limit = 20) {
    return this.prisma.aiRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        prompt: true,
        response: true,
        pageUrl: true,
        createdAt: true,
      },
    });
  }

  async getAdminStats() {
    const [total, byType, last24h] = await Promise.all([
      this.prisma.aiRequest.count(),
      this.prisma.aiRequest.groupBy({
        by: ['type'],
        _count: true,
      }),
      this.prisma.aiRequest.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 86400000) },
        },
      }),
    ]);
    return { total, byType, last24h };
  }

  private async callAiApi(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = this.config.get<string>('AI_API_KEY');
    const apiUrl = this.config.get<string>('AI_API_URL', 'https://api.openai.com/v1');
    const model = this.config.get<string>('AI_MODEL', 'gpt-4o-mini');

    if (!apiKey) {
      return this.generateMockResponse(userPrompt);
    }

    try {
      const res = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        this.logger.warn(`AI API error: ${res.status}`);
        return this.generateMockResponse(userPrompt);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || 'No response generated';
    } catch (error) {
      this.logger.error('AI API call failed', error);
      return this.generateMockResponse(userPrompt);
    }
  }

  private generateMockResponse(prompt: string): string {
    return `[MVP Demo - Configure AI_API_KEY para respuestas reales]\n\nBasado en tu solicitud: "${prompt.substring(0, 100)}..."\n\nEsta es una respuesta de demostración del asistente Madsjeez AI. Una vez configurada la API key de OpenAI, recibirás respuestas inteligentes personalizadas para vendedores latinoamericanos.`;
  }
}
