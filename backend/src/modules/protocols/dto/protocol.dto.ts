/**
 * DTOs para o sistema de protocolos corretivos
 */

import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeviationInputDto {
  @ApiProperty({ example: 'knee_valgus' })
  @IsString()
  type: string;

  @ApiProperty({ enum: ['mild', 'moderate', 'severe'] })
  @IsEnum(['mild', 'moderate', 'severe'])
  severity: 'mild' | 'moderate' | 'severe';

  @ApiProperty({ example: 0.85, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiPropertyOptional({ example: 'knee' })
  @IsOptional()
  @IsString()
  affectedJoint?: string;

  @ApiPropertyOptional({ example: { start: 10, end: 50 } })
  @IsOptional()
  frameRange?: { start: number; end: number };
}

export class InjuryRecordDto {
  @ApiProperty({ example: 'knee' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'strain' })
  @IsString()
  type: string;

  @ApiProperty({ enum: ['mild', 'moderate', 'severe'] })
  @IsEnum(['mild', 'moderate', 'severe'])
  severity: 'mild' | 'moderate' | 'severe';

  @ApiProperty({ example: '2023-06-15' })
  @IsString()
  dateOccurred: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  fullyRecovered: boolean;
}

export class SymptomDto {
  @ApiProperty({ example: 'knee' })
  @IsString()
  location: string;

  @ApiProperty({ enum: ['pain', 'discomfort', 'stiffness', 'weakness'] })
  @IsEnum(['pain', 'discomfort', 'stiffness', 'weakness'])
  type: 'pain' | 'discomfort' | 'stiffness' | 'weakness';

  @ApiProperty({ example: 5, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  severity: number;

  @ApiPropertyOptional({ example: 'during_exercise' })
  @IsOptional()
  @IsString()
  occursWhen?: string;
}

export class UserProfileDto {
  @ApiProperty({ example: 'user_123' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  trainingAge: 'beginner' | 'intermediate' | 'advanced';

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @IsNumber()
  trainingAgeYears?: number;

  @ApiPropertyOptional({ type: [InjuryRecordDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InjuryRecordDto)
  injuryHistory?: InjuryRecordDto[];

  @ApiPropertyOptional({ example: ['barbell', 'dumbbell', 'resistance_band'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipmentAvailable?: string[];

  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 7 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(7)
  weeklyFrequency?: number;

  @ApiPropertyOptional({ type: [SymptomDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SymptomDto)
  currentSymptoms?: SymptomDto[];

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  weight?: number;
}

export class GenerateProtocolsInputDto {
  @ApiProperty({ type: [DeviationInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeviationInputDto)
  deviations: DeviationInputDto[];

  @ApiProperty({ type: UserProfileDto })
  @ValidateNested()
  @Type(() => UserProfileDto)
  userProfile: UserProfileDto;

  @ApiPropertyOptional()
  @IsOptional()
  deepContext?: any;
}

export class ProtocolResponseDto {
  @ApiProperty()
  protocolId: string;

  @ApiProperty()
  deviationType: string;

  @ApiProperty()
  deviationSeverity: string;

  @ApiProperty()
  baseProtocol: any;

  @ApiProperty()
  personalizedProtocol: any;

  @ApiProperty({ type: 'array' })
  personalizationLog: any[];

  @ApiPropertyOptional()
  scientificRationale?: string;

  @ApiProperty()
  createdAt: Date;
}

export class LoadProtocolDto {
  @ApiProperty({ example: 'knee_valgus' })
  @IsString()
  deviationType: string;

  @ApiProperty({ enum: ['mild', 'moderate', 'severe'] })
  @IsEnum(['mild', 'moderate', 'severe'])
  severity: 'mild' | 'moderate' | 'severe';
}

export class ValidationResultDto {
  @ApiProperty()
  @IsBoolean()
  valid: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  errors: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  warnings: string[];
}
