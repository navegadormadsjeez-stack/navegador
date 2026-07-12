import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan } from '@prisma/client';

const PLAN_LIMITS: Record<SubscriptionPlan, number> = {
  FREE: 50,
  PRO: 500,
  ENTERPRISE: 10000,
};

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
  }

  async checkAiLimit(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });
    if (!sub) throw new ForbiddenException('No subscription found');

    const now = new Date();
    if (sub.resetAt < now) {
      await this.prisma.subscription.update({
        where: { userId },
        data: {
          aiRequestsUsed: 0,
          resetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      });
      return true;
    }

    if (sub.aiRequestsUsed >= sub.aiRequestsLimit) {
      throw new ForbiddenException('AI request limit reached for your plan');
    }
    return true;
  }

  async incrementAiUsage(userId: string) {
    await this.prisma.subscription.update({
      where: { userId },
      data: { aiRequestsUsed: { increment: 1 } },
    });
  }

  async upgradePlan(userId: string, plan: SubscriptionPlan) {
    return this.prisma.subscription.update({
      where: { userId },
      data: {
        plan,
        aiRequestsLimit: PLAN_LIMITS[plan],
        aiRequestsUsed: 0,
        status: 'ACTIVE',
      },
    });
  }

  async getUsageStats() {
    const subs = await this.prisma.subscription.groupBy({
      by: ['plan'],
      _count: true,
      _sum: { aiRequestsUsed: true },
    });
    return subs;
  }
}
