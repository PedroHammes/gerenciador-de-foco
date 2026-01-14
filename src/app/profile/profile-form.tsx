'use client'
// Este arquivo é um componente de formulário de perfil de usuário em React/Next.js
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

// Imports de UI
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


interface ProfileFormProps {
  user: {
    name?: string | null
    email?: string | null
    phone?: string | null
    gender?: string | null
    city?: string | null
    profilePic?: string | null
    birthDate?: Date | null
  }
}

export default function ProfileForm({user: user}: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({ // Estado para armazenar os dados do formulário
    name: user.name || '',
    email: user.email || '',
    password: '',
    phone: user.phone || '',
    gender: user.gender || '',
    city: user.city || '',
    profilePic: user.profilePic || '',
    birthDate: user.birthDate
      ? user.birthDate.toISOString().split('T')[0]
      : ""
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Perfil atualizado com sucesso!')
        router.refresh() // Atualiza os dados da página
      } else {
        alert('Erro ao atualizar o perfil.')
      }
    } catch (error) {
      console.error(error)
      alert('Erro inesperado ao atualizar o perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FieldGroup>
        <FieldSet>
            <FieldLegend>Informações básicas</FieldLegend>
            <Field>
              <FieldLabel htmlFor="name">Nome: </FieldLabel>
              <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({
                ...formData,
                name: e.target.value
              })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email: </FieldLabel>
              <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({
                ...formData,
                email: e.target.value
              })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha: </FieldLabel>
              <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value
              })}
              />
            </Field>
        </FieldSet>
        <FieldSeparator/>
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Informações de Contato</FieldLegend>
          <Field>
            <FieldLabel htmlFor="phone">Telefone:</FieldLabel>
            <Input
            id="phone"
            type="tel"
            value={formData.phone}
              onChange={(e) => setFormData({
                ...formData,
                phone: e.target.value
              })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="city">Cidade</FieldLabel>
            <Input
            id="city"
            type="text"
            value={formData.city}
              onChange={(e) => setFormData({
                ...formData,
                city: e.target.value
              })}
            />
          </Field>
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Informações adicionais</FieldLegend>
          <Field>
            <FieldLabel htmlFor="profilePic">Foto de perfil: </FieldLabel>
            <Input
            id="profilePic"
            type="text"
            value={formData.profilePic}
            onChange={(e) => setFormData({
              ...formData,
              profilePic: e.target.value
            })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="birthDate">Data de nascimento: </FieldLabel>
            <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({
              ...formData,
              birthDate: e.target.value
            })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="gender">Com qual gênero você se identifica? </FieldLabel>
            <RadioGroup
            value={formData.gender} 
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
            className="flex gap-4 mt-2"
            >
              <div>
                <RadioGroupItem
                value="male"
                id="male"
                />
                <Label>Masculino</Label>
              </div>
              <div>
                <RadioGroupItem
                value="female"
                id="female"
                />
                <Label>Feminino</Label>
              </div>
              <div>
                <RadioGroupItem
                value="other"
                id="other"
                />
                <Label>Outro</Label>
              </div>
            </RadioGroup>
          </Field>
        </FieldSet>
      </FieldGroup>
      <div className="pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  )
}