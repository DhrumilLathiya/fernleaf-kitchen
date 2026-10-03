import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        kitchenWorkingDays: number[];
        kitchenHolidays: Date[];
        cutoffDays: number;
        cutoffTime: string;
    } | {
        kitchenWorkingDays: number[];
        kitchenHolidays: never[];
        cutoffDays: number;
        cutoffTime: string;
    }>;
    updateSettings(data: Partial<{
        kitchenWorkingDays: number[];
        kitchenHolidays: string[];
        cutoffDays: number;
        cutoffTime: string;
    }>): Promise<{
        id: string;
        kitchenWorkingDays: number[];
        kitchenHolidays: Date[];
        cutoffDays: number;
        cutoffTime: string;
    }>;
}
