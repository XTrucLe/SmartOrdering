import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0',
      uptime: this.formatUptime(process.uptime()),
      message: 'Smart Ordering System API is running smoothly!',
    };
  }

  private formatUptime(seconds: number): string {
    if (seconds <= 0 || isNaN(seconds)) return '0s';

    const units = [
      { label: 'y', val: Math.floor(seconds / (3600 * 24 * 365)) },
      { label: 'M', val: Math.floor((seconds % (3600 * 24 * 365)) / (3600 * 24 * 30)) },
      { label: 'd', val: Math.floor((seconds % (3600 * 24 * 30)) / (3600 * 24)) },
      { label: 'h', val: Math.floor((seconds % (3600 * 24)) / 3600) },
      { label: 'm', val: Math.floor((seconds % 3600) / 60) },
      { label: 's', val: Math.floor(seconds % 60) },
    ];

    const result = units
      .filter((u) => u.val > 0)
      .map((u) => `${u.val}${u.label}`)
      .slice(0, 2)
      .join(' ');

    return result || '0s';
  }
}
