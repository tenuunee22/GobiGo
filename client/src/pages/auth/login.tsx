import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
export default function Login() {
  const [showLogin, setShowLogin] = useState(true);
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };
  if (!showLogin) {
    return <RegisterForm onToggleForm={toggleForm} />;
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">ГобиГоу</h1>
        <p className="text-lg text-gray-600 mt-2">Хүргэлтийн үйлчилгээ</p>
      </div>
      <div className="container mx-auto w-full max-w-md px-4">
        <LoginForm onToggleForm={toggleForm} />
      </div>
    </div>
  );
}
