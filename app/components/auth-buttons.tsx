import { signIn, signOut } from "@/auth";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({
  isLoggedIn,
  userName,
}: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="auth-area">
        <div className="user-info">
          <span className="user-welcome">
            สวัสดี
          </span>

          <span className="user-name">
            {userName ?? "Nattapol Wanchan 324"}
          </span>
        </div>

        <form
          className="logout-form"
          action={async () => {
            "use server";
            await signOut({
              redirectTo: "/",
            });
          }}
        >
          <button
            type="submit"
            className="logout-button"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      className="login-form"
      action={async () => {
        "use server";

        await signIn("google", {
          redirectTo: "/",
        });
      }}
    >
      <button
        type="submit"
        className="login-button"
      >
        Login with Google
      </button>
    </form>
  );
}
//“AuthButtons ใช้จัดการการ Login และ Logout ครับ ถ้ายังไม่ได้ Login จะแสดงปุ่ม Login with Google โดยใช้ signIn ส่วนถ้า Login
// แล้วจะแสดงชื่อผู้ใช้และปุ่มออกจากระบบโดยใช้ signOut
// ซึ่งทำงานผ่าน Server Action ครับ”