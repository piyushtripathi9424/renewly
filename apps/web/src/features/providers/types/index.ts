export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  billingUrl: string | null;
  type: string;
  categoryId: string;
  category: Category;
  color: string | null;
  tags: string[];
  popularity: number;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProviders {
  items: Provider[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  nextCursor: string | null;
}
