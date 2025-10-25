'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Signup() {        

        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [error, setError] = useState('')
        const router = useRouter()
        const {data: session, status} = useSession()
        
        useEffect(() => {
                // Verifico se o usuário já está autenticado,
                // Se sim direciono para a página principal (/)
                if (status === "authenticated") {
                        router.push("/")
                }
        }, [status, router]) // Dependêcias: o efeito é executado SE 'status' ou 'router mudarem'


        // Função para registrar um novo usuário no DB
        async function Register(event: React.FormEvent) {
                event.preventDefault()    

                const response = await fetch('/api/auth/signup', {
                        method: "POST",
                        headers: {
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email, password}) 
                })
                
                if (response.ok) {
                        // Direcione para o login se deu certo
                        router.push('/signin')

                } else {
                       // Responda algo se deu errado 
                       const errorData = await response.json()
                       setError(errorData.message)
                }
        }

        return (
                <div className="
                min-h-screen flex items-center justify-center
                bg-zinc-950 text-zinc-50
                ">
                        <form onSubmit={Register}
                        className="flex flex-col gap-6"
                        >
                                <div>
                                        <label htmlFor="email">Email</label>
                                        <br />
                                        <input type="email" id="email"
                                        className="form-input-field"
                                        value={email}
                                        onChange={(event) => { 
                                                setEmail(event.target.value)
                                        }}
                                        />
                                </div>

                                <div>
                                        <label htmlFor="password">Senha</label>
                                        <br />
                                        <input type="password" id="password"
                                        className="form-input-field"
                                        value={password}
                                        onChange={(event) => { 
                                                setPassword(event.target.value)
                                        }}
                                        />
                                </div>

                                <button type="submit"
                                className="primary-button"
                                >
                                        Registrar
                                </button>

                                <p className="text-center">Ou</p>
                        
                                <button className="
                                secondary-button
                                ">
                                        <Link href="/signin">Login</Link>
                                </button>

                                <p>{error}</p>
                        </form>
                </div>
        )
}