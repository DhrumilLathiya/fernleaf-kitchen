import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CutoffService } from './cutoff.service';
import { SettingsModule } from '../settings/settings.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [SettingsModule, PricingModule],
  providers: [OrdersService, CutoffService],
  controllers: [OrdersController],
})
export class OrdersModule {}
