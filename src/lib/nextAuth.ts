import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      id: "domain-login",
      name: "Domain Account",
      async authorize(credentials) {
        // You should implement your actual user lookup logic here
        const user = {
          id: "1",
          name: credentials?.username,
          email: `${credentials?.username}@domain.com`
        };
        return user || null;
      },
      credentials: {
        domain: {
          label: "Domain",
          type: "text",
          placeholder: "CORPNET",
          value: "CORPNET",
        },
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
    }),
    CredentialsProvider({
      id: "intranet-credentials",
      name: "Two Factor Auth",
      async authorize(credentials) {
        // You should implement your actual user lookup logic here
        const user = {
          id: "1",
          name: credentials?.username,
          email: `${credentials?.username}@company.com`
        };
        return user || null;
      },
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        "2fa-key": { label: "2FA Key", type: "text" },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    // You can add JWT configuration here if needed
  },
  callbacks: {
    // You can add callbacks here if needed
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,  
};