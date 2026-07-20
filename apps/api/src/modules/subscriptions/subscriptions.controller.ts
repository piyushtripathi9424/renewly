import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  SearchSubscriptionSchema,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  SearchSubscriptionInput,
} from '@renewly/validation';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('upcoming')
  findUpcoming(@Request() req: any) {
    return this.subscriptionsService.findUpcoming(req.user.id);
  }

  @Get('renewing')
  findRenewing(@Request() req: any) {
    return this.subscriptionsService.findRenewing(req.user.id);
  }

  @Get('statistics')
  getStatistics(@Request() req: any) {
    return this.subscriptionsService.getStatistics(req.user.id);
  }

  @Get()
  findAll(@Request() req: any, @Query(new ZodValidationPipe(SearchSubscriptionSchema)) query: any) {
    return this.subscriptionsService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.subscriptionsService.findOne(req.user.id, id);
  }

  @Post()
  create(@Request() req: any, @Body(new ZodValidationPipe(CreateSubscriptionSchema)) createDto: any) {
    return this.subscriptionsService.create(req.user.id, createDto);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateSubscriptionSchema)) updateDto: any,
  ) {
    return this.subscriptionsService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.subscriptionsService.remove(req.user.id, id);
  }

  @Post(':id/archive')
  archive(@Request() req: any, @Param('id') id: string) {
    return this.subscriptionsService.archive(req.user.id, id);
  }

  @Post(':id/restore')
  restore(@Request() req: any, @Param('id') id: string) {
    return this.subscriptionsService.restore(req.user.id, id);
  }
}
