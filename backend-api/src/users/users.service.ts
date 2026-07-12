import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateBrowserSettingsDto } from './dto/update-browser-settings.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
          isActive: true,
          createdAt: true,
          subscription: { select: { plan: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users, total, page, limit };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        browserSettings: true,
        workspaces: true,
        _count: { select: { products: true, aiRequests: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, name: true, isActive: true },
    });
  }

  async updateBrowserSettings(userId: string, dto: UpdateBrowserSettingsDto) {
    const { preferences, ...rest } = dto;
    const data = {
      ...rest,
      ...(preferences !== undefined && {
        preferences: preferences as Prisma.InputJsonValue,
      }),
    };
    return this.prisma.browserSetting.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async getStats() {
    const [totalUsers, activeUsers, proUsers, aiRequestsToday] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.subscription.count({ where: { plan: { not: 'FREE' } } }),
        this.prisma.aiRequest.count({
          where: {
            createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          },
        }),
      ]);
    return { totalUsers, activeUsers, proUsers, aiRequestsToday };
  }
}
