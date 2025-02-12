import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";

interface AdminLoginProps {
  onLogin?: (data: { username: string; password: string }) => void;
}

export default function AdminLogin({
  onLogin = (data) => console.log("Tentativa de login:", data),
}: AdminLoginProps) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const handleLogin = (data: any) => {
    // Em uma aplicação real, você validaria as credenciais aqui
    if (data.username === "admin" && data.password === "admin") {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 bg-card">
        <h1 className="text-2xl font-bold mb-6">Área Administrativa</h1>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="Digite seu usuário"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Digite sua senha"
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
}
