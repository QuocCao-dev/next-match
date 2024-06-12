import { z } from "zod";
import { calcAge } from "../util";

export const registerSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const profileSchema = z.object({
  gender: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  dateOfBirth: z
    .string()
    .min(1, {
      message: "Date of birth is required",
    })
    .refine(
      (dateString) => {
        const age = calcAge(new Date(dateString));
        return age >= 18;
      },
      { message: "You must be at least 18 years old" }
    ),
});

export const combinedRegisterSchema = registerSchema.and(profileSchema);

export type RegisterSchema = z.infer<typeof registerSchema>;
