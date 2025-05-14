import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/lib/validations/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        try {
          console.log("Starting credentials authorization...")
          
          const validatedFields = LoginSchema.safeParse(credentials)

          if (!validatedFields.success) {
            console.log("Invalid credentials format:", validatedFields.error)
            return null
          }

          const { email, password } = validatedFields.data
          console.log("Looking up user:", email)

          const user = await db.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            console.log("User not found or no password set")
            return null
          }

          console.log("Comparing passwords...")
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (!passwordsMatch) {
            console.log("Passwords don't match")
            return null
          }

          console.log("Authentication successful for user:", user.id)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }

      return token
    },
  },
}) 