"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CutoffService = void 0;
const common_1 = require("@nestjs/common");
let CutoffService = class CutoffService {
    calculateCutoffDate(deliveryDate, settings) {
        const { cutoffDays, cutoffTime, kitchenWorkingDays, kitchenHolidays } = settings;
        const holidaySet = new Set(kitchenHolidays.map((h) => new Date(h).toISOString().slice(0, 10)));
        let daysLeft = cutoffDays;
        const cursor = new Date(deliveryDate);
        while (daysLeft > 0) {
            cursor.setDate(cursor.getDate() - 1);
            const dayOfWeek = cursor.getDay();
            const dateStr = cursor.toISOString().slice(0, 10);
            if (kitchenWorkingDays.includes(dayOfWeek) && !holidaySet.has(dateStr)) {
                daysLeft--;
            }
        }
        const [hours, minutes] = cutoffTime.split(':').map(Number);
        cursor.setHours(hours, minutes, 0, 0);
        return cursor;
    }
};
exports.CutoffService = CutoffService;
exports.CutoffService = CutoffService = __decorate([
    (0, common_1.Injectable)()
], CutoffService);
//# sourceMappingURL=cutoff.service.js.map