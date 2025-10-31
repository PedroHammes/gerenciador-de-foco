'use client'

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Signin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const router = useRouter()
    const {data: session, status} = useSession()

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

        return setLoginError('Email e/ou senha incorretos.')

    }


    return (
        <div 
        className="
        min-h-screen flex items-center justify-center
        ">
            <form onSubmit={Login}>
                <FieldSet>
                    <FieldLegend>Cadastro</FieldLegend>

                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <br />
                        <Input id="email"
                        type="email" 
                        value={email}
                        onChange={(event) =>{
                            setEmail(event.target.value)
                        }}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">Senha</FieldLabel>
                        <br />
                        <Input id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>{
                            setPassword(event.target.value)
                        }}
                        />
                    </Field>


                    <Button type="submit"
                    >
                        Entrar
                    </Button>

                    <p className="
                    text-center
                    ">Ou</p>

                    <Button asChild
                    variant={"secondary"}
                    >
                        <Link href="/signup">Cadastro</Link>
                    </Button>

                    <p onLoad={() => setLoginError('')}>
                        {loginError}
                    </p>
                </FieldSet>
            </form>

        </div>

    )

}