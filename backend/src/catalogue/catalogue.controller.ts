import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CatalogueService } from './catalogue.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('catalogue')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  // ----- Categories -----
  /** GET /api/catalogue/categories */
  @Get('categories')
  getCategories() { return this.catalogueService.getCategories(); }

  /** POST /api/catalogue/categories */
  @Post('categories')
  @Roles('ADMIN')
  createCategory(@Body() body: any) { return this.catalogueService.createCategory(body); }

  // ----- Dishes -----
  /** GET /api/catalogue/dishes */
  @Get('dishes')
  getDishes(@Query('isActive') isActive?: string) {
    return this.catalogueService.getDishes(isActive !== undefined ? isActive === 'true' : undefined);
  }

  /** GET /api/catalogue/dishes/:id */
  @Get('dishes/:id')
  getDish(@Param('id') id: string) { return this.catalogueService.getDish(id); }

  /** POST /api/catalogue/dishes */
  @Post('dishes')
  @Roles('ADMIN')
  createDish(@Body() body: any) { return this.catalogueService.createDish(body); }

  /** PUT /api/catalogue/dishes/:id */
  @Put('dishes/:id')
  @Roles('ADMIN')
  updateDish(@Param('id') id: string, @Body() body: any) {
    return this.catalogueService.updateDish(id, body);
  }

  // ----- Option Groups -----
  /** POST /api/catalogue/option-groups */
  @Post('option-groups')
  @Roles('ADMIN')
  createOptionGroup(@Body() body: any) { return this.catalogueService.createOptionGroup(body); }

  // ----- Options -----
  /** POST /api/catalogue/options */
  @Post('options')
  @Roles('ADMIN')
  createOption(@Body() body: any) { return this.catalogueService.createOption(body); }
}
