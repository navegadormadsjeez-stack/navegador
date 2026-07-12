import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, workspaceId?: string) {
    return this.prisma.favorite.findMany({
      where: { userId, ...(workspaceId && { workspaceId }) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateFavoriteDto) {
    return this.prisma.favorite.create({ data: { ...dto, userId } });
  }

  async remove(userId: string, id: string) {
    return this.prisma.favorite.deleteMany({ where: { id, userId } });
  }
}
