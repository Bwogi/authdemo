import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session, DefaultSession } from 'next-auth';
import type { UserStatus } from '@/types/next-auth';

interface ExtendedUser {
  id: string;
  isAdmin: boolean;
  status: UserStatus;
  email: string;
}

interface ExtendedSession extends Session {
  user: {
    id: string;
    isAdmin: boolean;
    status?: UserStatus;
  } & DefaultSession['user'];
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          status: user.status as UserStatus
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT & Partial<ExtendedUser>> {
      if (user) {
        return {
          ...token,
          id: user.id,
          isAdmin: user.isAdmin,
          status: user.status
        };
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          isAdmin: token.isAdmin as boolean,
          status: token.status as UserStatus
        }
      };
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
