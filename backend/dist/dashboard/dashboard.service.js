"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMetrics(role) {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);
        const todayFilter = { deliveryDate: { gte: today, lt: tomorrow } };
        const [todayOrders, inKitchen, readyToDispatch, outstanding] = await Promise.all([
            this.prisma.order.count({ where: { ...todayFilter } }),
            this.prisma.combination.count({
                where: { isStarted: true, isDone: false, orderLine: { order: { ...todayFilter } } },
            }),
            this.prisma.order.count({ where: { ...todayFilter, status: 'CONFIRMED' } }),
            this.prisma.invoice.count({ where: { isPaid: false } }),
        ]);
        if (role === 'KITCHEN') {
            const stations = await this.prisma.combination.groupBy({
                by: ['kitchenStation'],
                where: { isDone: false, orderLine: { order: { ...todayFilter, status: 'CONFIRMED' } } },
                _count: true,
            });
            return { todayOrders, inKitchen, stations };
        }
        if (role === 'DISPATCH') {
            return { todayOrders, readyToDispatch };
        }
        if (role === 'DRIVER') {
            return { myDeliveries: readyToDispatch };
        }
        const recentOrders = await this.prisma.order.findMany({
            where: todayFilter,
            include: { employee: { include: { company: true } } },
            orderBy: { deliveryDate: 'desc' },
            take: 5,
        });
        return { todayOrders, inKitchen, readyToDispatch, outstanding, recentOrders };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map