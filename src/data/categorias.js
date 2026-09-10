// Fonte única de verdade para a seção "Escolha sua vontade" e para o roteamento.
// Adicionar uma nova vontade (ex.: Doces) é só acrescentar um objeto aqui com
// ativa: true — nenhum componente visual precisa ser alterado.
//
// ordem      -> posição de exibição quando ativa
// ativa      -> controla se o card aparece na Home e se a rota existe
// rota       -> caminho interno (ex.: '/acai', '/bolos')
// destino    -> 'interno' (rota própria dentro deste app) | 'externo' (ainda não usado)
// corPrimaria/corSecundaria -> usadas pelo gradiente do botão e do overlay do card

export const categorias = [
  {
    id: 'bolo',
    ordem: 1,
    ativa: true,
    nome: 'Bolos',
    marca: 'Doce & Desejo',
    eyebrow: 'BOLOS ARTESANAIS',
    descricaoCurta: 'Feitos para transformar qualquer momento em algo especial.',
    cta: 'Ver bolos',
    rota: '/bolos',
    corPrimaria: '#d62f5b',
    corSecundaria: '#f14b71',
  },
  {
    id: 'acai',
    ordem: 2,
    ativa: false, // desativado temporariamente — trocar para true quando reativar
    nome: '+Ki Açaí',
    marca: '+Ki Açaí',
    eyebrow: 'AÇAÍ PREMIUM',
    descricaoCurta: 'Monte do seu jeito e aproveite cada camada de sabor.',
    cta: 'Montar meu açaí',
    rota: '/acai',
    corPrimaria: '#6c2785',
    corSecundaria: '#8b43a3',
  },
  {
    id: 'doces',
    ordem: 3,
    ativa: false, // reservado — trocar para true quando o universo de Doces estiver pronto
    nome: 'Doces',
    marca: 'Doce & Desejo',
    eyebrow: 'DOCES ARTESANAIS',
    descricaoCurta: 'Pequenos no tamanho, gigantes na vontade.',
    cta: 'Ver doces',
    rota: '/doces',
    corPrimaria: '#a3572f',
    corSecundaria: '#c97a3f',
  },
]

export function listarCategoriasAtivas() {
  return categorias
    .filter((categoria) => categoria.ativa)
    .sort((a, b) => a.ordem - b.ordem)
}

export function buscarCategoriaPorId(id) {
  return categorias.find((categoria) => categoria.id === id)
}
