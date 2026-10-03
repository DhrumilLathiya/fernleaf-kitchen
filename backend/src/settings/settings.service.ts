import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.settings.findFirst();
    if (!settings) {
      // Return sensible defaults if none configured
      return {
        kitchenWorkingDays: [1, 2, 3, 4, 5],
        kitchenHolidays: [],
        cutoffDays: 2,
        cutoffTime: '16:00',
      };
    }
    return settings;
  }

  async updateSettings(data: Partial<{
    kitchenWorkingDays: number[];
    kitchenHolidays: string[];
    cutoffDays: number;
    cutoffTime: string;
  }>) {
    const existing = await this.prisma.settings.findFirst();
    const holidays = data.kitchenHolidays?.map(d => new Date(d)) ?? [];

    if (existing) {
      return this.prisma.settings.update({
        where: { id: existing.id },
        data: {
          ...data,
          kitchenHolidays: holidays,
        },
      });
    }

    return this.prisma.settings.create({
      data: {
        kitchenWorkingDays: data.kitchenWorkingDays ?? [1, 2, 3, 4, 5],
        kitchenHolidays: holidays,
        cutoffDays: data.cutoffDays ?? 2,
        cutoffTime: data.cutoffTime ?? '16:00',
      },
    });
  }
}
