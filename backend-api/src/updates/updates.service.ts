import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUpdateDto } from './dto/create-update.dto';

@Injectable()
export class UpdatesService {
  constructor(private prisma: PrismaService) {}

  async getLatestDownload() {
    const latest = await this.prisma.appUpdate.findFirst({
      where: { channel: 'STABLE' },
      orderBy: { publishedAt: 'desc' },
    });

    if (!latest) {
      return { available: false };
    }

    return {
      available: true,
      version: latest.version,
      title: latest.title,
      description: latest.description,
      downloadUrl: latest.downloadUrl,
      checksum: latest.checksum,
      fileSize: Number(latest.fileSize),
    };
  }

  async checkUpdate(currentVersion: string) {
    const latest = await this.prisma.appUpdate.findFirst({
      where: { channel: 'STABLE' },
      orderBy: { publishedAt: 'desc' },
    });

    if (!latest || latest.version === currentVersion) {
      return { updateAvailable: false, currentVersion };
    }

    return {
      updateAvailable: true,
      currentVersion,
      latest: {
        version: latest.version,
        title: latest.title,
        description: latest.description,
        downloadUrl: latest.downloadUrl,
        checksum: latest.checksum,
        fileSize: Number(latest.fileSize),
        isMandatory: latest.isMandatory,
      },
    };
  }

  async findAll() {
    return this.prisma.appUpdate.findMany({
      orderBy: { publishedAt: 'desc' },
    });
  }

  async create(dto: CreateUpdateDto) {
    return this.prisma.appUpdate.create({
      data: { ...dto, fileSize: BigInt(dto.fileSize) },
    });
  }

  async remove(id: string) {
    const update = await this.prisma.appUpdate.findUnique({ where: { id } });
    if (!update) throw new NotFoundException('Update not found');
    return this.prisma.appUpdate.delete({ where: { id } });
  }
}
