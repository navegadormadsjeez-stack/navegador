import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdatesService } from './updates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateUpdateDto } from './dto/create-update.dto';

@ApiTags('updates')
@Controller('updates')
export class UpdatesController {
  constructor(private updatesService: UpdatesService) {}

  @Get('check')
  checkUpdate(@Query('version') version: string) {
    return this.updatesService.checkUpdate(version || '0.0.0');
  }

  @Get('latest')
  getLatestDownload() {
    return this.updatesService.getLatestDownload();
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  findAll() {
    return this.updatesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateUpdateDto) {
    return this.updatesService.create(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.updatesService.remove(id);
  }
}
