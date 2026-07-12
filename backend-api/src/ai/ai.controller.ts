import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiRequestDto } from './dto/ai-request.dto';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  generate(@CurrentUser('sub') userId: string, @Body() dto: AiRequestDto) {
    return this.aiService.generate(userId, dto);
  }

  @Get('history')
  history(
    @CurrentUser('sub') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.aiService.getHistory(userId, limit ? parseInt(limit) : 20);
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  stats() {
    return this.aiService.getAdminStats();
  }
}
