import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
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
    updateSettings(body: any): Promise<{
        id: string;
        kitchenWorkingDays: number[];
        kitchenHolidays: Date[];
        cutoffDays: number;
        cutoffTime: string;
    }>;
}
