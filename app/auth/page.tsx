import CreateAdminUser from "@/components/create-admin-user";
import { LoginForm } from "@/components/login-form";
import { NEXT_PUBLIC_BASE_URL } from "@/const";

export default async function AuthPage() {
  const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/auth`, {
    cache: "no-store",
  });
  const data = await res.json();

  if (data.status === true) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <CreateAdminUser />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    );
  }
}
