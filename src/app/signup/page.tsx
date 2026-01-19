"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FieldSet,
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  async function Register(event: React.FormEvent) {
    event.preventDefault();
    setError(""); // Limpa erro anterior ao tentar novamente

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      router.push("/signin");
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Erro ao criar conta.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      {/* Container do Cartão */}
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-slate-100">
        
        {/* Cabeçalho Visual */}
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Comece a gerenciar seu foco hoje mesmo
          </p>
        </div>

        <form onSubmit={Register} className="mt-8 space-y-6">
          <FieldSet>
            
            <Field>
              <FieldLabel htmlFor="name" className="text-sm font-medium">
                Nome *
              </FieldLabel>
              <Input
                type="text"
                id="name"
                placeholder="José Bezerra"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-md border p-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-black"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="text-sm font-medium">
                Email *
              </FieldLabel>
              <Input
                type="email"
                id="email"
                placeholder="josebezerra@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-md border p-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-black"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="text-sm font-medium">
                Senha *
              </FieldLabel>
              <Input
                type="password"
                id="password"
                placeholder="#Abc12"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-md border p-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-black"
              />
            </Field>

            <Button type="submit" className="w-full">
              Registrar
            </Button>
            
            {/* Exibição de Erro */}
            {error && (
                <p className="text-center text-sm text-red-500 mt-2">
                    {error}
                </p>
            )}

          </FieldSet>
        </form>

        {/* Rodapé do Cartão */}
        <div className="text-center text-sm">
          <span className="text-gray-500">Já tem uma conta? </span>
          <Link href="/signin" className="font-semibold text-black hover:underline">
            Faça login
          </Link>
        </div>

      </div>
    </div>
  );
}