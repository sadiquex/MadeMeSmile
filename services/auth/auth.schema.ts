import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .transform((s) => s.trim());

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters long");

/** Login form: email + password */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** Register form: displayName + email + password + confirmPassword */
export const registerFormSchema = z
  .object({
    displayName: z
      .string()
      .min(1, "Full name is required")
      .transform((s) => s.trim()),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
