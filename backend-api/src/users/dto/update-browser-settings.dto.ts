import { IsBoolean, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrowserSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  sidebarOpen?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchEngine?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homePage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  downloadPath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  preferences?: Record<string, unknown>;
}
