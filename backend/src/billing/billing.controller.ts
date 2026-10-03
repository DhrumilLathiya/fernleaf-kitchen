import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('billing')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  /** GET /api/billing/invoices */
  @Get('invoices')
  listInvoices(@Query('companyId') companyId?: string) {
    return this.billingService.listInvoices(companyId);
  }

  /** GET /api/billing/companies/:id/un-invoiced */
  @Get('companies/:id/un-invoiced')
  @Roles('ADMIN')
  getUnInvoiced(@Param('id') companyId: string) {
    return this.billingService.getUnInvoiced(companyId);
  }

  /** POST /api/billing/invoices */
  @Post('invoices')
  @Roles('ADMIN')
  createInvoice(@Body() body: { companyId: string; orderIds: string[] }) {
    return this.billingService.createInvoice(body.companyId, body.orderIds);
  }

  /** PUT /api/billing/invoices/:id/pay */
  @Put('invoices/:id/pay')
  @Roles('ADMIN')
  markPaid(@Param('id') invoiceId: string) {
    return this.billingService.markPaid(invoiceId);
  }
}
