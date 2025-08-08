import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      subscription?: string
      flowAccess?: boolean
      companyName?: string
      companyType?: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Development credentials provider for testing
    CredentialsProvider({
      name: "Development",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For development, accept any email/password combination
        if (credentials?.email && credentials?.password) {
          // Return a development user without database calls
          return {
            id: "dev-user-id",
            email: credentials.email,
            name: credentials.email.split('@')[0],
            image: null,
          }
        }
        return null
      }
    }),
    // Google OAuth for production (only if credentials are provided)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // Always allow signin in development
      return true
    },
    session: async ({ session, token }) => {
      // Simplified session handling for development
      if (session?.user?.email) {
        session.user.id = token.sub || "dev-user-id"
        session.user.subscription = "BASIC"
        session.user.flowAccess = true
        session.user.companyName = "Avanee Books Pro"
        session.user.companyType = "bookkeeping"
      }
      return session
    },
    jwt: async ({ token, account, profile }) => {
      return token
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
}
