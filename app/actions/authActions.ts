"use server";

import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import {
  RegisterSchema,
  combinedRegisterSchema,
  registerSchema,
} from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "../auth";

export async function singInUser(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    const { email, password } = data;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      status: "success",
      data: "Logged in",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: "error",
            error: "Invalid credentials",
          };

        default:
          return {
            status: "error",
            error: "Something went wrong. Please try again later.",
          };
      }
    } else {
      return {
        status: "error",
        error: "Something went wrong. Please try again later.",
      };
    }
  }
}

export async function registerUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = combinedRegisterSchema.safeParse(data);

    if (!validated.success) {
      return {
        status: "error",
        error: validated.error.errors,
      };
    }

    const {
      name,
      email,
      password,
      gender,
      description,
      dateOfBirth,
      city,
      country,
    } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        status: "error",
        error: "User already exists",
      };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        member: {
          create: {
            name,
            description,
            city,
            country,
            dateOfBirth: new Date(dateOfBirth),
            gender,
          },
        },
      },
    });

    return {
      status: "success",
      data: user,
    };
  } catch (error: unknown) {
    return {
      status: "error",
      error: "Something went wrong. Please try again later.",
    };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getAuthUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");
  return userId;
}
