// next-auth.d.ts
// Type augmentation for NextAuth Session so that session.user.id is available

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}
