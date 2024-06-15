"use server";

import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/schemas/loginSchema";
import {
  RegisterSchema,
  combinedRegisterSchema,
} from "@/lib/schemas/registerSchema";
import { generateToken, getTokenByToken } from "@/lib/token";
import { ActionResult } from "@/types";
import { TokenType, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "../auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";

export async function singInUser(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    const { email, password } = data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email) {
      return {
        status: "error",
        error: "Invalid credentials",
      };
    }

    if (!existingUser.emailVerified) {
      const token = await generateToken(
        existingUser.email,
        TokenType.VERIFICATION
      );

      return {
        status: "error",
        error: "Please verify email address before logging in.",
      };
    }

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
        profileComplete: true,
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

    const verificationToken = await generateToken(
      email,
      TokenType.VERIFICATION
    );

    await sendVerificationEmail(
      "william123zzz@yopmail.com",
      verificationToken.token
    );

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

export async function verifyEmail(token: string) {
  const existingToken = await getTokenByToken(token);

  if (!existingToken) {
    return {
      status: "error",
      error: "Invalid token",
    };
  }

  const hasExpired = new Date() > existingToken.expires;

  if (hasExpired) {
    return {
      status: "error",
      error: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { status: "error", error: "User not found" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date() },
  });

  await prisma.token.delete({
    where: { id: existingToken.id },
  });

  return {
    status: "success",
    data: "Email verified",
  };
}

export async function generateResetPasswordEmail(
  email: string
): Promise<ActionResult<string>> {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return {
        status: "error",
        error: "User not found",
      };
    }

    const token = await generateToken(email, TokenType.PASSWORD_RESET);

    await sendPasswordResetEmail(email, token.token);

    return {
      status: "success",
      data: "Email sent",
    };
  } catch (error) {
    return {
      status: "error",
      error: "Something went wrong. Please try again later.",
    };
  }
}

export async function resetPassword(
  password: string,
  token: string | null
): Promise<ActionResult<string>> {
  if (!token) return { status: "error", error: "Invalid token" };
  const existingToken = await getTokenByToken(token);

  if (!existingToken) {
    return {
      status: "error",
      error: "Invalid token",
    };
  }

  const hasExpired = new Date() > existingToken.expires;

  if (hasExpired) {
    return {
      status: "error",
      error: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { status: "error", error: "User not found" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { passwordHash: hashedPassword },
  });

  await prisma.token.delete({
    where: { id: existingToken.id },
  });

  return {
    status: "success",
    data: "Password reset",
  };
}
