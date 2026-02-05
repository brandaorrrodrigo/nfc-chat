/**
 * DTOs para sistema de cache
 */

import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min } from 'class-validator';
import { CacheLevel } from '../interfaces/cache.interface';

/**
 * DTO para request de cache
 */
export class CacheGetRequestDto {
  @IsString()
  key: string;

  @IsEnum(CacheLevel)
  @IsOptional()
  level?: CacheLevel;

  @IsBoolean()
  @IsOptional()
  setOnMiss?: boolean;
}

/**
 * DTO para set de cache
 */
export class CacheSetRequestDto {
  @IsString()
  key: string;

  value: any;

  @IsEnum(CacheLevel)
  @IsOptional()
  level?: CacheLevel;

  @IsNumber()
  @IsOptional()
  @Min(0)
  ttl?: number;

  @IsBoolean()
  @IsOptional()
  skipIfExists?: boolean;
}

/**
 * DTO para invalidação
 */
export class CacheInvalidateRequestDto {
  @IsString()
  pattern: string;

  @IsEnum(CacheLevel, { each: true })
  @IsOptional()
  levels?: CacheLevel[];
}

/**
 * DTO de estatísticas
 */
export class CacheStatsDto {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions?: number;
  requests: number;
  hitRate: number;
  keyCount: number;
  sizeBytes?: number;
  sizeMB?: string;
}

/**
 * DTO de resposta de operação
 */
export class CacheOperationResponseDto {
  success: boolean;
  hit: boolean;
  level?: CacheLevel;
  latencyMs: number;
  value?: any;
  error?: string;
}
