import { listarBolosDB } from '../services/bolosService'

// Os destaques de bolo vêm do Supabase (bolos com destaque: true) —
// ver listarDestaquesBolo() abaixo. Açaí e doces ainda não têm cadastro
// no banco, então continuam com dados estáticos aqui.
export const destaquesPorCategoria = {
  acai: [
    {
      id: 'acai-300',
      nome: 'Açaí 300ml',
      descricao: '3 complementos à sua escolha.',
      preco: 16.9,
      foto: null,
      rota: '/acai/configurador',
    },
    {
      id: 'acai-500',
      nome: 'Açaí 500ml',
      descricao: 'Mais sabor para aproveitar.',
      preco: 21.9,
      foto: null,
      rota: '/acai/configurador',
    },
  ],
  doces: [],
}

export async function listarDestaquesBolo() {
  const bolos = await listarBolosDB()
  return bolos
    .filter((b) => b.destaque)
    .map((b) => ({
      id: b.id,
      nome: b.nome,
      descricao: b.descricao,
      preco: b.preco,
      foto: b.fotoUrl,
      rota: '/bolos',
    }))
}
