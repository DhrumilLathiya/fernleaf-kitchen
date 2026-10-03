import { Injectable } from '@nestjs/common';

interface SettingsData {
  cutoffDays: number;
  cutoffTime: string;
  kitchenWorkingDays: number[];
  kitchenHolidays: string[];
}

@Injectable()
export class CutoffService {
  /**
   * Calculate the cut-off datetime for a given delivery date.
   * Walks backwards 'cutoffDays' working days from the delivery date,
   * skipping non-working days and kitchen holidays.
   */
  calculateCutoffDate(deliveryDate: Date, settings: SettingsData): Date {
    const { cutoffDays, cutoffTime, kitchenWorkingDays, kitchenHolidays } = settings;

    const holidaySet = new Set(
      kitchenHolidays.map((h) => new Date(h).toISOString().slice(0, 10)),
    );

    let daysLeft = cutoffDays;
    const cursor = new Date(deliveryDate);

    while (daysLeft > 0) {
      cursor.setDate(cursor.getDate() - 1);
      const dayOfWeek = cursor.getDay(); // 0=Sun, 1=Mon, ...
      const dateStr = cursor.toISOString().slice(0, 10);

      if (kitchenWorkingDays.includes(dayOfWeek) && !holidaySet.has(dateStr)) {
        daysLeft--;
      }
    }

    // Set time portion from cutoffTime (e.g. "16:00")
    const [hours, minutes] = cutoffTime.split(':').map(Number);
    cursor.setHours(hours, minutes, 0, 0);

    return cursor;
  }
}
