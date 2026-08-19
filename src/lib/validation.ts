import { z } from "zod";

// Deliberately generic messages where the field is user-visible — detailed
// validation failure reasons for account fields can help an attacker
// enumerate valid accounts/formats faster than they need to.

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

export const logInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
  password: z.string().min(1, "Password is required").max(128),
});

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  address: z.string().trim().min(1, "Address is required").max(300),
  city: z.string().trim().min(1, "City is required").max(100),
  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{4,10}$/, "Enter a valid postal code"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
});

export const createOrderRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productSlug: z.string().min(1).max(200),
        quantity: z.number().int().min(1).max(50),
        selectedOptions: z.record(z.string(), z.string()).default({}),
      })
    )
    .min(1, "Cart is empty")
    .max(50),
  couponCode: z.string().trim().max(50).optional(),
  shipping: checkoutSchema,
});

export const passwordChangeSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
