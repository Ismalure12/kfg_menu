import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'),
});

export const createUserSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user'], { error: 'Role must be admin or user' }).default('user'),
});

export const updateUserSchema = z.object({
  email: z.email({ error: 'Invalid email address' }).optional(),
  role: z.enum(['admin', 'user'], { error: 'Role must be admin or user' }).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
});

export const resetPasswordSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  code: z.string().length(6, 'Reset code must be exactly 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be 100 characters or less'),
  imageUrl: z.url({ error: 'Image must be a valid URL' }).nullable().optional(),
  sortOrder: z.number({ error: 'Sort order must be a number' })
    .int('Sort order must be a whole number')
    .min(0, 'Sort order must be 0 or greater')
    .optional()
    .default(0),
  isActive: z.boolean({ error: 'isActive must be true or false' }).optional().default(true),
});

const PLATFORMS = ['phone', 'whatsapp', 'instagram', 'facebook', 'twitter', 'tiktok', 'website'];

export const socialLinkSchema = z.object({
  platform: z.enum(PLATFORMS, { error: `Platform must be one of: ${PLATFORMS.join(', ')}` }),
  value: z.string().min(1, 'Value is required'),
});

export const updateSocialLinkSchema = z.object({
  value: z.string().min(1, 'Value is required'),
});

export const menuItemSchema = z.object({
  categoryId: z.number({ error: 'Category ID must be a number' })
    .int('Category ID must be a whole number')
    .positive('Category ID must be a positive number'),
  name: z.string()
    .min(1, 'Item name is required')
    .max(200, 'Item name must be 200 characters or less'),
  description: z.string()
    .max(1000, 'Description must be 1000 characters or less')
    .nullable()
    .optional(),
  price: z.number({ error: 'Price must be a number' })
    .positive('Price must be greater than 0'),
  imageUrl: z.url({ error: 'Image must be a valid URL' }).nullable().optional(),
  sortOrder: z.number({ error: 'Sort order must be a number' })
    .int('Sort order must be a whole number')
    .min(0, 'Sort order must be 0 or greater')
    .optional()
    .default(0),
  isActive: z.boolean({ error: 'isActive must be true or false' }).optional().default(true),
});

export const subItemSchema = z.object({
  menuItemId: z.number({ error: 'Menu item ID must be a number' })
    .int('Menu item ID must be a whole number')
    .positive('Menu item ID must be a positive number'),
  name: z.string()
    .min(1, 'Sub-item name is required')
    .max(200, 'Sub-item name must be 200 characters or less'),
  price: z.number({ error: 'Price must be a number' })
    .positive('Price must be greater than 0'),
  sortOrder: z.number({ error: 'Sort order must be a number' })
    .int('Sort order must be a whole number')
    .min(0, 'Sort order must be 0 or greater')
    .optional()
    .default(0),
  isActive: z.boolean({ error: 'isActive must be true or false' }).optional().default(true),
});
// import { z } from 'zod';

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(1),
// });

// export const createUserSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   role: z.enum(['admin', 'user']).default('user'),
// });

// export const updateUserSchema = z.object({
//   email: z.string().email().optional(),
//   role: z.enum(['admin', 'user']).optional(),
// });

// export const forgotPasswordSchema = z.object({
//   email: z.string().email(),
// });

// export const resetPasswordSchema = z.object({
//   email: z.string().email(),
//   code: z.string().length(6),
//   newPassword: z.string().min(6, 'Password must be at least 6 characters'),
// });

// export const changePasswordSchema = z.object({
//   currentPassword: z.string().min(1),
//   newPassword: z.string().min(6, 'Password must be at least 6 characters'),
// });

// export const categorySchema = z.object({
//   name: z.string().min(1).max(100),
//   imageUrl: z.string().url().nullable().optional(),
//   sortOrder: z.number().int().min(0).optional().default(0),
//   isActive: z.boolean().optional().default(true),
// });

// const PLATFORMS = ['phone', 'whatsapp', 'instagram', 'facebook', 'twitter', 'tiktok', 'website'];

// export const socialLinkSchema = z.object({
//   platform: z.enum(PLATFORMS),
//   value: z.string().min(1, 'Value is required'),
// });

// export const updateSocialLinkSchema = z.object({
//   value: z.string().min(1, 'Value is required'),
// });

// export const menuItemSchema = z.object({
//   categoryId: z.number().int().positive(),
//   name: z.string().min(1).max(200),
//   description: z.string().max(1000).nullable().optional(),
//   price: z.number().positive(),
//   imageUrl: z.string().url().nullable().optional(),
//   sortOrder: z.number().int().min(0).optional().default(0),
//   isActive: z.boolean().optional().default(true),
// });

// export const subItemSchema = z.object({
//   menuItemId: z.number().int().positive(),
//   name: z.string().min(1).max(200),
//   price: z.number().positive(),
//   sortOrder: z.number().int().min(0).optional().default(0),
//   isActive: z.boolean().optional().default(true),
// });
