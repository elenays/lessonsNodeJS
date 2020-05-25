
// //форматировние цены
// const toCurrency = price => {
//     new Intl.NumberFormat('ru-RU', {
//         currency: 'rub',
//         style: 'currency'
//     }).format(price)
// }

// document.querySelectorAll('.price').forEach(el => {
//     el.textContent = toCurrency(el.textContent)
// })

// ────────────────────────────────────────────────────────────────────────────────

//логика корзины
const $cart = document.querySelector('#cart')
if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/cart/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(cart => {
                    if (cart.courses.lenght) {
                        const html = cart.courses.map(c => {
                            return `
                            <tr>
                                <td>${c.title }</td>
                                <td>${c.count }</td>
                                <td>
                                    <button class='btn btn-small js-remove' data-id="${c.id }">Удалить</button>
                                </td>
                            </tr>
                            `
                        }).join() //приводим массив к строке
                        $cart.querySelector('tbody').innerHTML = html
                        $cart.querySelector('.price').textContent = toCurrency(cart.price)
                    } else {
                        $cart.innerHTML = '<p>Корзина пуста</p>'
                    }
                })
        }
    })
}