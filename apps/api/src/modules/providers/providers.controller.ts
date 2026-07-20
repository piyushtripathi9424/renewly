import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  CreateProviderSchema,
  UpdateProviderSchema,
  SearchProviderSchema,
  CreateProviderInput,
  UpdateProviderInput,
  SearchProviderInput,
} from '@renewly/validation';

@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  findAll(@Query(new ZodValidationPipe(SearchProviderSchema)) query: any) {
    return this.providersService.findAll(query);
  }

  @Get('search')
  search(@Query(new ZodValidationPipe(SearchProviderSchema)) query: any) {
    return this.providersService.findAll(query);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.providersService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body(new ZodValidationPipe(CreateProviderSchema)) createProviderDto: any) {
    return this.providersService.create(createProviderDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProviderSchema)) updateProviderDto: any,
  ) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}
