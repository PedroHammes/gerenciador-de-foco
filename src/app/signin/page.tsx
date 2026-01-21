'use client'

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Signin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const router = useRouter()
    const {status} = useSession()

    useEffect(() => {
        // Verifico se o usuário já está autenticado,
        // Se sim direciono para a página principal (/)
        if (status === "authenticated") {
            router.push("/")
        }
    }, [status, router]) // Dependêcias: o efeito é executado SE 'status' ou 'router mudarem'



    async function Login(event: React.FormEvent) {
        event.preventDefault()
        setLoginError('')

        // Usar a função signIn do NextAuth para cuidar do login.
        const sucessfullLogin = await signIn("credentials", {
            redirect: false,
            email,
            password
        })

        if (sucessfullLogin.ok) {
            return router.push('/')
        }
        toast.error("Email e/ou senha incorretos.")
        return setLoginError('Email e/ou senha incorretos.')

    }


    return (
        <div 
        className="
        flex min-h-screen flex-col items-center justify-center 
        bg-slate-50 px-4
        ">
            <div className="
            w-full max-w-md space-y-8 rounded-xl 
            bg-white p-10 shadow-lg border border-slate-100
            ">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                        Bem-vindo de volta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Acesse sua conta para gerenciar seu foco
                    </p>
                </div>

            <form onSubmit={Login} className="mt-8 space-y-6">
                <FieldSet>
                    <Field>
                        <FieldLabel htmlFor="email"
                        className="text-sm font-medium"
                        >Email</FieldLabel>
                        <Input id="email"
                        type="email" 
                        value={email}
                        onChange={(event) =>{
                            setEmail(event.target.value)
                        }}
                        placeholder="seu@email.com"
                        className="
                        rounded-md border p-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-black"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password"
                        className="text-sm font-medium"
                        >Senha</FieldLabel>
                        <Input id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>{
                            setPassword(event.target.value)
                        }}
                        className="
                        rounded-md border p-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-black
                        "/>
                    </Field>


                    <Button type="submit"
                    className="w-full"
                    >
                        Entrar
                    </Button>
                    <p onLoad={() => setLoginError('')}>
                        {loginError}
                    </p>
                </FieldSet>
            </form>
            <div className="text-center text-sm">
                <span className="text-gray-500">Não tem uma conta? </span>
                <Link href="/signup" className="font-semibold text-black hover:underline">
                    Cadastre-se gratuitamente
                </Link>
            </div>
            </div>
        </div>

    )

}