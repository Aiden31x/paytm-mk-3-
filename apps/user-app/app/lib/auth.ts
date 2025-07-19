import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const db = new PrismaClient();

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials: any) {
            console.log("Authorize called with:", credentials);

            if (!credentials?.phone || !credentials?.password) {
              console.log("Missing credentials");
              return null;
            }

            try {
              const existingUser = await db.user.findFirst({
                  where: { number: credentials.phone }
              });
              console.log("Existing user:", existingUser);

              if (existingUser) {
                  if (!existingUser.password) {
                      console.log("No password on user");
                      return null;
                  }
                  
                  const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                  console.log("Password valid?", passwordValidation);
                  if (passwordValidation) {
                      return {
                          id: existingUser.id.toString(),
                          name: existingUser.name,
                          email: existingUser.number
                      }
                  }
                  console.log("Password invalid");
                  return null;
              } else {
                  // Register new user
                  const hashedPassword = await bcrypt.hash(credentials.password, 10);
                  
                  const user = await db.user.create({
                      data: {
                          email: credentials.phone, // Using phone as email
                          password: hashedPassword,
                          number: credentials.phone,
                      }
                  });
                  console.log("Created new user:", user);
              
                  return {
                      id: user.id.toString(),
                      name: user.name,
                      email: user.number
                  }
              }
            } catch(e) {
                console.error("Auth error:", e);
                return null;
            }
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }
    }
}

console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);