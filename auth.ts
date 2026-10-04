import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [Google],

  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      const isProductManagementPage =
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);

      if (isProductManagementPage) { // ถ้าเป็นหน้าแก้ไขหรือลบ ต้อง Login ก่อนถ้าไม่ Login ก็เข้าไม่ได้
        return Boolean(auth?.user);
      }

      return true;
    },
  },
});

// auth()	อ่าน Session
// signIn()	Login
// signOut()	Logout