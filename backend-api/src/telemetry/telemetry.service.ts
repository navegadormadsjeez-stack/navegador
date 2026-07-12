import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TelemetryEventDto } from './dto/telemetry-event.dto';

@Injectable()
export class TelemetryService {
  constructor(private prisma: PrismaService) {}

  async track(userId: string | null, dto: TelemetryEventDto) {
    return this.prisma.telemetryEvent.create({
      data: {
        userId: userId ?? undefined,
        eventType: dto.eventType,
        payload: (dto.payload ?? {}) as Prisma.InputJsonValue,
        appVersion: dto.appVersion,
        osVersion: dto.osVersion,
      },
    });
  }

  async getStats() {
    const [total, byType, errors] = await Promise.all([
      this.prisma.telemetryEvent.count(),
      this.prisma.telemetryEvent.groupBy({
        by: ['eventType'],
        _count: true,
        orderBy: { _count: { eventType: 'desc' } },
      }),
      this.prisma.telemetryEvent.count({
        where: { eventType: { contains: 'error' } },
      }),
    ]);
    return { total, byType, errors };
  }
}
