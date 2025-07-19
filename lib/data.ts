import type { Content } from "./store"

export const mockContent: Content[] = [
  // Esportes ao vivo
  {
    id: "1",
    title: "Vasco x Grêmio",
    image: "/placeholder.svg?height=300&width=500&text=Vasco+x+Grêmio+Brasileirão",
    type: "sport",
    category: "Esportes ao vivo",
    badge: "AO VIVO",
    description: "Brasileirão Série A - Sábado 17:30. Acompanhe ao vivo este clássico do futebol brasileiro.",
  },
  {
    id: "2",
    title: "Flamengo x Palmeiras",
    image: "/placeholder.svg?height=300&width=500&text=Flamengo+x+Palmeiras+Brasileirão",
    type: "sport",
    category: "Esportes ao vivo",
    badge: "AO VIVO",
    description: "Final da Copa do Brasil - Domingo 16:00. O confronto mais esperado do ano.",
  },

  // Filmes românticos
  {
    id: "3",
    title: "Todos Menos Você",
    image: "/placeholder.svg?height=300&width=500&text=Todos+Menos+Você+Romance",
    type: "movie",
    category: "Filmes românticos",
    badge: "Aurora",
    description: "Uma comédia romântica sobre encontrar o amor nos lugares mais inesperados.",
  },
  {
    id: "4",
    title: "Dublê",
    image: "/placeholder.svg?height=300&width=500&text=Dublê+Ação+Romance",
    type: "movie",
    category: "Filmes românticos",
    description: "Ação e romance se misturam nesta história emocionante sobre um dublê de Hollywood.",
  },

  // Originais e exclusivos
  {
    id: "5",
    title: "Contagem Regressiva",
    image: "/placeholder.svg?height=300&width=500&text=Contagem+Regressiva+Thriller",
    type: "movie",
    category: "Originais e exclusivos",
    badge: "AO VIVO",
    description: "Um thriller psicológico que mantém você na beira do assento até o último segundo.",
  },
  {
    id: "6",
    title: "A Linha da Extinção",
    image: "/placeholder.svg?height=300&width=500&text=A+Linha+da+Extinção+Ficção",
    type: "movie",
    category: "Originais e exclusivos",
    badge: "TOP 10",
    description: "Em um futuro pós-apocalíptico, a humanidade luta pela sobrevivência.",
  },

  // Filmes recomendados
  {
    id: "7",
    title: "Esquema de Risco",
    image: "/placeholder.svg?height=300&width=500&text=Esquema+de+Risco+Ação",
    type: "movie",
    category: "Filmes recomendados",
    badge: "Aurora",
    description: "Uma operação de alto risco que pode mudar tudo. Ação e suspense do início ao fim.",
  },
  {
    id: "8",
    title: "Y2K - O Duo do Milênio",
    image: "/placeholder.svg?height=300&width=500&text=Y2K+Comédia+Nostalgia",
    type: "movie",
    category: "Filmes recomendados",
    description: "Uma comédia nostálgica sobre os medos e esperanças da virada do milênio.",
  },

  // Séries populares
  {
    id: "9",
    title: "O Verão Que Mudou Minha Vida",
    image: "/placeholder.svg?height=300&width=500&text=O+Verão+Que+Mudou+Drama+Teen",
    type: "series",
    category: "Séries populares",
    badge: "TOP 10",
    description: "Um drama adolescente sobre amor, amizade e crescimento durante um verão inesquecível.",
  },
  {
    id: "10",
    title: "Eu, a Patroa e as Crianças",
    image: "/placeholder.svg?height=300&width=500&text=Eu+a+Patroa+Comédia+Família",
    type: "series",
    category: "Séries populares",
    description: "Uma comédia familiar que retrata o dia a dia de uma família americana típica.",
  },

  // Filmes para toda a família
  {
    id: "11",
    title: "Aventuras Mágicas",
    image: "/placeholder.svg?height=300&width=500&text=Aventuras+Mágicas+Família",
    type: "movie",
    category: "Filmes para toda a família",
    description: "Uma jornada mágica que toda a família pode desfrutar junta.",
  },
  {
    id: "12",
    title: "O Reino Encantado",
    image: "/placeholder.svg?height=300&width=500&text=O+Reino+Encantado+Fantasia",
    type: "movie",
    category: "Filmes para toda a família",
    description: "Entre em um mundo de fantasia onde tudo é possível.",
  },
]

export const mockProfiles = [
  { id: "1", name: "João", avatar: "/placeholder.svg?height=80&width=80&text=J" },
  { id: "2", name: "Maria", avatar: "/placeholder.svg?height=80&width=80&text=M" },
  { id: "3", name: "Pedro", avatar: "/placeholder.svg?height=80&width=80&text=P" },
  { id: "4", name: "Ana", avatar: "/placeholder.svg?height=80&width=80&text=A" },
]
