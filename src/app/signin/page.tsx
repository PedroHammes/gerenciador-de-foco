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
        <div 
        className="
        min-h-screen flex items-center justify-center
        bg-zinc-950 text-zinc-50
        ">
            <form onSubmit={Login}
            className="flex flex-col gap-6"
            >
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input id="email"
                    className="form-input-field"
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
                    className="form-input-field"
                    type="password"
                    value={password}
                    onChange={(event) =>{
                        setPassword(event.target.value)
                    }}
                    />
                </div>


                <button type="submit"
                className="primary-button"
                >Entrar
                </button>

                <p className="
                text-center
                ">Ou</p>

                <button className="
                secondary-button
                ">
                    <Link href="/signup">Cadastro</Link>
                </button>

                <p onLoad={() => setLoginError('')}>
                    {loginError}
                </p>
            </form>
        </div>

    )

}