const WHATSAPP_BOLOS = '5599984195290'

function fmt(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function gerarMensagemBolos(itens, total) {
  const linhas = itens.map((item) => {
    const preco = item.preco ? fmt(item.preco * item.quantidade) : 'a combinar'
    const obs = item.obs ? ` (${item.obs})` : ''
    return `• ${item.quantidade}x ${item.nome}${obs} — ${preco}`
  })

  const totalLinha = total > 0 ? `\nTotal: ${fmt(total)}` : '\nTotal: a combinar'

  return [
    'Olá! Vim pelo site *Sabor & Vontade* e gostaria de fazer um pedido de bolos:',
    '',
    ...linhas,
    totalLinha,
    '',
    '_Entrega a combinar. Confirmar disponibilidade._',
  ].join('\n')
}

export function gerarMensagemEncomenda(nome) {
  return `Olá! Vim pelo site *Sabor & Vontade* e gostaria de fazer uma encomenda de: *${nome}*.\n\nPoderia me informar disponibilidade e prazo?`
}

export function getLinkWhatsappBolos(itens, total) {
  const msg = gerarMensagemBolos(itens, total)
  return `https://wa.me/${WHATSAPP_BOLOS}?text=${encodeURIComponent(msg)}`
}

export function getLinkEncomenda(nome) {
  const msg = gerarMensagemEncomenda(nome)
  return `https://wa.me/${WHATSAPP_BOLOS}?text=${encodeURIComponent(msg)}`
}
