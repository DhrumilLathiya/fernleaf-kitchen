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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const pricing_service_1 = require("./pricing.service");
const roles_guard_1 = require("../auth/roles.guard");
let PricingController = class PricingController {
    pricingService;
    constructor(pricingService) {
        this.pricingService = pricingService;
    }
    getTiers() { return this.pricingService.getAllTiers(); }
    createTier(body) { return this.pricingService.createTier(body); }
    setDishPrice(dishId, body) {
        return this.pricingService.setDishPrice(dishId, body.tierId, body.price);
    }
};
exports.PricingController = PricingController;
__decorate([
    (0, common_1.Get)('tiers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "getTiers", null);
__decorate([
    (0, common_1.Post)('tiers'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "createTier", null);
__decorate([
    (0, common_1.Put)('dishes/:dishId/prices'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('dishId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "setDishPrice", null);
exports.PricingController = PricingController = __decorate([
    (0, common_1.Controller)('pricing'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService])
], PricingController);
//# sourceMappingURL=pricing.controller.js.map