import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Georgian phone number validation
 */
export const georgianPhoneSchema = z
  .string()
  .regex(/^(\+995|995)?[0-9]{9}$/, 'Invalid Georgian phone number');

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Order form schema
 */
export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: georgianPhoneSchema,
  customerAddress: z.string().min(5, 'Address is required'),
  city: z.string().default('Tbilisi'),
  productName: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1).default(1),
});

export type OrderFormData = z.infer<typeof orderSchema>;

/**
 * Validate Georgian phone number
 */
export function isValidGeorgianPhone(phone: string): boolean {
  return georgianPhoneSchema.safeParse(phone).success;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}
