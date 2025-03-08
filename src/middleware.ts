import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return token?.role === "user" || token?.role === "admin";
    },
  },
  pages: {
    signIn: "/autenticar/login",
    error: "/autenticar/error", 
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
