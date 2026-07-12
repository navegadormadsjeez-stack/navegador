import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateChannel } from '@prisma/client';

export class CreateUpdateDto {
  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  downloadUrl: string;

  @ApiProperty()
  @IsString()
  checksum: string;

  @ApiProperty()
  @IsNumber()
  fileSize: number;

  @ApiPropertyOptional({ enum: UpdateChannel })
  @IsOptional()
  @IsEnum(UpdateChannel)
  channel?: UpdateChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  minVersion?: string;
}
