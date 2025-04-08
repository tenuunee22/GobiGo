import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
export default function Register() {
  const [showLogin, setShowLogin] = useState(false);
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  return (
    <div>
      {showLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      )}
    </div>
  );
}
