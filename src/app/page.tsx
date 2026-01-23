import Navbar from "@/components/landing-page/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, BarChart3, History, Check, X, Github, Linkedin, Mail } from "lucide-react";

export default function LandingPage() {
  
  // Dados das funcionalidades
  const features = [
    {
      title: "Timer Focado",
      description: "Cronômetro minimalista para sessões de foco profundo (Deep Work) sem distrações.",
      icon: <Timer className="h-10 w-10 mb-4 text-primary" />,
    },
    {
      title: "Analytics Detalhado",
      description: "Visualize para onde seu tempo está indo com gráficos claros e objetivos.",
      icon: <BarChart3 className="h-10 w-10 mb-4 text-primary" />,
    },
    {
      title: "Histórico Completo",
      description: "Acesse o registro de todas as suas sessões passadas para auditoria pessoal.",
      icon: <History className="h-10 w-10 mb-4 text-primary" />,
    }
  ];

  // Dados dos planos (Comparativo)
  const plans = [
    {
      name: "Outros Apps",
      price: "R$ 20+/mês",
      description: "Onde funcionalidades básicas costumam ser cobradas.",
      features: [
        { text: "Timer Ilimitado", included: true },
        { text: "Histórico Limitado", included: false },
        { text: "Gráficos Pagos", included: false },
        { text: "Etiquetas Pagas", included: false },
        { text: "Personalização Paga", included: false },
      ],
      buttonText: "Pagar caro",
      href: "#",
      highlight: false
    },
    {
      name: "TimeLy",
      price: "Grátis",
      description: "Tudo o que você precisa para ter foco, sem barreiras.",
      features: [
        { text: "Timer Ilimitado", included: true },
        { text: "Histórico de 30 dias", included: true },
        { text: "Gráficos Inclusos", included: true },
        { text: "Etiquetas Personalizadas", included: true },
        { text: "Timer Personalizado", included: true },
      ],
      buttonText: "Começar Agora",
      href: "/signup",
      highlight: true
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 py-24 px-6 text-center lg:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Domine seu tempo com o TimeLy
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A ferramenta essencial para quem busca saber para onde está indo seu foco e aumentar a produtividade.
        </p>
        <div className="flex gap-4">
          <Button size="lg" variant={"default"} asChild>
            <a href="/signup">
              Começar Agora
            </a>
          </Button>
          <Button size="lg" variant="outline">Saber Mais</Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Funcionalidades Principais
        </h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-center md:justify-start">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
          Por que pagar pelo básico?
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Compare e veja a diferença. O TimeLy entrega valor real desde o primeiro clique.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`flex flex-col ${plan.highlight ? 'border-primary border-2 shadow-xl scale-105 relative z-10' : 'border-border bg-slate-50 dark:bg-slate-900/50 grayscale-[0.5]'}`}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-4xl font-bold mb-6">{plan.price}</div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground line-through decoration-red-400/50'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.highlight ? "default" : "ghost"}
                  disabled={!plan.highlight} // Desabilita o botão da concorrência
                  asChild
                >
                    <a href={plan.href}>
                        {plan.buttonText}
                    </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

{/* Footer / Support / Contact */}
      <footer id="support" className="border-t py-12 px-6 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Marca e Slogan */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-xl">TimeLy</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Seu tempo, sob seu controle.
            </p>
          </div>
          
          {/* Redes Sociais e Contato */}
          <div className="flex gap-6" id="social">
            <a 
              href="https://www.linkedin.com/in/pedrohammes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com/PedroHammes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="mailto:contato@timely.com" // Ajuste para seu email real se preferir
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email de Contato"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright e Créditos */}
          <div className="flex flex-col text-center md:text-right text-sm text-muted-foreground">
            <p>© 2026 TimeLy. Todos os direitos reservados.</p>
            <p className="text-xs mt-1 opacity-70">
              Desenvolvido por <a href="https://github.com/PedroHammes" className="hover:underline">Pedro Hammes</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}