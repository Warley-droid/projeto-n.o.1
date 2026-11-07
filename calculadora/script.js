const tela = document.querySelector('#tela')
const mensagem = document.querySelector('#mensagem')

document.querySelector('.botoes').addEventListener('click', e => {
    const btn = e.target
    if (btn.tagName !== 'BUTTON') return

    mensagem.textContent = ''

    if (btn.dataset.action === 'limpar') tela.value = ''
    else if (btn.dataset.action === 'apagar') tela.value = tela.value.slice(0, -1)
    else if (btn.dataset.action === 'calcular') {
        try {
            let conta = tela.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/,/g, '.')

            if (!conta || !/^[0-9+\-*/.() ]+$/.test(conta)) throw Error()

            const resultado = Function(`"use strict"; return (${conta})`)()

            if (!Number.isFinite(resultado)) throw Error()

            tela.value = String(resultado).replace('.', ',')
        } catch {
            mensagem.textContent = 'Erro! Conta inválida ou impossível.'
            tela.value = ''
        }
    } else tela.value += btn.dataset.valor
})