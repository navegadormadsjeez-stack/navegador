import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, workspaceId?: string) {
    return this.prisma.product.findMany({
      where: { userId, ...(workspaceId && { workspaceId }), isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(userId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        userId,
        images: dto.images ?? [],
        compatibilities: dto.compatibilities ?? [],
        attributes: (dto.attributes ?? {}) as Prisma.InputJsonValue,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateProductDto) {
    await this.findOne(userId, id);
    const { workspaceId, attributes, images, compatibilities, tags, ...rest } = dto;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(workspaceId !== undefined && { workspaceId }),
        ...(attributes !== undefined && { attributes: attributes as Prisma.InputJsonValue }),
        ...(images !== undefined && { images }),
        ...(compatibilities !== undefined && { compatibilities }),
        ...(tags !== undefined && { tags }),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
