import { loja } from '../data/loja'

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function montarMensagemPedido(itens) {
  if (itens.length === 0) {
    return 'Olá! Vim pelo site Doce & Desejo e gostaria de fazer um pedido.'
  }

  const linhas = itens.map(
    (item) => `• ${item.quantidade}x ${item.nome} — ${formatarPreco(item.precoUnitario)}`,
  )

  const total = itens.reduce((soma, item) => soma + item.precoUnitario * item.quantidade, 0)

  return [
    'Olá! Vim pelo site Doce & Desejo e gostaria de fazer este pedido:',
    '',
    ...linhas,
    '',
    `Total: ${formatarPreco(total)}`,
  ].join('\n')
}

export function getLinkWhatsapp(itens) {
  const mensagem = encodeURIComponent(montarMensagemPedido(itens))
  return `https://wa.me/${loja.whatsapp}?text=${mensagem}`
}
