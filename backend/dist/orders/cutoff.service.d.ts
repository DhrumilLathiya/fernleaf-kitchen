interface SettingsData {
    cutoffDays: number;
    cutoffTime: string;
    kitchenWorkingDays: number[];
    kitchenHolidays: string[];
}
export declare class CutoffService {
    calculateCutoffDate(deliveryDate: Date, settings: SettingsData): Date;
}
export {};
