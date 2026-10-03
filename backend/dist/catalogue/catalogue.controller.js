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
exports.CatalogueController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const catalogue_service_1 = require("./catalogue.service");
const roles_guard_1 = require("../auth/roles.guard");
let CatalogueController = class CatalogueController {
    catalogueService;
    constructor(catalogueService) {
        this.catalogueService = catalogueService;
    }
    getCategories() { return this.catalogueService.getCategories(); }
    createCategory(body) { return this.catalogueService.createCategory(body); }
    getDishes(isActive) {
        return this.catalogueService.getDishes(isActive !== undefined ? isActive === 'true' : undefined);
    }
    getDish(id) { return this.catalogueService.getDish(id); }
    createDish(body) { return this.catalogueService.createDish(body); }
    updateDish(id, body) {
        return this.catalogueService.updateDish(id, body);
    }
    createOptionGroup(body) { return this.catalogueService.createOptionGroup(body); }
    createOption(body) { return this.catalogueService.createOption(body); }
};
exports.CatalogueController = CatalogueController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('dishes'),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "getDishes", null);
__decorate([
    (0, common_1.Get)('dishes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "getDish", null);
__decorate([
    (0, common_1.Post)('dishes'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "createDish", null);
__decorate([
    (0, common_1.Put)('dishes/:id'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "updateDish", null);
__decorate([
    (0, common_1.Post)('option-groups'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "createOptionGroup", null);
__decorate([
    (0, common_1.Post)('options'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "createOption", null);
exports.CatalogueController = CatalogueController = __decorate([
    (0, common_1.Controller)('catalogue'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [catalogue_service_1.CatalogueService])
], CatalogueController);
//# sourceMappingURL=catalogue.controller.js.map