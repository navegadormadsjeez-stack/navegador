import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsEnum } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

class UpgradePlanDto {
  @ApiProperty({ enum: SubscriptionPlan })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('me')
  getMySubscription(@CurrentUser('sub') userId: string) {
    return this.subscriptionsService.getSubscription(userId);
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  getStats() {
    return this.subscriptionsService.getUsageStats();
  }

  @Post('upgrade')
  @UseGuards(AdminGuard)
  upgrade(@CurrentUser('sub') userId: string, @Body() dto: UpgradePlanDto) {
    return this.subscriptionsService.upgradePlan(userId, dto.plan);
  }
}
