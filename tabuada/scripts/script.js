function tabuada(){
    let num = document.querySelector('input#txtn')
    let tab = document.querySelector('select#seltab')
    let tab1 = document.querySelector('select#seltab1')
    let tab2 = document.querySelector('select#seltab2')
    let tab3 = document.querySelector('select#seltab3')

    if (num.value.length == 0){
        window.alert(`[ERRO] Digite um número`)
    }else{
        let c = 1
        tab.innerHTML = ``
        tab1.innerHTML = ``
        tab2.innerHTML = ``
        tab3.innerHTML = ``

        for (let n = Number(num.value); c <= 10; c++){

            let item = document.createElement('option')
            item.text = `${n} x ${c} = ${n*c}`
            item.value = `tab${c}`
            tab.appendChild(item)

            let item1 = document.createElement('option')
            item1.text = `${n} : ${c} = ${n/c}`
            item1.value = `tab1${c}`
            tab1.appendChild(item1)

            let item2 = document.createElement('option')
            item2.text = `${n} + ${c} = ${n+c}`
            item2.value = `tab1${c}`
            tab2.appendChild(item2)

            let item3 = document.createElement('option')
            item3.text = `${n} - ${c} = ${n-c}`
            item3.value = `tab1${c}`
            tab3.appendChild(item3)
        }
    }
}