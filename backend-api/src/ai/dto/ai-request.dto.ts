import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AiRequestType } from '@prisma/client';

export class AiRequestDto {
  @ApiProperty({ enum: AiRequestType })
  @IsEnum(AiRequestType)
  type: AiRequestType;

  @ApiProperty()
  @IsString()
  prompt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pageContent?: string;
}
