const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/coursesList')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const app = express()

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb://localhost:27017/cources`
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false
        })
        const candidate = await User.findOne()

        if (!candidate) {
            const user = new User({
                email: 'elena@ya.ru',
                name: 'Elena',
                cart: { items: [] }
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${ PORT }`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()
// ────────────────────────────────────────────────────────────────────────────────

const hbs = exphbs.create({
    defaultLayout: 'main', //название дефолтного файла
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)//регистрируем в JS что есть такой движок
app.set('view engine', 'hbs') //используем
app.set('views', 'views') //где храним шаблоны

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5ed64cf62458d1410b4b0f7a')
        req.user = user
        next()
    } catch (err) {
        console.log(err)
    }

})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
// ────────────────────────────────────────────────────────────────────────────────
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
