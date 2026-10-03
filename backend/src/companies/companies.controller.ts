import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompaniesService } from './companies.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('companies')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get() getAll() { return this.companiesService.getAll(); }
  @Get(':id') getOne(@Param('id') id: string) { return this.companiesService.getOne(id); }

  @Post() @Roles('ADMIN')
  create(@Body() body: any) { return this.companiesService.create(body); }

  @Put(':id') @Roles('ADMIN')
  update(@Param('id') id: string, @Body() body: any) { return this.companiesService.update(id, body); }
}
