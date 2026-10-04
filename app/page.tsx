import ProductExplorer from "./components/ProductExplorer";
import { auth } from "@/auth";
import { AuthButtons } from "./components/auth-buttons";

export default async function Home() {
  const session = await auth();

  const isLoggedIn = Boolean(
    session?.user
  );

  return (
    <>
      <AuthButtons
        isLoggedIn={isLoggedIn}
        userName={session?.user?.name}
      />

      <ProductExplorer
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}