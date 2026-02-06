import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  async get<T = any>(key: string, options?: any): Promise<T | null> {
    return null;
  }

  async set(key: string, value: any, options?: any): Promise<void> {
    // stub
  }

  async delete(key: string): Promise<void> {
    // stub
  }

  async invalidatePattern(pattern: string, levels?: any[]): Promise<number> {
    return 0;
  }

  generateKey(prefix: string, ...parts: (string | number)[]): string {
    return [prefix, ...parts].join(':');
  }
}
