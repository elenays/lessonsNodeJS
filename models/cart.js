const path = require('path')
const { promises: fs } = require('fs')

class Cart {

    static async add(course) {

        const cart = await Cart.fetch()
        const idx = cart.courses.findIndex(c => c.id === course.id)
        const candidate = cart.courses[idx]

        //проверяем есть ли такой курс уже в корзине
        if (candidate) {
            candidate.count++
            cart.courses[idx] = candidate
        } else {
            course.count = 1
            cart.courses.push(course)
        }

        cart.price += +course.price

        return fs.writeFile(
            path.join(__dirname, '../data/cart.json'),
            JSON.stringify(cart)
        )
    }

    static async fetch() {
        return fs.readFile(
            path.join(__dirname, '../data/cart.json'),
            'utf-8'
        )
            .then(content => JSON.parse(content))
    }

    static async remove(id) {
        const cart = await Cart.fetch()
        const idx = cart.courses.findIndex(c => c.id === id)
        const course = cart.courses[idx]

        if (course.cont === 1) {
            //удалить
            cart.courses = cart.courses.filter(c => c.id !== id)
        } else {
            //изменить количество
            cart.courses[idx].count--
        }

        cart.price -= course.price

        fs.writeFile(
            path.join(__dirname, '../data/cart.json'),
            JSON.stringify(cart)
        )
        return cart
    }
}

module.exports = Cart