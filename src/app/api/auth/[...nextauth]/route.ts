import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Get admin credentials from environment variables
        const adminUsername = process.env.ADMIN_USERNAME
        const adminPassword = process.env.ADMIN_PASSWORD
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminUsername || (!adminPassword && !adminPasswordHash)) {
          console.error('Admin credentials not configured')
          return null
        }

        // Check username
        if (credentials.username !== adminUsername) {
          return null
        }

        // Check password (prioritize hashed password if available)
        let passwordValid = false
        if (adminPasswordHash) {
          passwordValid = await bcrypt.compare(credentials.password, adminPasswordHash)
        } else if (adminPassword) {
          passwordValid = credentials.password === adminPassword
        }

        if (!passwordValid) {
          return null
        }

        // Return user object
        return {
          id: 'admin',
          name: 'Admin User',
          email: 'admin@gjsproperty.events',
          role: 'admin'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }: { token: Record<string, unknown>; user: Record<string, unknown> }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.sub as string
        (session.user as Record<string, unknown>).role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login?error=AuthenticationError'
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
