import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateSubscriptionInput, UpdateSubscriptionInput, SearchSubscriptionInput } from '@renewly/validation';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateSubscriptionInput) {
    return this.prisma.subscription.create({
      data: {
        ...data,
        userId,
        tags: data.tags || [],
      },
      include: { provider: true, category: true, paymentMethod: true },
    });
  }

  async findAll(userId: string, query: SearchSubscriptionInput) {
    const {
      q,
      providerId,
      categoryId,
      billingCycle,
      status,
      paymentMethodId,
      currency,
      autoRenew,
      active,
      archived,
      sort,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.SubscriptionWhereInput = {
      userId,
      deletedAt: null,
    };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { provider: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (providerId) where.providerId = providerId;
    if (categoryId) where.categoryId = categoryId;
    if (billingCycle) where.billingCycle = billingCycle;
    if (status) where.status = status;
    if (paymentMethodId) where.paymentMethodId = paymentMethodId;
    if (currency) where.currency = currency;
    if (autoRenew !== undefined) where.autoRenew = autoRenew === true;
    if (archived !== undefined) where.archived = archived === true;
    if (active === true) where.status = 'ACTIVE';
    if (active === false) where.status = { not: 'ACTIVE' };

    let orderBy: Prisma.SubscriptionOrderByWithRelationInput = { renewalDate: 'asc' };
    if (sort === 'amount') orderBy = { amount: 'desc' };
    if (sort === 'alphabetical') orderBy = { name: 'asc' };

    const [total, items] = await Promise.all([
      this.prisma.subscription.count({ where }),
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { provider: true, category: true, paymentMethod: true },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { id },
      include: { provider: true, category: true, paymentMethod: true, reminders: true },
    });

    if (!sub || sub.deletedAt) {
      throw new NotFoundException('Subscription not found');
    }

    if (sub.userId !== userId) {
      throw new ForbiddenException('You do not have access to this subscription');
    }

    return sub;
  }

  async update(userId: string, id: string, data: UpdateSubscriptionInput) {
    await this.findOne(userId, id);
    return this.prisma.subscription.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags || undefined,
      },
      include: { provider: true, category: true, paymentMethod: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.subscription.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'CANCELED', archived: true },
    });
  }

  async archive(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.subscription.update({
      where: { id },
      data: { archived: true },
    });
  }

  async restore(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.subscription.update({
      where: { id },
      data: { archived: false, deletedAt: null },
    });
  }

  async findUpcoming(userId: string) {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return this.prisma.subscription.findMany({
      where: {
        userId,
        deletedAt: null,
        archived: false,
        status: 'ACTIVE',
        renewalDate: {
          gte: today,
          lte: thirtyDaysFromNow,
        },
      },
      orderBy: { renewalDate: 'asc' },
      include: { provider: true },
    });
  }

  async findRenewing(userId: string) {
    const today = new Date();
    const startOfNextWeek = new Date();
    startOfNextWeek.setDate(today.getDate() + 7);

    return this.prisma.subscription.findMany({
      where: {
        userId,
        deletedAt: null,
        archived: false,
        status: 'ACTIVE',
        renewalDate: {
          gte: today,
          lte: startOfNextWeek,
        },
      },
      orderBy: { renewalDate: 'asc' },
      include: { provider: true },
    });
  }

  async getStatistics(userId: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId, deletedAt: null, archived: false, status: 'ACTIVE' },
    });

    let totalMonthly = 0;
    let totalAnnual = 0;
    let activeSubscriptions = subscriptions.length;
    let trialSubscriptions = subscriptions.filter(s => s.trialEndDate && s.trialEndDate > new Date()).length;

    for (const sub of subscriptions) {
      const amount = Number(sub.amount);
      if (sub.billingCycle === 'MONTHLY') {
        totalMonthly += amount;
        totalAnnual += amount * 12;
      } else if (sub.billingCycle === 'YEARLY') {
        totalAnnual += amount;
        totalMonthly += amount / 12;
      } else if (sub.billingCycle === 'QUARTERLY') {
        totalAnnual += amount * 4;
        totalMonthly += amount / 3;
      } else if (sub.billingCycle === 'WEEKLY') {
        totalAnnual += amount * 52;
        totalMonthly += (amount * 52) / 12;
      }
    }

    return {
      totalMonthlySpend: totalMonthly,
      totalAnnualSpend: totalAnnual,
      activeSubscriptions,
      trialSubscriptions,
    };
  }
}
