import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProviderInput, UpdateProviderInput, SearchProviderInput } from '@renewly/validation';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SearchProviderInput) {
    const {
      q,
      tag,
      category,
      verified,
      active,
      sort = 'popularity',
      page = 1,
      limit = 20,
      cursor,
    } = query;

    const where: any = {
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(verified !== undefined ? { verified } : {}),
      ...(active !== undefined ? { active } : {}),
    };

    let orderBy: any = {};
    if (sort === 'popularity') {
      orderBy = { popularity: 'desc' };
    } else if (sort === 'alphabetical') {
      orderBy = { name: 'asc' };
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const findManyArgs: any = {
      where,
      orderBy,
      include: { category: true },
      take: limit,
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
      findManyArgs.skip = 1;
    } else {
      findManyArgs.skip = (page - 1) * limit;
    }

    const [items, total] = await Promise.all([
      this.prisma.provider.findMany(findManyArgs),
      this.prisma.provider.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: items.length === limit,
      nextCursor: items.length > 0 ? items[items.length - 1].id : null,
    };
  }

  async findOne(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async findBySlug(slug: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async create(data: CreateProviderInput) {
    const existing = await this.prisma.provider.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictException('Provider with this slug already exists');
    }

    return this.prisma.provider.create({
      data,
      include: { category: true },
    });
  }

  async update(id: string, data: UpdateProviderInput) {
    await this.findOne(id); // Ensure exists

    if (data.slug) {
      const existing = await this.prisma.provider.findUnique({
        where: { slug: data.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Provider with this slug already exists');
      }
    }

    return this.prisma.provider.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    
    // Prisma will throw if there are dependent subscriptions/purchases because of Restrict.
    // We should catch that and throw a proper error, or let Prisma error handle it.
    try {
      return await this.prisma.provider.delete({
        where: { id },
      });
    } catch (error) {
      throw new ConflictException('Cannot delete provider with existing subscriptions or purchases');
    }
  }
}
