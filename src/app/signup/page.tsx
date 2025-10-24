'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

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
                <form onSubmit={Register}>
                        <input type="email" 
                        value={email}
                        onChange={(event) => { 
                                setEmail(event.target.value)
                        }}
                        />

                        <input type="password"
                        value={password}
                        onChange={(event) => { 
                                setPassword(event.target.value)
                        }}
                        />

                        <button type="submit">Registrar</button>
                        <p>
                                {error}
                        </p>
                </form>
        )
}