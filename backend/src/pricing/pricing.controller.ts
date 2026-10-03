import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PricingService } from './pricing.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('pricing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PricingController {
  constructor(private pricingService: PricingService) {}

  /** GET /api/pricing/tiers */
  @Get('tiers')
  getTiers() { return this.pricingService.getAllTiers(); }

  /** POST /api/pricing/tiers */
  @Post('tiers')
  @Roles('ADMIN')
  createTier(@Body() body: any) { return this.pricingService.createTier(body); }

  /** PUT /api/pricing/dishes/:dishId/prices */
  @Put('dishes/:dishId/prices')
  @Roles('ADMIN')
  setDishPrice(
    @Param('dishId') dishId: string,
    @Body() body: { tierId: string; price: number },
  ) {
    return this.pricingService.setDishPrice(dishId, body.tierId, body.price);
  }
}
