import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(userId: string, id: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id, userId },
      include: { favorites: true, products: { take: 10 } },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  async create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateWorkspaceDto) {
    await this.ensureOwnership(userId, id);
    return this.prisma.workspace.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    const workspace = await this.ensureOwnership(userId, id);
    if (workspace.isDefault) {
      throw new ForbiddenException('Cannot delete default workspace');
    }
    return this.prisma.workspace.delete({ where: { id } });
  }

  async setDefault(userId: string, id: string) {
    await this.ensureOwnership(userId, id);
    await this.prisma.$transaction([
      this.prisma.workspace.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      this.prisma.workspace.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);
    return { success: true };
  }

  private async ensureOwnership(userId: string, id: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { id, userId },
    });
    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }
}
