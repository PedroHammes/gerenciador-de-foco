'use client'

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import Link from "next/link";

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

        return setLoginError('Dados de login incorretos.')

    }


    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={Login}
            className="flex flex-col gap-6"
            >
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input id="email"
                    className="border-2 border-zinc-50 rounded-sm"
                    type="email" 
                    value={email}
                    onChange={(event) =>{
                        setEmail(event.target.value)
                    }}
                    />
                </div>


                <div>
                    <label htmlFor="password">Senha</label>
                    <br />
                    <input id="password"
                    className="border-2 border-zinc-50 rounded-sm"
                    type="password"
                    value={password}
                    onChange={(event) =>{
                        setPassword(event.target.value)
                    }}
                    />
                </div>


                <button type="submit"
                className="border-2 border-zinc-50 rounded-sm bg-zinc-50 text-zinc-950"
                >Entrar</button>

                <p>Não possui uma conta? <br />Faça o <Link href="/signup">Cadastro</Link></p>

                <p onLoad={() => setLoginError('')}>
                    {loginError}
                </p>
            </form>
        </div>

    )

}