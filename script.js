function carregar(){

    const comprimento = window.document.querySelector('h1#comprimento')
    const phora = window.document.querySelector('p#phora')
    const iHdia = window.document.querySelector('img#hdia')
    const iDiasem = window.document.querySelector('img#diasem')

    const agora = new Date()
    const ahora = agora.getHours()
    const minutos = agora.getMinutes()
    const segundos = agora.getSeconds()
    const diaSem = agora.getDay()

    function zero(numero){
        return numero < 10 ? `0${numero}` : numero
    }

        phora.innerHTML = `${zero(ahora)}:${zero(minutos)}:${zero(segundos)}`

        if (ahora >= 0 && ahora <= 5){
            comprimento.innerHTML = `Bom dia!`
            iHdia.src = 'imagens/noite.300.jpg'
            window.document.body.style.backgroundColor = 'rgb(30, 41, 59)'
        }
        else if (ahora > 5 && ahora < 12){
            comprimento.innerHTML = `Bom dia!`
            iHdia.src = `imagens/manha.300.jpg`
            window.document.body.style.backgroundColor = 'rgb(204, 251, 241)'
            phora.style.color = 'rgb(24, 87, 104)'
        }
        else if (ahora >= 12 && ahora < 18){
            comprimento.innerHTML = `Boa tarde!`
            iHdia.src = `imagens/meio-dia.300.jpg`
            window.document.body.style.backgroundColor = 'rgb(186, 230, 253)'
            phora.style.color = 'rgb(24, 87, 104)'
        }
        else if (ahora > 12 && ahora < 24){
            comprimento.innerHTML = `Boa noite!`
            iHdia.src = `imagens/noite.300.jpg`
            window.document.body.style.backgroundColor = 'rgb(30, 41, 59)'
        }
        else{
            comprimento.innerHTML = `[ERRO]`
            phora.innerHTML = `[ERRO]`
            window.alert('Erro no sistema! Tente recarregar a página.')
        }

        switch(diaSem){
            case 0:
                iDiasem.src ='imagens/domingo.350.png'
                break

            case 1:
                iDiasem.src ='imagens/segunda.350.png'
                break

            case 2:
                iDiasem.src ='imagens/terca.350.png'
                break

            case 3:
                iDiasem.src ='imagens/quarta.350.png'
                break

            case 4:
                iDiasem.src ='imagens/quinta.350.png'
                break

            case 5:
                iDiasem.src ='imagens/sexta.350.png'
                break

            case 6:
                iDiasem.src ='imagens/sabado.350.png'
                break

            default:
                iDiasem.innerHTML = '[ERRO]'
                break
        }
}

setInterval(carregar, 1000)