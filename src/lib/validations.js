import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).default('user'),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

const PLATFORMS = ['phone', 'whatsapp', 'instagram', 'facebook', 'twitter', 'tiktok', 'website'];

export const socialLinkSchema = z.object({
  platform: z.enum(PLATFORMS),
  value: z.string().min(1, 'Value is required'),
});

export const updateSocialLinkSchema = z.object({
  value: z.string().min(1, 'Value is required'),
});

export const menuItemSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});
