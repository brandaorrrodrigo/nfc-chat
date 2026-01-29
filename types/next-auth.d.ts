/**
 * NextAuth Type Extensions
 * Estende os tipos padrão do NextAuth para incluir campos customizados
 */

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      is_admin?: boolean;
      is_premium?: boolean;
      is_founder?: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    is_admin?: boolean;
    is_premium?: boolean;
    is_founder?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    is_admin?: boolean;
    is_premium?: boolean;
    is_founder?: boolean;
  }
}
