import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Logo } from "@/components/ui/Logo";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-card">
        <Logo className="login-logo" />
        <h1 className="login-heading">Private portfolio</h1>
        <p className="login-copy">Enter the password to continue.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
