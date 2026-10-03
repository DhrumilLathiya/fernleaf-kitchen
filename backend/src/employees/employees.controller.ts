import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeesService } from './employees.service';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('employees')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get() getAll(@Query('companyId') companyId?: string) {
    return this.employeesService.getAll(companyId);
  }
  @Get(':id') getOne(@Param('id') id: string) { return this.employeesService.getOne(id); }

  @Post() @Roles('ADMIN')
  create(@Body() body: any) { return this.employeesService.create(body); }

  @Put(':id') @Roles('ADMIN')
  update(@Param('id') id: string, @Body() body: any) { return this.employeesService.update(id, body); }
}
