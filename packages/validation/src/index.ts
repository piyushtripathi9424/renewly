import { z } from "zod";

export const Schema = z.object({});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export const VerifyEmailSchema = z.object({
  token: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

export const ProviderTypeEnum = z.enum(['ENTERTAINMENT', 'SOFTWARE', 'UTILITY', 'GAMING', 'OTHER']);

export const CreateProviderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().or(z.literal('')).nullable(),
  websiteUrl: z.string().url().optional().or(z.literal('')).nullable(),
  billingUrl: z.string().url().optional().or(z.literal('')).nullable(),
  type: ProviderTypeEnum.optional(),
  categoryId: z.string().uuid(),
  color: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  popularity: z.number().int().min(0).optional(),
  verified: z.boolean().optional(),
  active: z.boolean().optional(),
});

export const UpdateProviderSchema = CreateProviderSchema.partial();

export const SearchProviderSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  category: z.string().optional(),
  verified: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional(),
  active: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional(),
  sort: z.enum(['popularity', 'alphabetical', 'newest']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

export type CreateProviderInput = z.infer<typeof CreateProviderSchema>;
export type UpdateProviderInput = z.infer<typeof UpdateProviderSchema>;
export type SearchProviderInput = z.infer<typeof SearchProviderSchema>;
