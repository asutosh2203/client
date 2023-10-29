import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        '183825655660-caa49ujgf0f4uca82n01vad6lubpn32m.apps.googleusercontent.com',
      clientSecret: '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',
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = token.id;
      return session;
    },
  },
  secret: 'Tze5VmwwzQX4lBtCGqsy7Bx7dNJ8N0NFNFwk4TplI8s=',
});
