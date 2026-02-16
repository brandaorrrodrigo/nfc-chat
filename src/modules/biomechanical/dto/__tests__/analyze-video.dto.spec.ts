import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AnalyzeVideoDto } from '../analyze-video.dto';

describe('AnalyzeVideoDto', () => {

  it('should validate correct data', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Agachamento Livre',
      captureMode: 'ESSENTIAL',
      userId: '123e4567-e89b-12d3-a456-426614174000'
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail with short exercise name', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Ab',
      captureMode: 'ESSENTIAL',
      userId: '123e4567-e89b-12d3-a456-426614174000'
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('exerciseName');
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail with invalid capture mode', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Agachamento Livre',
      captureMode: 'INVALID',
      userId: '123e4567-e89b-12d3-a456-426614174000'
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const captureModeError = errors.find(e => e.property === 'captureMode');
    expect(captureModeError).toBeDefined();
  });

  it('should fail with invalid UUID', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Agachamento Livre',
      captureMode: 'ESSENTIAL',
      userId: 'invalid-uuid'
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const userIdError = errors.find(e => e.property === 'userId');
    expect(userIdError).toBeDefined();
  });

  it('should trim exercise name', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: '  Agachamento Livre  ',
      captureMode: 'ESSENTIAL',
      userId: '123e4567-e89b-12d3-a456-426614174000'
    });

    expect(dto.exerciseName).toBe('Agachamento Livre');
  });

  it('should accept optional webhook URL', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Agachamento Livre',
      captureMode: 'ESSENTIAL',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      webhookUrl: 'https://example.com/webhook'
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.webhookUrl).toBe('https://example.com/webhook');
  });

  it('should fail with invalid webhook URL', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Agachamento Livre',
      captureMode: 'ESSENTIAL',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      webhookUrl: 'not-a-url'
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const webhookError = errors.find(e => e.property === 'webhookUrl');
    expect(webhookError).toBeDefined();
  });

  it('should transform tags to lowercase', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Agachamento Livre',
      captureMode: 'ESSENTIAL',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      tags: ['PRE-TREINO', 'TESTE']
    });

    expect(dto.tags).toEqual(['pre-treino', 'teste']);
  });

  it('should handle array or single value for cameraAngles', async () => {
    const dto = plainToClass(AnalyzeVideoDto, {
      exerciseName: 'Agachamento Livre',
      captureMode: 'ESSENTIAL',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      cameraAngles: 'SAGITTAL_RIGHT' // Single value
    });

    expect(Array.isArray(dto.cameraAngles)).toBe(true);
    expect(dto.cameraAngles).toContain('SAGITTAL_RIGHT');
  });
});
