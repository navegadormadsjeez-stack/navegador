import {
  Controller,
  Get,
  Put,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateBrowserSettingsDto } from './dto/update-browser-settings.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('stats')
  @UseGuards(AdminGuard)
  getStats() {
    return this.usersService.getStats();
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: string, @CurrentUser('isAdmin') isAdmin: boolean) {
    if (id !== userId && !isAdmin) id = userId;
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('isAdmin') isAdmin: boolean,
  ) {
    if (id !== userId && !isAdmin) id = userId;
    return this.usersService.update(id, dto);
  }

  @Put('settings/browser')
  updateBrowserSettings(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateBrowserSettingsDto,
  ) {
    return this.usersService.updateBrowserSettings(userId, dto);
  }
}
