"use client";    

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  Field,
  FieldContent,
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
  const { data: session, status } = useSession();

  useEffect(() => {
    // Verifico se o usuário já está autenticado,
    // Se sim direciono para a página principal (/)
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]); // Dependêcias: o efeito é executado SE 'status' ou 'router mudarem'

  // Função para registrar um novo usuário no DB
  async function Register(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      // Direcione para o login se deu certo
      router.push("/signin");
    } else {
      // Responda algo se deu errado
      const errorData = await response.json();
      setError(errorData.message);
    }
  }
  

  return (
    <div
      className="
                min-h-screen flex items-center justify-center
                bg-zinc-950 text-zinc-50
                "
    >
      <FieldSet onSubmit={Register}>
        <FieldLegend>Cadastro</FieldLegend>
        <FieldDescription>Campos com * são obrigatórios</FieldDescription>

        <FieldGroup>
            <Field>
                <FieldLabel htmlFor="name">Nome *</FieldLabel>
                <br />
                <Input
                    type="text"
                    id="name"
                    placeholder="Eu Mesmo"
                    value={name}
                    onChange={(event) => {
                    setName(event.target.value);
                    }}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <br />
                <Input
                type="email"
                id="email"
                placeholder="eu@email.com"
                value={email}
                onChange={(event) => {
                setEmail(event.target.value);
                }}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <br />
                <Input
                type="password"
                id="password"
                placeholder="#Abc12"
                value={password}
                onChange={(event) => {
                setPassword(event.target.value);
                }}
                />
            </Field>
        </FieldGroup>


        <Button
        variant={"outline"}
        type="submit"
        className="
        text-zinc-950
        ">
          Registrar
        </Button>

        <p className="text-center">Ou</p>

        <Button
        variant={"default"}
        >
          <Link href="/signin">Login</Link>
        </Button>

        <p>{error}</p>
      </FieldSet>
    </div>
  );
}
