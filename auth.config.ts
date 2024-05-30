import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";

export default {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);

        if (validated.success) {
          const { email, password } = validated.data;

          const user = await getUserByEmail(email);

          if (!user || !(await compare(password, user.passwordHash!)))
            return null;

          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
