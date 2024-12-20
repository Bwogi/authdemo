import 'next-auth';
import { DefaultSession } from 'next-auth';

type UserStatus = 'pending' | 'approved' | 'rejected';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      status?: UserStatus;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    status?: UserStatus;
  }

  interface JWT {
    id: string;
    isAdmin: boolean;
    status?: UserStatus;
  }
}
