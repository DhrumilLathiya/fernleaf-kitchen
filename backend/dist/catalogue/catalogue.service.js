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
exports.CatalogueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CatalogueService = class CatalogueService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories() {
        return this.prisma.category.findMany({ orderBy: { order: 'asc' } });
    }
    async createCategory(data) {
        return this.prisma.category.create({ data });
    }
    async getDishes(isActive) {
        return this.prisma.dish.findMany({
            where: isActive !== undefined ? { isActive } : {},
            include: { category: true, optionGroups: { include: { options: true } }, prices: { include: { tier: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async getDish(id) {
        return this.prisma.dish.findUnique({
            where: { id },
            include: { category: true, optionGroups: { include: { options: true } }, prices: { include: { tier: true } } },
        });
    }
    async createDish(data) {
        return this.prisma.dish.create({ data });
    }
    async updateDish(id, data) {
        return this.prisma.dish.update({ where: { id }, data });
    }
    async createOptionGroup(data) {
        return this.prisma.optionGroup.create({ data });
    }
    async createOption(data) {
        return this.prisma.option.create({ data: { ...data, portions: data.portions } });
    }
};
exports.CatalogueService = CatalogueService;
exports.CatalogueService = CatalogueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CatalogueService);
//# sourceMappingURL=catalogue.service.js.map