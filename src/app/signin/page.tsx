"use cliet"
import { useState } from "react"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"

export default function Signin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const router = useRouter()


    async function Login(event: React.FormEvent) {
        event.preventDefault()

        // Usar a função signIn do NextAuth para cuidar do login.
        const sucessfullLogin = await signIn("credentials", {
            redirect: false,
            email,
            password
        })

        if (sucessfullLogin.ok) {
            return router.push('/home')
        }

        return setLoginError('Dados de login incorretos.')

    }


    return (
        <form onSubmit={Login}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(event) =>{
                    setEmail(event.target.value)
                }}
            />

            <input
                type="password"
                placeholder="Senha" 
                value={password}
                onChange={(event) =>{
                    setPassword(event.target.value)
                }}
            />
            <button type="submit">Entrar</button>
            <p onLoad={() => setLoginError('')}>
                {loginError}
            </p>
        </form>
    )

}