export const dynamic = 'force-dynamic';

import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { authenticator } from 'otplib'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: '2FA Token', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('Credenciais inválidas')
        }

        const isValidPassword = await compare(credentials.password, user.password)

        if (!isValidPassword) {
          throw new Error('Credenciais inválidas')
        }

        if (user.isBanned) {
          throw new Error('Usuário banido')
        }

        if (user.twoFactorEnabled && user.twoFactorSecret) {
          if (!credentials.token) {
            throw new Error('2FA_REQUIRED')
          }

          const isValidToken = authenticator.verify({
            token: credentials.token,
            secret: user.twoFactorSecret
          })

          if (!isValidToken) {
            throw new Error('Token 2FA inválido')
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
